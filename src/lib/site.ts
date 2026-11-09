// 사이트 공통 정보 (메타데이터 · robots · sitemap에서 함께 사용)

// 사이트 기준 주소
// - Vercel 배포: 프로덕션 도메인(VERCEL_PROJECT_PRODUCTION_URL), 로컬: localhost:3000
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const SITE_NAME = "마이링크 (MyLink)";

export const SITE_DESCRIPTION =
  "흩어져 있는 개발 활동을 하나의 링크로. GitHub · 블로그 · 포트폴리오를 한 페이지에 모아 공유하는 개발자를 위한 멀티링크 서비스, 마이링크(MyLink)입니다.";

// openGraph 공통 값
// - 페이지에서 openGraph를 지정하면 layout 값이 통째로 바뀌므로, 페이지에서도 이 값을 펼쳐서 함께 사용
export const BASE_OPEN_GRAPH = {
  locale: "ko_KR",
  siteName: SITE_NAME,
} as const;

// 기본 OG 이미지(app/opengraph-image.tsx)
// - openGraph를 직접 지정한 하위 페이지는 루트 이미지를 물려받지 못하므로 명시적으로 연결
export const DEFAULT_OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "MyLink - 흩어진 링크를 하나의 페이지로" };

export const SITE_KEYWORDS = [
  "마이링크",
  "MyLink",
  "멀티링크",
  "링크인바이오",
  "link in bio",
  "개발자 포트폴리오",
  "개발자 프로필",
  "링크 모음",
  "프로필 링크",
];
