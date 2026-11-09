import type { Metadata } from "next";
import ProfilePage from "../page";
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

// 마이페이지는 로그인 전용 개인 화면이라 검색 결과에 노출하지 않음
export const metadata: Metadata = {
  title: "마이페이지",
  openGraph: { ...BASE_OPEN_GRAPH, type: "website", title: `마이페이지 | ${SITE_NAME}`, images: [DEFAULT_OG_IMAGE] },
  robots: { index: false, follow: false },
};

// /mypage 경로: 메인 프로필 페이지와 동일한 화면을 표시
export default ProfilePage;
