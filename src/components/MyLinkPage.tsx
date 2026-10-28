"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMyLinkStore } from "@/lib/useMyLinkStore";
import { initialProfile } from "@/data/initialData";
import type { ContentBlock } from "@/types/mylink";
import { useAddLink, useDeleteLink, useLinks, useUpdateLink } from "@/hooks/useLinks";
import { getDisplayName } from "@/lib/auth";
import { personalPagePath } from "@/lib/publicProfile";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useUser } from "@/hooks/useUser";
import { Header, Landing } from "@/components/auth";
import {
  SectionHeader,
  LinkCard,
  ProfileToast,
  AddLinkDialog,
  LinkCardSkeleton,
  InlineDisplayName,
  InlineEmail,
  InlineBio,
  InlinePhoto,
  InlineSocials,
  SocialIconBar,
  type NewBlockInput,
} from "@/components/profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Eye, Plus, User } from "lucide-react";

// 내 페이지 주소와 미리보기 주소
const MY_PAGE_PATH = "/mypage";
const PREVIEW_PATH = "/mypage/preview";

interface MyLinkPageProps {
  // 미리보기 모드: 방문자에게 보이는 모습 (편집 버튼 · 이메일 등 숨김)
  preview?: boolean;
}

// 마이링크 메인 화면 (/, /mypage) · 미리보기 화면 (/mypage/preview)
export function MyLinkPage({ preview = false }: MyLinkPageProps) {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // 로그인 상태 + Firestore 프로필(users/{uid}) 조회 (TanStack Query, 실시간 구독 없음)
  const { user, profile: userProfile, loading: authLoading } = useUser();
  const uid = user?.uid ?? null;

  // 링크 목록: TanStack Query로 users/{uid}/links 1회 조회 (실시간 · 자동 재요청 없음)
  // - uid가 쿼리 키에 들어가 계정이 바뀌면 캐시가 따로 관리됨
  // - 추가 · 수정 · 삭제는 뮤테이션 성공 후 캐시만 갱신 (다시 조회하지 않음)
  const linksQuery = useLinks(uid);
  const links = linksQuery.data ?? [];
  const isLoading = !!uid && linksQuery.isPending;
  const addLinkMutation = useAddLink(uid);
  const updateLinkMutation = useUpdateLink(uid);
  const deleteLinkMutation = useDeleteLink(uid);

  const storeProfile = useMyLinkStore((state) => state.profile);
  const recordView = useMyLinkStore((state) => state.recordView);
  const recordClick = useMyLinkStore((state) => state.recordClick);

  // SSR Hydration Fallback: Use initial seed before client-side mount
  const profile = mounted ? storeProfile : initialProfile;

  useEffect(() => {
    setMounted(true);
    recordView();
  }, [recordView]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  // 로그인 · 로그아웃 (공용 훅, 로그아웃 시 쿼리 캐시 비움)
  const { signingIn, login: handleLogin, logout: handleLogout } = useAuthActions(showToast);

  // 내 개인 페이지 주소: /{username} (프로필을 불러온 뒤 사용 가능)
  const myPagePath = userProfile?.username ? personalPagePath(userProfile.username) : null;

  // 내 개인 페이지 링크(/{username}) 복사 → sonner 토스트로 안내
  const handleCopyLink = async () => {
    const url = `${window.location.origin}${myPagePath ?? MY_PAGE_PATH}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("내 페이지 링크가 복사되었어요", { description: url });
    } catch {
      toast.error("링크를 복사하지 못했어요", { description: "브라우저의 클립보드 권한을 확인해주세요." });
    }
  };

  const handleLinkClick = (blockId: string, url?: string) => {
    if (!url) return;
    recordClick(blockId);
  };

  // 새 링크 추가: useMutation → Firestore(users/{uid}/links) 저장 → 캐시 맨 앞에 추가
  // 저장 실패 시 예외를 그대로 던져 다이얼로그에서 오류를 표시
  const handleAddLink = async (newBlock: NewBlockInput) => {
    await addLinkMutation.mutateAsync({ ...newBlock, isVisible: true });
  };

  // 링크 수정: useMutation → Firestore 문서(users/{uid}/links/{id}) 갱신 → 캐시 갱신
  // 실패 시 예외를 그대로 던져 수정 폼에서 오류를 표시
  const handleUpdateLink = async (id: string, data: { title: string; url: string }) => {
    await updateLinkMutation.mutateAsync({ id, data });
    showToast("링크가 수정되었어요 ✏️");
  };

  // 링크 삭제: useMutation → Firestore 문서 삭제 → 캐시에서 제거
  // 실패 시 예외를 그대로 던져 삭제 확인 모달에서 오류를 표시
  const handleDeleteLink = async (id: string) => {
    await deleteLinkMutation.mutateAsync(id);
    showToast("항목이 삭제되었어요 🗑️");
  };

  // 섹션 헤더 삭제 (버튼에서 바로 삭제, 실패 시 안내)
  const handleDeleteHeader = (id: string) => {
    handleDeleteLink(id).catch(() => {
      showToast("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
    });
  };

  const visibleBlocks = links.filter((b) => b.isVisible !== false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif] selection:bg-accent selection:text-primary">
      {/* 상단 헤더 (전체 너비): 로고 + 로그인 / 프로필 드롭다운 (미리보기에서는 안내 바로 대체) */}
      {!(preview && user) && (
        <Header
          user={user}
          displayName={userProfile?.displayName}
          email={userProfile?.email}
          photoURL={userProfile ? userProfile.photoURL : user?.photoURL ?? ""}
          authLoading={authLoading}
          signingIn={signingIn}
          previewHref={myPagePath ?? PREVIEW_PATH}
          myPageHref={myPagePath ?? undefined}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onCopyLink={handleCopyLink}
        />
      )}

      <main className="flex-1 w-full px-4 py-6 sm:py-8 flex justify-center">
      {/* 📱 중앙 컬럼 컨테이너 (max-w-[460px]) */}
      <div className="w-full max-w-[460px] flex flex-col space-y-4">
        {preview && user && (
          // 미리보기 안내 바 (헤더 대신 표시)
          <div
            role="status"
            className="flex items-center justify-between gap-2 h-12 pl-3.5 pr-1.5 rounded-xl bg-accent text-primary"
          >
            <span className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Eye className="size-4" aria-hidden="true" />
              미리보기 · 방문자에게 보이는 모습이에요
            </span>
            {/* 페이지 이동이므로 실제 링크(<a>)에 Base UI Button과 같은 스타일만 적용 */}
            <a href={MY_PAGE_PATH} className={buttonVariants({ variant: "ghost", size: "sm", className: "text-[13px]" })}>
              편집으로 돌아가기
            </a>
          </div>
        )}

        {authLoading ? (
          // 첫 로그인 상태 확인 중 (새로고침 직후)
          <div aria-busy="true" className="space-y-3.5 pt-6">
            <div className="mx-auto size-24 rounded-full bg-[#F2F4F6] animate-pulse" />
            <div className="mx-auto h-5 w-32 rounded bg-[#F2F4F6] animate-pulse" />
            <div className="pt-4 space-y-3.5">
              {Array.from({ length: 2 }, (_, i) => <LinkCardSkeleton key={`auth-skeleton-${i}`} />)}
            </div>
          </div>
        ) : !user ? (
          // 비로그인: "Development in One Link" 랜딩 페이지 (로그인 후 사용 안내 포함)
          <Landing onLogin={handleLogin} signingIn={signingIn} />
        ) : (
          <>
        {/* 상단 0. 마이페이지 프로필: Firestore users/{uid} 문서의 유저 정보 (실시간 반영) */}
        <section aria-label="마이페이지 프로필" className="flex flex-col items-center text-center pt-4 pb-5">
          {/* 프로필 사진: 마이페이지에서는 마우스를 올리면 인라인 변경 */}
          {!preview && uid && userProfile ? (
            <InlinePhoto uid={uid} profile={userProfile} />
          ) : (
          <Avatar size="2xl" className="ring-4 ring-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] bg-secondary overflow-hidden border-0">
            {/* 프로필 이미지: users/{uid}의 photoURL (비워 두면 기본 아이콘) */}
            {(userProfile ? userProfile.photoURL : user.photoURL) && (
              <AvatarImage
                src={(userProfile ? userProfile.photoURL : user.photoURL) || ""}
                alt="프로필 사진"
                referrerPolicy="no-referrer"
                className="size-full object-cover"
              />
            )}
            <AvatarFallback className="size-full bg-secondary flex items-center justify-center">
              <User className="size-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          )}
          {/* 표시 이름: 마이페이지에서는 마우스를 올리면 인라인 수정 (중복 허용) */}
          {!preview && uid && userProfile ? (
            <InlineDisplayName uid={uid} profile={userProfile} />
          ) : (
            <h1 className="mt-4 text-[22px] font-bold tracking-tight text-[#191F28]">
              {userProfile?.displayName || getDisplayName(user)}
            </h1>
          )}
          {/* username(@아이디): 공개 주소 /{username}, 가입 시 정해지고 수정 불가 */}
          {userProfile?.username && (
            <p className="mt-1 text-[14px] font-medium text-[#4E5968]">@{userProfile.username}</p>
          )}
          {/* 이메일: 마이페이지에서는 마우스를 올리면 인라인 수정 (미리보기에서는 숨김) */}
          {!preview &&
            (uid && userProfile ? (
              <InlineEmail uid={uid} profile={userProfile} />
            ) : (
              <p className="mt-1 text-[13px] text-[#8B95A1]">{user.email}</p>
            ))}
          {/* 한 줄 소개 (PRD 4.1, 줄바꿈 허용): 마이페이지에서는 마우스를 올리면 인라인 수정 */}
          {!preview && uid && userProfile ? (
            <InlineBio uid={uid} profile={userProfile} />
          ) : (
            userProfile?.bio && (
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#4E5968] whitespace-pre-line break-keep">
                {userProfile.bio}
              </p>
            )
          )}
          {/* 소셜 미디어 아이콘 바: 입력한 플랫폼만 표시, 마이페이지에서는 마우스를 올리면 인라인 수정 */}
          {!preview && uid && userProfile ? (
            <InlineSocials uid={uid} profile={userProfile} />
          ) : (
            <div className="mt-1">
              <SocialIconBar socials={userProfile?.socials} />
            </div>
          )}
        </section>

        {/* 상단 1. '+ 새로운 링크 추가하기' 파란색 직사각형 버튼 (다이얼로그 트리거, 미리보기에서는 숨김) */}
        {!preview && (
        <AddLinkDialog
          onAdd={handleAddLink}
          onSuccessToast={showToast}
          triggerButton={
            <button
              type="button"
              className="w-full h-13 rounded-none sm:rounded-[2px] bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none shadow-none"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              새로운 링크 추가하기
            </button>
          }
        />
        )}

        {/* 상단 2. 링크 카드 리스트 (이미지 레이아웃) */}
        <div className="space-y-3.5" aria-busy={isLoading}>
          {/* 첫 로드 중: 스켈레톤 카드 */}
          {isLoading &&
            Array.from({ length: 3 }, (_, i) => <LinkCardSkeleton key={`skeleton-${i}`} />)}

          {/* 불러오기 실패: 안내 + 다시 시도 (자동 재요청이 없으므로 직접 다시 불러오기) */}
          {linksQuery.isError && (
            <div role="alert" className="py-8 text-center border border-dashed border-[#E5E8EB] rounded-none sm:rounded-[2px]">
              <p className="text-[15px] font-semibold text-[#4E5968]">링크를 불러오지 못했어요</p>
              <p className="mt-1 text-[13px] text-[#8B95A1]">{linksQuery.error.message}</p>
              <button
                type="button"
                onClick={() => linksQuery.refetch()}
                className="mt-3 text-[13px] font-semibold text-primary hover:underline"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 불러온 링크가 없을 때 안내 */}
          {!isLoading && !linksQuery.isError && visibleBlocks.length === 0 && (
            <div className="py-10 text-center border border-dashed border-[#E5E8EB] rounded-none sm:rounded-[2px]">
              <p className="text-[15px] font-semibold text-[#4E5968]">아직 추가된 링크가 없어요</p>
              {!preview && (
                <p className="mt-1 text-[13px] text-[#8B95A1]">위의 버튼으로 첫 링크를 추가해 보세요</p>
              )}
            </div>
          )}

          {visibleBlocks.map((block) => {
            if (block.type === "header") {
              return (
                <SectionHeader
                  key={block.id}
                  id={block.id}
                  title={block.title}
                  onDelete={preview ? undefined : handleDeleteHeader}
                />
              );
            }

            return (
              <LinkCard
                key={block.id}
                id={block.id}
                title={block.title}
                subtitle={block.subtitle}
                url={block.url}
                badge={block.badge}
                iconName={block.iconName}
                onClick={handleLinkClick}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
                readonly={preview}
              />
            );
          })}
        </div>

          </>
        )}

      </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="py-8 text-center text-[12px] text-[#8B95A1]">
        © {new Date().getFullYear()} MyLink. All rights reserved.
      </footer>

      {/* TDS Toast 알림 */}
      <ProfileToast
        message={toastMessage}
        visible={toastVisible}
      />
    </div>
  );
}
