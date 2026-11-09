import type { Metadata } from "next";
import { MyLinkPage } from "@/components/MyLinkPage";
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

// 내 페이지 미리보기는 로그인 전용 화면이라 검색 결과에 노출하지 않음
export const metadata: Metadata = {
  title: "내 페이지 미리보기",
  openGraph: { ...BASE_OPEN_GRAPH, type: "website", title: `내 페이지 미리보기 | ${SITE_NAME}`, images: [DEFAULT_OG_IMAGE] },
  robots: { index: false, follow: false },
};

// /mypage/preview: 내 페이지 미리보기 (방문자에게 보이는 모습, 편집 기능 숨김)
export default function MyPagePreview() {
  return <MyLinkPage preview />;
}
