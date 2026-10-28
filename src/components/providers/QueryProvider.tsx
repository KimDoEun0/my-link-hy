"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// TanStack Query 설정: 실시간 · 자동 재요청 없음 (갱신형)
// - 한 번 불러온 데이터는 새로고침하거나 직접 추가 · 수정 · 삭제할 때만 바뀜
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // 직접 갱신하기 전까지 다시 불러오지 않음
        refetchOnWindowFocus: false, // 창에 다시 들어와도 재요청 안 함
        refetchOnReconnect: false, // 네트워크 재연결 시 재요청 안 함
        retry: 1,
      },
    },
  });
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // 요청마다 새 클라이언트가 만들어지지 않도록 컴포넌트 수명 동안 하나만 사용
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
