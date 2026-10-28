import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { doc, getDoc, runTransaction, serverTimestamp, type Timestamp, type Transaction } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { db } from "@/lib/firestore";
import {
  DisplayNameTakenError,
  UsernameTakenError,
  defaultUsername,
  displayNameRef,
  reserveDisplayName,
  reserveUsername,
  usernameCandidate,
  usernameRef,
} from "@/lib/profile";
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
  username?: string; // 공개 주소용 고유 아이디 (usernames/{username}과 연결, 가입 시 이메일 앞부분)
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

// 트랜잭션 안에서 사용할 수 있는 이름을 찾음: 이미 쓰는 사람이 있으면 숫자를 붙임 (kim → kim2 → kim3 ...)
// 읽기만 하고 쓰기는 하지 않음 (트랜잭션은 모든 읽기가 쓰기보다 먼저)
async function findAvailableDisplayName(tx: Transaction, uid: string, base: string) {
  for (let n = 1; n <= 50; n++) {
    const name = n === 1 ? base : `${base}${n}`;
    try {
      return { name, key: await reserveDisplayName(tx, uid, name) };
    } catch (error) {
      if (!(error instanceof DisplayNameTakenError)) throw error;
    }
  }
  throw new DisplayNameTakenError();
}

async function findAvailableUsername(tx: Transaction, uid: string, base: string) {
  for (let n = 1; n <= 50; n++) {
    try {
      return await reserveUsername(tx, uid, usernameCandidate(base, n));
    } catch (error) {
      if (!(error instanceof UsernameTakenError)) throw error;
    }
  }
  throw new UsernameTakenError();
}

// 로그인할 때 users/{uid} 저장 (트랜잭션)
// - 첫 가입: 표시 이름 · username = 이메일 앞부분 (이미 쓰는 사람이 있으면 숫자를 붙임), 각각 예약
// - 이후 로그인: lastLoginAt만 갱신 (사용자가 수정한 이름 · username · 이메일 · 사진 · 소개는 유지)
// - 예약이 없는 기존 가입자: 현재 이름을 displayNames에 등록, username이 없으면 새로 지정해 usernames에 등록
// 화면 표시는 useUser 훅이 이 문서를 TanStack Query로 1회 조회하여 처리 (실시간 구독 없음)
export async function saveUserProfile(user: User): Promise<void> {
  const ref = userProfileRef(user.uid);

  await runTransaction(db, async (tx) => {
    // ── 1) 읽기 ──
    const snapshot = await tx.get(ref);

    if (!snapshot.exists()) {
      const { name, key } = await findAvailableDisplayName(tx, user.uid, getDisplayName(user));
      const username = await findAvailableUsername(tx, user.uid, defaultUsername(user.email, user.uid));

      // ── 2) 쓰기 ──
      tx.set(displayNameRef(key), { uid: user.uid, displayName: name, updatedAt: serverTimestamp() });
      tx.set(usernameRef(username), { uid: user.uid, updatedAt: serverTimestamp() });
      tx.set(ref, {
        uid: user.uid,
        displayName: name,
        displayNameKey: key,
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
    let nameKey: string | null = null;
    if (!data.displayNameKey && data.displayName) {
      try {
        nameKey = await reserveDisplayName(tx, user.uid, data.displayName);
      } catch (error) {
        // 다른 사람이 이미 같은 이름을 예약했으면 등록하지 않음 (인라인 수정으로 새 이름을 정할 수 있음)
        if (!(error instanceof DisplayNameTakenError)) throw error;
      }
    }
    const username = data.username ? null : await findAvailableUsername(tx, user.uid, defaultUsername(data.email || user.email, user.uid));

    // ── 2) 쓰기 ──
    const updates: Record<string, unknown> = { lastLoginAt: serverTimestamp() };
    if (nameKey) {
      tx.set(displayNameRef(nameKey), { uid: user.uid, displayName: data.displayName, updatedAt: serverTimestamp() });
      updates.displayNameKey = nameKey;
    }
    if (username) {
      tx.set(usernameRef(username), { uid: user.uid, updatedAt: serverTimestamp() });
      updates.username = username;
    }
    tx.update(ref, updates);
  });
}

// 프로필 1회 조회 (실시간 구독 아님): users/{uid} 문서, 없으면 null
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userProfileRef(uid));
  return snapshot.exists() ? (snapshot.data({ serverTimestamps: "estimate" }) as UserProfile) : null;
}
