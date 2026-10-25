"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import { auth, saveUserProfile, userProfileRef, type UserProfile } from "@/lib/auth";

// 로그인 상태 + Firestore 프로필(users/{uid}) 실시간 동기화 훅
// - user: Firebase 로그인 사용자 (비로그인 시 null)
// - profile: users/{uid} 문서 (onSnapshot으로 실시간 반영, 불러오기 전에는 null)
// - loading: 첫 로그인 상태 확인 전(새로고침 직후) true
export function useUser() {
  const [authState, setAuthState] = useState<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true,
  });
  // 어느 uid의 프로필인지 함께 저장해 계정 전환 · 로그아웃 시 이전 프로필이 보이지 않게 함
  const [profileState, setProfileState] = useState<{ uid: string; profile: UserProfile | null } | null>(null);

  // 1) 로그인 상태 구독
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setAuthState({ user, loading: false }));
  }, []);

  // 2) 로그인하면 users/{uid}에 프로필 저장 후, 해당 문서를 실시간 구독
  const user = authState.user;
  useEffect(() => {
    if (!user) return;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    // 저장이 실패해도(네트워크 등) 기존 문서 구독은 계속 진행
    saveUserProfile(user)
      .catch(() => undefined)
      .finally(() => {
        if (cancelled) return;
        unsubscribe = onSnapshot(
          userProfileRef(user.uid),
          (snapshot) =>
            setProfileState({
              uid: user.uid,
              profile: snapshot.exists()
                ? (snapshot.data({ serverTimestamps: "estimate" }) as UserProfile)
                : null,
            }),
          () => setProfileState({ uid: user.uid, profile: null })
        );
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [user]);

  const profile = user && profileState?.uid === user.uid ? profileState.profile : null;
  // 로그인했지만 아직 프로필 문서를 받지 못한 상태
  const profileLoading = !!user && profileState?.uid !== user.uid;

  return { user, profile, loading: authState.loading, profileLoading };
}
