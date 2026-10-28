import { fetchUserProfile, type UserProfile } from "@/lib/auth";
import { USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN, findUidByUsername, normalizeUsername } from "@/lib/profile";

// 개인 페이지 주소: /{username}
export function personalPagePath(username: string): string {
  return `/${encodeURIComponent(username)}`;
}

// username으로 유저 조회 (Firestore users 컬렉션 검색, 실시간 구독 없음)
// 1) users에서 username 필드가 같은 문서 → uid
// 2) users/{uid} 프로필
// 형식이 맞지 않거나 찾지 못하면 null
export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  let value: string;
  try {
    value = normalizeUsername(decodeURIComponent(username));
  } catch {
    return null;
  }
  if (value.length < USERNAME_MIN || value.length > USERNAME_MAX || !USERNAME_PATTERN.test(value)) return null;

  try {
    const uid = await findUidByUsername(value);
    return uid ? await fetchUserProfile(uid) : null;
  } catch {
    return null;
  }
}
