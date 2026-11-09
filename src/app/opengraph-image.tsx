import { ImageResponse } from "next/og";
import {
  DEFAULT_OG_ALT,
  DEFAULT_OG_GLYPHS,
  DefaultOgContent,
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadDefaultOgFavicons,
  loadOgFonts,
} from "@/lib/og";

// 일반 경로(/, /mypage, /stats 등)용 기본 OG 이미지
// - 왼쪽: 다크 네이비 + 큰 글씨, 오른쪽: 프로필 카드 + 클릭 통계 카드 (서비스 기능을 화면으로 소개)
// - 루트에 두어 하위 경로 전체에 적용 (동적 경로 /[username]은 자체 이미지 사용)
// - 요청 데이터를 쓰지 않으므로 빌드 시 한 번 생성되어 캐시됨
// - Firebase 등 Node.js 전용 기능과 맞추기 위해 Node.js Runtime 사용
export const runtime = "nodejs";
export const alt = DEFAULT_OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const [fonts, favicons] = await Promise.all([loadOgFonts(DEFAULT_OG_GLYPHS), loadDefaultOgFavicons()]);
  return new ImageResponse(<DefaultOgContent favicons={favicons} />, { ...size, fonts });
}
