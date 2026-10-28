import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/publicProfile";
import { PublicProfilePage } from "@/components/PublicProfilePage";

type Props = { params: Promise<{ username: string }> };

// /[username] 공개 프로필 페이지 (읽기 전용)
// - params.username으로 유저 조회 (getUserByUsername), 없으면 404
// - 프로필 · 링크(users/{uid}/links)는 화면에서 TanStack Query로 조회
// - 메타데이터(generateMetadata)는 추후 추가 예정
export default async function PersonalPage({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();
  return <PublicProfilePage uid={user.uid} />;
}
