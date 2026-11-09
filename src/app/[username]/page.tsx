import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getUserByUsername, personalPagePath } from "@/lib/publicProfile";
import { PublicProfilePage } from "@/components/PublicProfilePage";
import { BASE_OPEN_GRAPH } from "@/lib/site";

type Props = { params: Promise<{ username: string }> };

// 같은 요청 안에서 generateMetadata와 페이지가 유저를 한 번만 조회하도록 캐시
const getUser = cache(getUserByUsername);

// 공개 프로필 메타데이터 (SEO)
// - 제목: "이름 (@username)", 설명: 한 줄 소개 (없으면 기본 문구)
// - 유저가 없으면 notFound() → 404 + noindex 자동 적용
// - OG 이미지는 같은 폴더의 opengraph-image.tsx가 자동 연결
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);
  if (!user) notFound();

  const handle = user.username ?? username;
  const name = user.displayName || handle;
  const title = `${name} (@${handle})`;
  const bio = (user.bio ?? "").replace(/\s+/g, " ").trim();
  const description = bio || `${name}님의 GitHub · 블로그 · 포트폴리오 링크를 한 페이지에서 확인해보세요.`;
  const path = personalPagePath(handle);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...BASE_OPEN_GRAPH, type: "profile", url: path, title, description, username: handle },
    twitter: { card: "summary_large_image", title, description },
  };
}

// /[username] 공개 프로필 페이지 (읽기 전용)
// - params.username으로 유저 조회 (getUserByUsername), 없으면 404
// - 프로필 · 링크(users/{uid}/links)는 화면에서 TanStack Query로 조회
export default async function PersonalPage({ params }: Props) {
  const { username } = await params;
  const user = await getUser(username);
  if (!user) notFound();
  return <PublicProfilePage uid={user.uid} />;
}
