import type { Metadata } from "next";
import { MyLinkPage } from "@/components/MyLinkPage";

// 메인 페이지 메타데이터: 기본 제목(layout) 사용 + 대표 주소 지정
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// 메인 화면: 비로그인 시 랜딩, 로그인 시 마이페이지
export default function Home() {
  return <MyLinkPage />;
}
