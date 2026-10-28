"use client";

import { useEffect, useState } from "react";

// 입력값을 delay(ms) 동안 바뀌지 않을 때만 반영 (데이터 조회가 아닌 입력 대기용)
export function useDebouncedValue<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
