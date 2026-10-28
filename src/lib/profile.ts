import { z } from "zod";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Transaction,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import { isValidLinkUrl, normalizeUrl } from "@/lib/linkFormSchema";
import type { SocialLinks } from "@/types/mylink";

// ───────────────────────── 규칙 (PRD 4.1 프로필 관리) ─────────────────────────
export const DISPLAY_NAME_MAX = 30; // 표시 이름 최대 30자
export const BIO_MAX = 120; // 한 줄 소개 최대 120자 (줄바꿈 허용)
export const USERNAME_MIN = 3; // username 최소 3자
export const USERNAME_MAX = 20; // username 최대 20자
// username: 공개 주소용 고유 아이디 (영문 소문자 · 숫자 · 밑줄)
export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

// username 정규화: 앞뒤 공백 제거 · 앞의 @ 제거 · 소문자
export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@/, "").toLowerCase();
}

// 가입 시 기본 username: 이메일 앞부분을 규칙에 맞게 정리 (허용되지 않는 문자는 _, 길이 3~20자)
export function defaultUsername(email: string | null | undefined, uid: string): string {
  let base = (email?.split("@")[0] ?? "").toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, USERNAME_MAX);
  if (base.length < USERNAME_MIN) base = `user_${uid.slice(0, 6).toLowerCase().replace(/[^a-z0-9_]/g, "_")}`;
  return base;
}

// 중복일 때 뒤에 숫자를 붙인 후보 (최대 길이 유지): kim → kim2 → kim3 ...
export function usernameCandidate(base: string, n: number): string {
  if (n === 1) return base;
  const suffix = String(n);
  return base.slice(0, USERNAME_MAX - suffix.length) + suffix;
}

// PRD 4.1 지원 플랫폼 (입력 순서 = 화면 표시 순서)
export const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/아이디" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@채널" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@아이디" },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://x.com/아이디" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/아이디" },
  { key: "threads", label: "Threads", placeholder: "https://threads.net/@아이디" },
  { key: "chzzk", label: "치지직", placeholder: "https://chzzk.naver.com/채널" },
  { key: "email", label: "Mail", placeholder: "hello@example.com" },
] as const satisfies readonly { key: keyof SocialLinks; label: string; placeholder: string }[];

export type SocialKey = (typeof SOCIAL_FIELDS)[number]["key"];

// 중복 확인용 이름 키: 앞뒤 공백 제거, 연속 공백 1개로, 대소문자 구분 없음
export function displayNameKey(name: string): string {
  return name.normalize("NFC").trim().replace(/\s+/g, " ").toLowerCase();
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.replace(/^mailto:/i, ""));

