import { notFound } from "next/navigation";
import { getUserByDisplayName } from "@/lib/publicProfile";
import { PublicProfilePage } from "@/components/PublicProfilePage";

type Props = { params: Promise<{ displayName: string }> };

// /[displayName] 공개 프로필 페이지 (읽기 전용)
// - params.displayName으로 유저 조회 (getUserByDisplayName), 없으면 404
// - 프로필 · 링크(users/{uid}/links)는 화면에서 TanStack Query로 조회
// - 메타데이터(generateMetadata)는 추후 추가 예정
export default async function PersonalPage({ params }: Props) {
  const { displayName } = await params;
  const user = await getUserByDisplayName(displayName);
  if (!user) notFound();
  return <PublicProfilePage uid={user.uid} />;
}
