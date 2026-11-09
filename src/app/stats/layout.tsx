import type { Metadata } from "next";
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

// /stats 메타데이터
// - page.tsx가 클라이언트 컴포넌트("use client")라 metadata를 내보낼 수 없어 layout에서 지정
// - 로그인 전용 통계 화면이라 검색 결과에 노출하지 않음
export const metadata: Metadata = {
  title: "통계 대시보드",
  description: "내 링크의 총 클릭 수와 링크별 클릭 수를 한눈에 확인하는 통계 대시보드입니다.",
  openGraph: { ...BASE_OPEN_GRAPH, type: "website", title: `통계 대시보드 | ${SITE_NAME}`, images: [DEFAULT_OG_IMAGE] },
  robots: { index: false, follow: false },
};

export default function StatsLayout({ children }: LayoutProps<"/stats">) {
  return children;
}