// ───────────────────────── 프로필 수정 폼 검증 (zod) ─────────────────────────
export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "표시 이름을 입력해주세요.")
    .max(DISPLAY_NAME_MAX, `표시 이름은 ${DISPLAY_NAME_MAX}자 이하로 입력해주세요.`)
    // Firestore 문서 id로 쓰기 때문에 / 와 . , .. 은 사용할 수 없음
    .refine((v) => !v.includes("/") && v !== "." && v !== "..", "표시 이름에 / 는 사용할 수 없어요."),
  // username: 공개 주소용 고유 아이디 (영문 소문자 · 숫자 · _ 3~20자, 중복 불가)
  username: z
    .string()
    .transform(normalizeUsername)
    .pipe(
      z
        .string()
        .min(USERNAME_MIN, `username은 ${USERNAME_MIN}자 이상 입력해주세요.`)
        .max(USERNAME_MAX, `username은 ${USERNAME_MAX}자 이하로 입력해주세요.`)
        .regex(USERNAME_PATTERN, "영문 소문자, 숫자, 밑줄(_)만 사용할 수 있어요.")
    ),
  // 프로필에 표시하는 연락용 이메일 (로그인용 Google 계정 이메일과는 별개)
  email: z.string().trim().min(1, "이메일을 입력해주세요.").refine(isEmail, "올바른 이메일 주소를 입력해주세요."),
  bio: z.string().trim().max(BIO_MAX, `한 줄 소개는 ${BIO_MAX}자 이하로 입력해주세요.`),
  photoURL: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.startsWith("data:image/") || isValidLinkUrl(v),
      "올바른 이미지 주소(예: https://example.com/photo.jpg)를 입력해주세요."
    ),
  socials: z.object(
    Object.fromEntries(
      SOCIAL_FIELDS.map(({ key }) => [
        key,
        z
          .string()
          .trim()
          .refine(
            (v) => v === "" || (key === "email" ? isEmail(v) : isValidLinkUrl(v)),
            key === "email" ? "올바른 이메일 주소를 입력해주세요." : "올바른 URL 형식(예: https://example.com)을 입력해주세요."
          ),
      ])
    ) as unknown as Record<SocialKey, z.ZodString>
  ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// 저장 형태로 정규화 (URL은 https:// 보정, 이메일은 mailto: 제거, 빈 값은 저장하지 않음)
export function normalizeProfile(values: ProfileFormValues) {
  const socials: SocialLinks = {};
  for (const { key } of SOCIAL_FIELDS) {
    const v = values.socials[key].trim();
    if (!v) continue;
    socials[key] = key === "email" ? v.replace(/^mailto:/i, "") : normalizeUrl(v);
  }
  const photo = values.photoURL.trim();
  return {
    displayName: values.displayName.trim().replace(/\s+/g, " "),
    username: normalizeUsername(values.username),
    email: values.email.trim().replace(/^mailto:/i, ""),
    bio: values.bio.trim(),
    photoURL: photo.startsWith("data:image/") ? photo : photo ? normalizeUrl(photo) : "",
    socials,
  };
}

export type NormalizedProfile = ReturnType<typeof normalizeProfile>;

// ───────────────────────── Firestore ─────────────────────────
// displayNames/{이름 키} → { uid } : 표시 이름 예약 장부 (이름 1개 = 문서 1개)
export const displayNameRef = (key: string) => doc(db, "displayNames", key);
const userRef = (uid: string) => doc(db, "users", uid);

export class DisplayNameTakenError extends Error {
  constructor() {
    super("이미 사용 중인 표시 이름이에요.");
  }
}

// 표시 이름 사용 가능 여부 (본인이 쓰고 있는 이름이면 사용 가능)
export async function isDisplayNameAvailable(uid: string, name: string): Promise<boolean> {
  const snap = await getDoc(displayNameRef(displayNameKey(name)));
  return !snap.exists() || snap.data().uid === uid;
}

// 트랜잭션 안에서 이름 예약 (다른 사람이 쓰고 있으면 실패)
export async function reserveDisplayName(tx: Transaction, uid: string, name: string) {
  const key = displayNameKey(name);
  const snap = await tx.get(displayNameRef(key));
  if (snap.exists() && snap.data().uid !== uid) throw new DisplayNameTakenError();
  return key;
}

// usernames/{username} → { uid } : username 예약 장부 (username 1개 = 문서 1개)
export const usernameRef = (username: string) => doc(db, "usernames", username);

export class UsernameTakenError extends Error {
  constructor() {
    super("이미 사용 중인 username이에요.");
  }
}

// username 사용 가능 여부 (본인이 쓰고 있으면 사용 가능)
export async function isUsernameAvailable(uid: string, username: string): Promise<boolean> {
  const snap = await getDoc(usernameRef(normalizeUsername(username)));
  return !snap.exists() || snap.data().uid === uid;
}

// 트랜잭션 안에서 username 예약 확인 (다른 사람이 쓰고 있으면 실패)
export async function reserveUsername(tx: Transaction, uid: string, username: string) {
  const key = normalizeUsername(username);
  const snap = await tx.get(usernameRef(key));
  if (snap.exists() && snap.data().uid !== uid) throw new UsernameTakenError();
  return key;
}

// 바뀐 항목 계산 (같으면 빈 객체)
function diffProfile(prev: NormalizedProfile, next: NormalizedProfile) {
  const changes: Partial<NormalizedProfile> = {};
  if (prev.displayName !== next.displayName) changes.displayName = next.displayName;
  if (prev.username !== next.username) changes.username = next.username;
  if (prev.email !== next.email) changes.email = next.email;
  if (prev.bio !== next.bio) changes.bio = next.bio;
  if (prev.photoURL !== next.photoURL) changes.photoURL = next.photoURL;
  const keys = new Set([...Object.keys(prev.socials), ...Object.keys(next.socials)]) as Set<SocialKey>;
  if ([...keys].some((k) => (prev.socials[k] ?? "") !== (next.socials[k] ?? ""))) changes.socials = next.socials;
  return changes;
}

// 프로필 수정: 변경된 항목만 업데이트, 변경 사항이 없으면 Firestore에 쓰지 않고 false 반환
// - 표시 이름 · username이 바뀌면 트랜잭션으로 새 값 예약 · 예전 값 해제 · 프로필 변경을 한 번에 처리
export async function updateUserProfile(
  uid: string,
  prev: NormalizedProfile,
  next: NormalizedProfile
): Promise<boolean> {
  const changes = diffProfile(prev, next);
  if (Object.keys(changes).length === 0) return false;

  const oldNameKey = displayNameKey(prev.displayName);
  const newNameKey = displayNameKey(next.displayName);
  const nameKeyChanged = changes.displayName !== undefined && oldNameKey !== newNameKey;
  const usernameChanged = changes.username !== undefined && prev.username !== next.username;

  if (!nameKeyChanged && !usernameChanged) {
    // 예약 장부를 건드릴 필요 없는 변경 (이름 대소문자 · 공백, 소개, 사진 등)
    await updateDoc(userRef(uid), { ...changes, updatedAt: serverTimestamp() });
    return true;
  }

  await runTransaction(db, async (tx) => {
    // 1) 읽기 (트랜잭션은 모든 읽기가 쓰기보다 먼저)
    const oldName = nameKeyChanged ? await tx.get(displayNameRef(oldNameKey)) : null;
    if (nameKeyChanged) await reserveDisplayName(tx, uid, next.displayName);
    const oldUser = usernameChanged && prev.username ? await tx.get(usernameRef(prev.username)) : null;
    if (usernameChanged) await reserveUsername(tx, uid, next.username);

    // 2) 쓰기
    const extra: Record<string, unknown> = {};
    if (nameKeyChanged) {
      tx.set(displayNameRef(newNameKey), { uid, displayName: next.displayName, updatedAt: serverTimestamp() });
      if (oldName?.exists() && oldName.data().uid === uid) tx.delete(displayNameRef(oldNameKey));
      extra.displayNameKey = newNameKey;
    }
    if (usernameChanged) {
      tx.set(usernameRef(next.username), { uid, updatedAt: serverTimestamp() });
      if (oldUser?.exists() && oldUser.data().uid === uid) tx.delete(usernameRef(prev.username));
    }
    tx.update(userRef(uid), { ...changes, ...extra, updatedAt: serverTimestamp() });
  });
  return true;
}

// ───────────────────────── 화면 ↔ 저장 값 변환 ─────────────────────────
// users/{uid} 프로필 → 폼 값 (프로필 수정 다이얼로그 · 인라인 수정 공용)
export function profileToFormValues(profile: {
  displayName?: string;
  username?: string;
  email?: string;
  bio?: string;
  photoURL?: string;
  socials?: SocialLinks;
}): ProfileFormValues {
  return {
    displayName: profile.displayName ?? "",
    username: profile.username ?? "",
    email: profile.email ?? "",
    bio: profile.bio ?? "",
    photoURL: profile.photoURL ?? "",
    socials: Object.fromEntries(
      SOCIAL_FIELDS.map(({ key }) => [key, profile.socials?.[key] ?? ""])
    ) as ProfileFormValues["socials"],
  };
}

// 프로필 일부 항목만 저장 (인라인 수정용): 나머지는 현재 값 유지, 변경 없으면 false
export async function saveProfileFields(
  uid: string,
  profile: Parameters<typeof profileToFormValues>[0],
  patch: Partial<ProfileFormValues>
): Promise<boolean> {
  const current = profileToFormValues(profile);
  return updateUserProfile(uid, normalizeProfile(current), normalizeProfile({ ...current, ...patch }));
}
