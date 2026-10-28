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

// 바뀐 항목 계산 (같으면 빈 객체)
function diffProfile(prev: NormalizedProfile, next: NormalizedProfile) {
  const changes: Partial<NormalizedProfile> = {};
  if (prev.displayName !== next.displayName) changes.displayName = next.displayName;
  if (prev.email !== next.email) changes.email = next.email;
  if (prev.bio !== next.bio) changes.bio = next.bio;
  if (prev.photoURL !== next.photoURL) changes.photoURL = next.photoURL;
  const keys = new Set([...Object.keys(prev.socials), ...Object.keys(next.socials)]) as Set<SocialKey>;
  if ([...keys].some((k) => (prev.socials[k] ?? "") !== (next.socials[k] ?? ""))) changes.socials = next.socials;
  return changes;
}

// 프로필 수정: 변경된 항목만 업데이트, 변경 사항이 없으면 Firestore에 쓰지 않고 false 반환
// - 표시 이름이 바뀌면 트랜잭션으로 새 이름 예약 · 예전 이름 해제 · 프로필 변경을 한 번에 처리
export async function updateUserProfile(
  uid: string,
  prev: NormalizedProfile,
  next: NormalizedProfile
): Promise<boolean> {
  const changes = diffProfile(prev, next);
  if (Object.keys(changes).length === 0) return false;

  const oldKey = displayNameKey(prev.displayName);
  const newKey = displayNameKey(next.displayName);

  if (changes.displayName !== undefined && oldKey !== newKey) {
    await runTransaction(db, async (tx) => {
      const oldSnap = await tx.get(displayNameRef(oldKey));
      const key = await reserveDisplayName(tx, uid, next.displayName);
      tx.set(displayNameRef(key), { uid, displayName: next.displayName, updatedAt: serverTimestamp() });
      if (oldSnap.exists() && oldSnap.data().uid === uid) tx.delete(displayNameRef(oldKey));
      tx.update(userRef(uid), { ...changes, displayNameKey: key, updatedAt: serverTimestamp() });
    });
  } else {
    // 이름 대소문자·공백만 바뀐 경우 등은 예약 키가 같으므로 프로필만 갱신
    await updateDoc(userRef(uid), { ...changes, updatedAt: serverTimestamp() });
  }
  return true;
}

// ───────────────────────── 화면 ↔ 저장 값 변환 ─────────────────────────
// users/{uid} 프로필 → 폼 값 (프로필 수정 다이얼로그 · 인라인 수정 공용)
export function profileToFormValues(profile: {
  displayName?: string;
  email?: string;
  bio?: string;
  photoURL?: string;
  socials?: SocialLinks;
}): ProfileFormValues {
  return {
    displayName: profile.displayName ?? "",
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
