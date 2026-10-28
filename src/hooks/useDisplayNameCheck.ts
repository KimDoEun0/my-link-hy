"use client";

import { useEffect, useState } from "react";
import { displayNameKey, isDisplayNameAvailable } from "@/lib/profile";

// 표시 이름 실시간 중복 확인 훅 (입력 후 0.5초 뒤 displayNames/{이름 키} 확인)
// - enabled: 편집 중이고 형식 검증을 통과했을 때만 확인
// - 현재 내 이름과 같으면(대소문자 · 공백 무시) 확인하지 않음
export function useDisplayNameCheck(uid: string, currentName: string, typedName: string, enabled: boolean) {
  const typedKey = displayNameKey(typedName);
  const unchanged = typedKey === displayNameKey(currentName);
  const [result, setResult] = useState<{ key: string; available: boolean } | null>(null);
  const shouldCheck = enabled && !unchanged && typedKey.length > 0;

  useEffect(() => {
    if (!shouldCheck) return;
    let ignore = false;
    const timer = window.setTimeout(async () => {
      try {
        const available = await isDisplayNameAvailable(uid, typedName);
        if (!ignore) setResult({ key: typedKey, available });
      } catch {
        if (!ignore) setResult(null);
      }
    }, 500);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [shouldCheck, uid, typedKey, typedName]);

  const current = result?.key === typedKey ? result : null;
  return {
    unchanged,
    checking: shouldCheck && !current,
    taken: !unchanged && current?.available === false,
    available: !unchanged && current?.available === true,
    // 저장 시 트랜잭션에서 중복이 확인되면 결과를 '사용 중'으로 고정
    markTaken: () => setResult({ key: typedKey, available: false }),
    reset: () => setResult(null),
  };
}
