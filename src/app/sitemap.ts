import type { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firestore";
import { personalPagePath } from "@/lib/publicProfile";
import { SITE_URL } from "@/lib/site";

// /sitemap.xml: 검색엔진에 알려줄 페이지 목록
// - 메인(/) + 공개 프로필(/{username}) 전체
// - 새로 가입한 유저도 반영되도록 1시간마다 다시 생성
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  try {
    // users 컬렉션은 누구나 읽기 가능 (보안 규칙) → username이 있는 유저만 추가
    const snapshot = await getDocs(collection(db, "users"));
    snapshot.forEach((doc) => {
      const { username, updatedAt } = doc.data() as { username?: string; updatedAt?: { toDate: () => Date } };
      if (!username) return;
      pages.push({
        url: `${SITE_URL}${personalPagePath(username)}`,
        lastModified: updatedAt?.toDate?.() ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  } catch {
    // 조회에 실패해도 메인 페이지만 담아 응답
  }

  return pages;
}
