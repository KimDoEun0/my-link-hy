"use client";

import { useEffect, useState } from "react";
import { useMyLinkStore } from "@/lib/useMyLinkStore";
import { initialProfile, initialBlocks, initialTheme } from "@/data/initialData";
import {
  ProfileHeader,
  SocialIconBar,
  ProfileActions,
  SectionHeader,
  LinkCard,
  ContactCard,
  ProfileShareButton,
  ProfileFooter,
  ProfileToast,
  AddLinkDialog,
} from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const storeProfile = useMyLinkStore((state) => state.profile);
  const storeBlocks = useMyLinkStore((state) => state.blocks);
  const storeTheme = useMyLinkStore((state) => state.theme);
  const recordView = useMyLinkStore((state) => state.recordView);
  const recordClick = useMyLinkStore((state) => state.recordClick);
  const deleteBlock = useMyLinkStore((state) => state.deleteBlock);
  const resetToInitial = useMyLinkStore((state) => state.resetToInitial);

  // SSR Hydration Fallback: Use initial seed before client-side mount
  const profile = mounted ? storeProfile : initialProfile;
  const blocks = mounted ? storeBlocks : initialBlocks;
  const theme = mounted ? storeTheme : initialTheme;

  const email =
    profile.socials?.email?.replace(/^mailto:/, "") ||
    "minji.creator@example.com";

  useEffect(() => {
    setMounted(true);
    recordView();
  }, [recordView]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    let shared = false;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} | MyLink`,
          text: profile.bio,
          url: shareUrl,
        });
        shared = true;
        showToast("프로필 링크를 공유했어요");
      } catch {
        // cancelled or failed, fallback to clipboard
      }
    }

    if (!shared) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsLinkCopied(true);
        showToast("프로필 링크가 복사되었어요");
        setTimeout(() => setIsLinkCopied(false), 2400);
      } catch {
        // clipboard write error
      }
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsEmailCopied(true);
      showToast("이메일 주소가 복사되었어요");
      setTimeout(() => setIsEmailCopied(false), 2400);
    } catch {
      // clipboard write error
    }
  };

  const handleLinkClick = (blockId: string, url?: string) => {
    if (!url) return;
    recordClick(blockId);
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteBlock(blockId);
    showToast("항목이 삭제되었어요 🗑️");
  };

  const handleResetData = () => {
    if (window.confirm("초기 샘플 데이터로 복원하시겠습니까?")) {
      resetToInitial();
      showToast("초기 데이터로 복원되었어요 🔄");
    }
  };

  // Button shape classes according to theme (Tailwind CSS)
  const getShapeClass = () => {
    switch (theme.buttonShape) {
      case "rounded-full":
        return "rounded-full";
      case "rounded-none":
        return "rounded-none";
      case "rounded-xl":
      default:
        return "rounded-2xl";
    }
  };

  // Button variant classes according to theme (Tailwind CSS)
  const getVariantClass = () => {
    switch (theme.buttonVariant) {
      case "outline":
        return "bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary";
      case "shadow":
        return "bg-card shadow-[0_4px_16px_rgba(25,31,40,0.08)] border border-black/5 hover:shadow-[0_8px_24px_rgba(25,31,40,0.12)]";
      case "filled":
      default:
        return "bg-card border border-border shadow-[0_1px_2px_rgba(25,31,40,0.04)] hover:shadow-md";
    }
  };

  // Filter visible blocks and sort by order
  const visibleBlocks = blocks
    .filter((b) => b.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#F2F4F6] sm:py-8 flex items-center justify-center font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif] selection:bg-accent selection:text-primary">
      {/* 📱 모바일 퍼스트 셸 컨테이너 (스마트폰 뷰포트 비율) */}
      <div className="w-full max-w-[440px] min-h-screen sm:min-h-[880px] bg-background sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-border flex flex-col justify-between overflow-hidden relative">
        {/* 상단 액션 바 (MyLink 타이틀 & 링크 추가 / 공유 버튼) */}
        <header className="h-14 px-5 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-30 border-b border-black/[0.03]">
          <div className="flex items-center gap-1.5 text-[15px] font-bold text-foreground tracking-tight">
            <span>MyLink</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetData}
              title="초기 샘플 데이터 복원"
              className="size-8 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <AddLinkDialog
              onSuccessToast={showToast}
              triggerButton={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-accent font-semibold h-8 px-2.5 rounded-lg gap-1 text-[13px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  링크 추가
                </Button>
              }
            />
            <ProfileShareButton onShare={handleShare} />
          </div>
        </header>

        {/* 메인 컨텐츠 영역 */}
        <main className="px-5 pt-6 pb-12 flex-1 space-y-6">
          {/* 1. 프로필 헤더 (shadcn/ui Avatar & Badge 기반) */}
          <ProfileHeader
            displayName={profile.displayName}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            badge={profile.badge}
          />

          {/* 2. 소셜 미디어 아이콘 바 */}
          <SocialIconBar socials={profile.socials} />

          {/* 3. 화면 핵심 액션: '프로필 링크 공유하기' & '이메일 복사' 버튼 바 */}
          <ProfileActions
            onShare={handleShare}
            onCopyEmail={handleCopyEmail}
            isEmailCopied={isEmailCopied}
            isLinkCopied={isLinkCopied}
          />

          {/* 4. 콘텐츠 블록 리스트 (SectionHeader & LinkCard) */}
          <section className="space-y-3 pt-2">
            {visibleBlocks.map((block) => {
              if (block.type === "header") {
                return (
                  <SectionHeader
                    key={block.id}
                    id={block.id}
                    title={block.title}
                    onDelete={handleDeleteBlock}
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
                  shapeClass={getShapeClass()}
                  variantClass={getVariantClass()}
                  onClick={handleLinkClick}
                  onDelete={handleDeleteBlock}
                />
              );
            })}

            {/* 새 링크 추가 다이얼로그 카드 트리거 */}
            <div className="pt-2">
              <AddLinkDialog onSuccessToast={showToast} />
            </div>
          </section>

          {/* 5. 비즈니스 문의 및 이메일 카드 */}
          <ContactCard
            email={email}
            onCopyEmail={handleCopyEmail}
            isCopied={isEmailCopied}
          />
        </main>

        {/* 6. 하단 푸터 브랜딩 */}
        <ProfileFooter />

        {/* 7. TDS Toast 알림 (공유 링크 및 이메일 복사 시) */}
        <ProfileToast
          message={toastMessage}
          visible={toastVisible}
        />
      </div>
    </div>
  );
}
