"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { displayNameKey, isDisplayNameAvailable, isUsernameAvailable, normalizeUsername } from "@/lib/profile";
import { useDebouncedValue } from "./useDebouncedValue";
import { queryKeys } from "./queryKeys";

type UniqueKind = "displayName" | "username";

const RULES: Record<UniqueKind, { toKey: (v: string) => string; isAvailable: (uid: string, v: string) => Promise<boolean> }> = {
  displayName: { toKey: displayNameKey, isAvailable: isDisplayNameAvailable },
  username: { toKey: normalizeUsername, isAvailable: isUsernameAvailable },
};

// 중복 확인 공용 훅 (TanStack Query) — 표시 이름 · username
// - 입력이 0.5초 멈추면 예약 장부를 조회, 같은 값은 30초 동안 캐시 사용
// - enabled: 편집 중이고 형식 검증을 통과했을 때만 확인
// - 현재 내 값과 같으면 확인하지 않음
function useUniqueCheck(kind: UniqueKind, uid: string, currentValue: string, typedValue: string, enabled: boolean) {
  const queryClient = useQueryClient();
  const { toKey, isAvailable } = RULES[kind];
  const typedKey = toKey(typedValue);
  const debouncedValue = useDebouncedValue(typedValue, 500);
  const debouncedKey = toKey(debouncedValue);
  const unchanged = typedKey === toKey(currentValue);
  const shouldCheck = enabled && !unchanged && typedKey.length > 0;
  const settled = debouncedKey === typedKey; // 입력이 멈춘 상태

  const query = useQuery({
    queryKey: queryKeys.availability(kind, uid, debouncedKey),
    queryFn: () => isAvailable(uid, debouncedValue),
    enabled: shouldCheck && settled,
    staleTime: 30_000,
    retry: 0,
  });

  const result = shouldCheck && settled ? query.data : undefined;
  return {
    unchanged,
    checking: shouldCheck && result === undefined && !query.isError,
    taken: shouldCheck && result === false,
    available: shouldCheck && result === true,
    // 저장 시 트랜잭션에서 중복이 확인되면 결과를 '사용 중'으로 고정
    markTaken: () => queryClient.setQueryData(queryKeys.availability(kind, uid, typedKey), false),
    // 편집을 새로 시작할 때 이전 확인 결과 비우기
    reset: () => queryClient.removeQueries({ queryKey: queryKeys.availabilityAll(kind) }),
  };
}

// 표시 이름 중복 확인 (대소문자 · 공백 무시)
export function useDisplayNameCheck(uid: string, currentName: string, typedName: string, enabled: boolean) {
  return useUniqueCheck("displayName", uid, currentName, typedName, enabled);
}

// username 중복 확인 (소문자 · 앞의 @ 무시)
export function useUsernameCheck(uid: string, currentUsername: string, typedUsername: string, enabled: boolean) {
  return useUniqueCheck("username", uid, currentUsername, typedUsername, enabled);
}
