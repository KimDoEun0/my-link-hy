"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { displayNameKey, isDisplayNameAvailable } from "@/lib/profile";
import { useDebouncedValue } from "./useDebouncedValue";
import { queryKeys } from "./queryKeys";

// 표시 이름 중복 확인 훅 (TanStack Query)
// - 입력이 0.5초 멈추면 displayNames/{이름 키}를 조회, 같은 이름은 30초 동안 캐시 사용
// - enabled: 편집 중이고 형식 검증을 통과했을 때만 확인
// - 현재 내 이름과 같으면(대소문자 · 공백 무시) 확인하지 않음
export function useDisplayNameCheck(uid: string, currentName: string, typedName: string, enabled: boolean) {
  const queryClient = useQueryClient();
  const typedKey = displayNameKey(typedName);
  const debouncedName = useDebouncedValue(typedName, 500);
  const debouncedKey = displayNameKey(debouncedName);
  const unchanged = typedKey === displayNameKey(currentName);
  const shouldCheck = enabled && !unchanged && typedKey.length > 0;
  const settled = debouncedKey === typedKey; // 입력이 멈춘 상태

  const query = useQuery({
    queryKey: queryKeys.displayNameAvailable(uid, debouncedKey),
    queryFn: () => isDisplayNameAvailable(uid, debouncedName),
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
    markTaken: () => queryClient.setQueryData(queryKeys.displayNameAvailable(uid, typedKey), false),
    // 편집을 새로 시작할 때 이전 확인 결과 비우기
    reset: () => queryClient.removeQueries({ queryKey: queryKeys.displayNameAvailableAll }),
  };
}
