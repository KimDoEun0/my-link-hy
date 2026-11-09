import { ImageResponse } from "next/og";
import { DEFAULT_OG_GLYPHS, DefaultOgContent, OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from "@/lib/og";

// 일반 경로(/, /mypage, /stats 등)용 기본 OG 이미지 (랜딩 페이지 히어로 섹션과 같은 디자인)
// - 루트에 두어 하위 경로 전체에 적용 (동적 경로 /[username]은 자체 이미지 사용)
// - 요청 데이터를 쓰지 않으므로 빌드 시 한 번 생성되어 캐시됨
// - Firebase 등 Node.js 전용 기능과 맞추기 위해 Node.js Runtime 사용
export const runtime = "nodejs";
export const alt = "MyLink - Development in One Link";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const fonts = await loadOgFonts(DEFAULT_OG_GLYPHS);
  return new ImageResponse(<DefaultOgContent />, { ...size, fonts });
}
