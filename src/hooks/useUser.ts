"use client";

import { useSyncExternalStore } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { auth, fetchUserProfile, saveUserProfile } from "@/lib/auth";
import { queryKeys } from "./queryKeys";

// ───────────── 로그인 상태: Firebase 인증 상태를 useSyncExternalStore로 구독 ─────────────
type AuthSnapshot = { user: User | null; loading: boolean };
const SERVER_SNAPSHOT: AuthSnapshot = { user: null, loading: true };
let authSnapshot: AuthSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let listening = false;

function subscribeAuth(onChange: () => void) {
  listeners.add(onChange);
  if (!listening) {
    listening = true;
    onAuthStateChanged(auth, (user) => {
      authSnapshot = { user, loading: false };
      listeners.forEach((listener) => listener());
    });
  }
  return () => {
    listeners.delete(onChange);
  };
}

// 로그인 상태 + Firestore 프로필(users/{uid}) 조회 훅 (TanStack Query, 실시간 구독 없음)
// - user: Firebase 로그인 사용자 (비로그인 시 null)
// - profile: users/{uid} 문서 (로그인 시 1회 조회, 프로필 수정 후 다시 조회)
// - loading: 첫 로그인 상태 확인 전(새로고침 직후) true
export function useUser() {
  const { user, loading } = useSyncExternalStore(subscribeAuth, () => authSnapshot, () => SERVER_SNAPSHOT);
  const uid = user?.uid ?? null;

  // 1) 로그인하면 users/{uid} 저장 (첫 가입 설정 · lastLoginAt 갱신) — 로그인당 1회
  const sync = useQuery({
    queryKey: queryKeys.profileSync(uid),
    queryFn: async () => {
      await saveUserProfile(user as User);
      return true;
    },
    enabled: !!user,
    retry: 0,
  });

  // 2) 저장이 끝나면(실패해도) 프로필 1회 조회
  const profileQuery = useQuery({
    queryKey: queryKeys.profile(uid),
    queryFn: () => fetchUserProfile(uid as string),
    enabled: !!uid && (sync.isSuccess || sync.isError),
  });

  return {
    user,
    profile: profileQuery.data ?? null,
    loading,
    profileLoading: !!uid && profileQuery.isPending,
  };
}
