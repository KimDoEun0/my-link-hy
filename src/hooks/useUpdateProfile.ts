"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  normalizeProfile,
  profileToFormValues,
  saveProfileFields,
  type ProfileFormValues,
} from "@/lib/profile";
import type { UserProfile } from "@/lib/auth";
import { queryKeys } from "./queryKeys";

type ProfilePatch = Partial<ProfileFormValues>;

// 프로필 일부 항목 저장 (인라인 수정용) — 낙관적 업데이트
// 1) onMutate: 서버 응답 전에 캐시(화면)를 새 값으로 먼저 변경
// 2) mutationFn: Firestore 저장 (변경 사항이 없으면 쓰지 않고 false 반환)
// 3) onError: 저장 실패 시 캐시를 이전 값으로 되돌림
// 4) 성공 시 다시 조회하지 않음 (실시간 구독 · 자동 재요청 없음)
export function useUpdateProfile(uid: string, profile: UserProfile) {
  const queryClient = useQueryClient();
  const key = queryKeys.profile(uid);

  return useMutation({
    mutationFn: (patch: ProfilePatch) => saveProfileFields(uid, profile, patch),

    onMutate: async (patch: ProfilePatch) => {
      // 진행 중인 프로필 조회가 낙관적 값을 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<UserProfile | null>(key);

      // 저장될 형태로 정규화한 값을 수정한 항목만 캐시에 반영
      const next = normalizeProfile({ ...profileToFormValues(previous ?? profile), ...patch });
      const optimistic: Partial<UserProfile> = {};
      for (const field of Object.keys(patch) as (keyof ProfilePatch)[]) {
        Object.assign(optimistic, { [field]: next[field] });
      }

      queryClient.setQueryData<UserProfile | null>(key, (prev) => (prev ? { ...prev, ...optimistic } : prev));
      return { previous };
    },

    onError: (_error, _patch, context) => {
      // 실패: 이전 프로필로 되돌림
      if (context) queryClient.setQueryData(key, context.previous);
    },

  });
}
