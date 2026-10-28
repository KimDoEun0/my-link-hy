import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, type Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { db } from "@/lib/firestore";
import { defaultUsername, findAvailableUsername } from "@/lib/profile";
import type { SocialLinks } from "@/types/mylink";

// Firebase 인증 인스턴스
export const auth: Auth = getAuth(app);

// Google 로그인: 매번 계정 선택 창을 띄움
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// 디스플레이 네임: 이메일 앞부분(@ 앞) 사용 (예: hong@gmail.com → hong)
export function getDisplayName(user: Pick<User, "email" | "uid">): string {
  return user.email?.split("@")[0] || user.uid.slice(0, 8);
}

// Firestore users/{uid} 문서에 저장되는 유저 정보
export interface UserProfile {
  uid: string;
  displayName: string; // 표시 이름 (가입 시 이메일 앞부분, 이후 자유롭게 수정 · 중복 허용)
  username?: string; // 공개 주소(/{username})용 고유 아이디 (가입 시 이메일 앞부분, 수정 불가)
  email: string;
  photoURL: string; // 프로필 이미지 (가입 시 Google 사진, 이후 URL 입력 · 업로드로 변경 가능)
  bio?: string; // 한 줄 소개
  socials?: SocialLinks; // 소셜 미디어 링크
  createdAt?: Timestamp; // 첫 로그인(가입) 시각
  lastLoginAt?: Timestamp; // 최근 로그인 시각
  updatedAt?: Timestamp; // 프로필 수정 시각
}

// 유저 프로필 문서 참조: users/{uid}
export const userProfileRef = (uid: string) => doc(db, "users", uid);

// 로그인할 때 users/{uid} 저장
// - 첫 가입: 표시 이름 = 이메일 앞부분, username = 이메일 앞부분 (이미 쓰는 사람이 있으면 숫자를 붙임)
// - 이후 로그인: lastLoginAt만 갱신 (사용자가 수정한 이름 · 이메일 · 사진 · 소개는 유지)
// - username이 없는 기존 가입자: 새로 지정
// 화면 표시는 useUser 훅이 이 문서를 TanStack Query로 1회 조회하여 처리 (실시간 구독 없음)
export async function saveUserProfile(user: User): Promise<void> {
  const ref = userProfileRef(user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    const username = await findAvailableUsername(user.uid, defaultUsername(user.email, user.uid));
    await setDoc(ref, {
      uid: user.uid,
      displayName: getDisplayName(user),
      username,
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      bio: "",
      socials: {},
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    return;
  }

  const data = snapshot.data() as UserProfile;
  const updates: Record<string, unknown> = { lastLoginAt: serverTimestamp() };
  if (!data.username) {
    updates.username = await findAvailableUsername(user.uid, defaultUsername(data.email || user.email, user.uid));
  }
  await updateDoc(ref, updates);
}

// 프로필 1회 조회 (실시간 구독 아님): users/{uid} 문서, 없으면 null
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userProfileRef(uid));
  return snapshot.exists() ? (snapshot.data({ serverTimestamps: "estimate" }) as UserProfile) : null;
}
