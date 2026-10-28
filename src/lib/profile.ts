import { z } from "zod";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import { isValidLinkUrl, normalizeUrl } from "@/lib/linkFormSchema";
import type { SocialLinks } from "@/types/mylink";

// ───────────────────────── 규칙 (PRD 4.1 프로필 관리) ─────────────────────────
export const DISPLAY_NAME_MAX = 30; // 표시 이름 최대 30자
export const BIO_MAX = 120; // 한 줄 소개 최대 120자 (줄바꿈 허용)
export const USERNAME_MIN = 3; // username 최소 3자
export const USERNAME_MAX = 20; // username 최대 20자
// username: 공개 주소(/{username})용 고유 아이디 (영문 소문자 · 숫자 · 밑줄), 가입 시 정해지고 수정 불가
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

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.replace(/^mailto:/i, ""));

// ───────────────────────── 프로필 수정 폼 검증 (zod) ─────────────────────────
export const profileFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "표시 이름을 입력해주세요.")
    .max(DISPLAY_NAME_MAX, `표시 이름은 ${DISPLAY_NAME_MAX}자 이하로 입력해주세요.`), // 중복 허용
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
// 별도 예약 컬렉션 없이 users 컬렉션만 사용
const usersCollection = collection(db, "users");
const userRef = (uid: string) => doc(db, "users", uid);

// username으로 유저 uid 조회 (users에서 username 필드 검색, 없으면 null)
export async function findUidByUsername(username: string): Promise<string | null> {
  const snap = await getDocs(query(usersCollection, where("username", "==", normalizeUsername(username)), limit(1)));
  return snap.empty ? null : snap.docs[0].id;
}

// 가입 시 사용할 username 찾기: 이미 쓰는 사람이 있으면 숫자를 붙임 (kim → kim2 → kim3 ...)
export async function findAvailableUsername(uid: string, base: string): Promise<string> {
  for (let n = 1; n <= 50; n++) {
    const candidate = usernameCandidate(base, n);
    const owner = await findUidByUsername(candidate);
    if (!owner || owner === uid) return candidate;
  }
  throw new Error("사용할 수 있는 username을 찾지 못했어요.");
}

// 바뀐 항목 계산 (같으면 빈 객체) — username은 수정 불가라 비교하지 않음
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
export async function updateUserProfile(
  uid: string,
  prev: NormalizedProfile,
  next: NormalizedProfile
): Promise<boolean> {
  const changes = diffProfile(prev, next);
  if (Object.keys(changes).length === 0) return false;
  await updateDoc(userRef(uid), { ...changes, updatedAt: serverTimestamp() });
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
