import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { db } from "@/lib/firestore";

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
  displayName: string;
  email: string;
  photoURL: string;
  createdAt?: Timestamp; // 첫 로그인(가입) 시각
  lastLoginAt?: Timestamp; // 최근 로그인 시각
}

// 유저 프로필 문서 참조: users/{uid}
export const userProfileRef = (uid: string) => doc(db, "users", uid);

// 로그인한 유저 정보를 users/{uid}에 저장 (최초 로그인 시에만 createdAt 기록, 매 로그인마다 lastLoginAt 갱신)
// 화면 표시는 useUser 훅이 이 문서를 실시간 구독(onSnapshot)하여 처리
export async function saveUserProfile(user: User): Promise<void> {
  const ref = userProfileRef(user.uid);
  const snapshot = await getDoc(ref);

  await setDoc(
    ref,
    {
      uid: user.uid,
      displayName: getDisplayName(user), // 이메일 앞부분
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      lastLoginAt: serverTimestamp(),
      ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}
