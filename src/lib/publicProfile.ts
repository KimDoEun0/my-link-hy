import { getDoc } from "firebase/firestore";
import { displayNameKey, displayNameRef } from "@/lib/profile";
import { fetchUserProfile, type UserProfile } from "@/lib/auth";

// 개인 페이지 주소: /{표시 이름} (한글 · 공백은 URL 인코딩)
export function personalPagePath(displayName: string): string {
  return `/${encodeURIComponent(displayName)}`;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// 표시 이름으로 유저 조회 (Firestore, 실시간 구독 없음)
// 1) 표시 이름 예약 장부 displayNames/{이름 키} → uid
// 2) users/{uid} 프로필
// 찾지 못하면 null
export async function getUserByDisplayName(displayName: string): Promise<UserProfile | null> {
  const value = safeDecode(displayName).trim();
  if (!value || value === "." || value === ".." || value.includes("/")) return null;

  try {
    const reservation = await getDoc(displayNameRef(displayNameKey(value)));
    if (!reservation.exists()) return null;
    return await fetchUserProfile(reservation.data().uid as string);
  } catch {
    // 잘못된 문서 id 등은 '없는 유저'로 처리
    return null;
  }
}
