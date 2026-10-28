import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { doc, runTransaction, serverTimestamp, type Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { db } from "@/lib/firestore";
import { DisplayNameTakenError, displayNameRef, reserveDisplayName } from "@/lib/profile";
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
  displayName: string; // 표시 이름 (가입 시 이메일 앞부분, 이후 프로필 수정으로 변경 가능)
  displayNameKey?: string; // 중복 확인용 이름 키 (displayNames/{key}와 연결)
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

// 로그인할 때 users/{uid} 저장 (트랜잭션)
// - 첫 가입: 표시 이름 = 이메일 앞부분 (이미 쓰는 사람이 있으면 숫자를 붙임: kim → kim2), 이름 예약
// - 이후 로그인: lastLoginAt만 갱신 (사용자가 수정한 이름 · 이메일 · 사진 · 소개는 유지)
// - 이름 예약이 없는 기존 가입자: 현재 이름을 예약 장부(displayNames)에 등록
// 화면 표시는 useUser 훅이 이 문서를 실시간 구독(onSnapshot)하여 처리
export async function saveUserProfile(user: User): Promise<void> {
  const ref = userProfileRef(user.uid);

  await runTransaction(db, async (tx) => {
    const snapshot = await tx.get(ref);

    if (!snapshot.exists()) {
      const base = getDisplayName(user);
      let name = base;
      let key = "";
      for (let n = 1; n <= 50; n++) {
        name = n === 1 ? base : `${base}${n}`;
        try {
          key = await reserveDisplayName(tx, user.uid, name);
          break;
        } catch (error) {
          if (!(error instanceof DisplayNameTakenError)) throw error;
        }
      }
      tx.set(displayNameRef(key), { uid: user.uid, displayName: name, updatedAt: serverTimestamp() });
      tx.set(ref, {
        uid: user.uid,
        displayName: name,
        displayNameKey: key,
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
    if (!data.displayNameKey && data.displayName) {
      try {
        const key = await reserveDisplayName(tx, user.uid, data.displayName);
        tx.set(displayNameRef(key), { uid: user.uid, displayName: data.displayName, updatedAt: serverTimestamp() });
        updates.displayNameKey = key;
      } catch (error) {
        // 다른 사람이 이미 같은 이름을 예약했으면 등록하지 않음 (프로필 수정에서 새 이름을 정할 수 있음)
        if (!(error instanceof DisplayNameTakenError)) throw error;
      }
    }
    tx.update(ref, updates);
  });
}
