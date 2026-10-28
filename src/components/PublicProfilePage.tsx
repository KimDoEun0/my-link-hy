"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/auth";
import { LinkCard, LinkCardSkeleton, SocialIconBar } from "@/components/profile";
import { fetchUserProfile } from "@/lib/auth";
import { personalPagePath } from "@/lib/publicProfile";
import { useUser } from "@/hooks/useUser";
import { useLinks } from "@/hooks/useLinks";
import { useAuthActions } from "@/hooks/useAuthActions";
import { queryKeys } from "@/hooks/queryKeys";

const MY_PAGE_PATH = "/mypage";
const PREVIEW_PATH = "/mypage/preview";

// 공개 프로필 페이지 (/{username}) — 본인 여부와 관계없이 읽기 전용
// - 프로필: users/{uid}, 링크: users/{uid}/links (TanStack Query 1회 조회, 실시간 구독 없음)
// - 링크 카드는 readonly로 렌더링해 링크 클릭(새 탭 이동)만 가능
export function PublicProfilePage({ uid }: { uid: string }) {
  // 보고 있는 사람(로그인 사용자) 정보: 헤더 · '내 페이지' 판단용
  const { user, profile: viewerProfile, loading: authLoading } = useUser();
  const { signingIn, login, logout } = useAuthActions((message) => toast(message));

  // 페이지 주인의 프로필 · 링크
  const profileQuery = useQuery({
    queryKey: queryKeys.profile(uid),
    queryFn: () => fetchUserProfile(uid),
  });
  const linksQuery = useLinks(uid);
  const profile = profileQuery.data;
  const links = linksQuery.data ?? [];

  const viewerPagePath = viewerProfile?.username ? personalPagePath(viewerProfile.username) : undefined;

  const copyMyLink = async () => {
    const url = `${window.location.origin}${viewerPagePath ?? MY_PAGE_PATH}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("내 페이지 링크가 복사되었어요", { description: url });
    } catch {
      toast.error("링크를 복사하지 못했어요", { description: "브라우저의 클립보드 권한을 확인해주세요." });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif]">
      {/* 상단 헤더 (전체 너비) */}
      <Header
        user={user}
        displayName={viewerProfile?.displayName}
        email={viewerProfile?.email}
        photoURL={viewerProfile ? viewerProfile.photoURL : user?.photoURL ?? ""}
        authLoading={authLoading}
        signingIn={signingIn}
        previewHref={viewerPagePath ?? PREVIEW_PATH}
        myPageHref={viewerPagePath}
        onLogin={login}
        onLogout={logout}
        onCopyLink={copyMyLink}
      />

      <main className="flex-1 w-full px-4 py-6 sm:py-8 flex justify-center">
      <div className="w-full max-w-[460px] flex flex-col space-y-4">
        {/* 프로필 */}
        {profileQuery.isPending ? (
          <div aria-busy="true" className="space-y-3 pt-6">
            <div className="mx-auto size-24 rounded-full bg-[#F2F4F6] animate-pulse" />
            <div className="mx-auto h-5 w-32 rounded bg-[#F2F4F6] animate-pulse" />
          </div>
        ) : !profile ? (
          <div role="alert" className="py-16 text-center">
            <p className="text-[17px] font-bold text-[#191F28]">프로필을 불러오지 못했어요</p>
            <button
              type="button"
              onClick={() => profileQuery.refetch()}
              className="mt-3 text-[13px] font-semibold text-primary hover:underline"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <section aria-label="개인 페이지 프로필" className="flex flex-col items-center text-center pt-4 pb-5">
            <Avatar size="2xl" className="ring-4 ring-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] bg-secondary overflow-hidden border-0">
              {profile.photoURL && (
                <AvatarImage src={profile.photoURL} alt="프로필 사진" referrerPolicy="no-referrer" className="size-full object-cover" />
              )}
              <AvatarFallback className="size-full bg-secondary flex items-center justify-center">
                <User className="size-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-[22px] font-bold tracking-tight text-[#191F28]">{profile.displayName}</h1>
            {profile.username && <p className="mt-1 text-[14px] font-medium text-[#4E5968]">@{profile.username}</p>}
            {profile.bio && (
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#4E5968] whitespace-pre-line break-keep">
                {profile.bio}
              </p>
            )}
            <div className="mt-1">
              <SocialIconBar socials={profile.socials} />
            </div>
          </section>
        )}

        {/* 링크 목록 (읽기 전용) */}
        {profile && (
          <div className="space-y-3.5" aria-busy={linksQuery.isPending}>
            {linksQuery.isPending &&
              Array.from({ length: 3 }, (_, i) => <LinkCardSkeleton key={`skeleton-${i}`} />)}

            {linksQuery.isError && (
              <div role="alert" className="py-8 text-center border border-dashed border-[#E5E8EB] rounded-none sm:rounded-[2px]">
                <p className="text-[15px] font-semibold text-[#4E5968]">링크를 불러오지 못했어요</p>
                <button
                  type="button"
                  onClick={() => linksQuery.refetch()}
                  className="mt-3 text-[13px] font-semibold text-primary hover:underline"
                >
                  다시 시도
                </button>
              </div>
            )}

            {linksQuery.isSuccess && links.length === 0 && (
              <div className="py-10 text-center border border-dashed border-[#E5E8EB] rounded-none sm:rounded-[2px]">
                <p className="text-[15px] font-semibold text-[#4E5968]">아직 등록된 링크가 없어요</p>
              </div>
            )}

            {links.map((block) => (
              <LinkCard
                key={block.id}
                id={block.id}
                title={block.title}
                subtitle={block.subtitle}
                url={block.url}
                iconName={block.iconName}
                readonly
              />
            ))}
          </div>
        )}

      </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="py-8 text-center text-[12px] text-[#8B95A1]">
        © {new Date().getFullYear()} MyLink. All rights reserved.
      </footer>
    </div>
  );
}
