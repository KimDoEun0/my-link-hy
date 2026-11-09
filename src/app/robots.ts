import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt: 검색엔진 수집 규칙
// - 전체 허용, 로그인 전용 화면(/mypage, /stats)은 제외
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mypage", "/stats"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
