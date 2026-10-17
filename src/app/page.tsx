"use client";

import { useEffect, useState } from "react";
import { useMyLinkStore } from "@/lib/useMyLinkStore";
import { initialProfile, initialBlocks } from "@/data/initialData";
import type { ContentBlock } from "@/types/mylink";
import { addLink, deleteLink } from "@/lib/linksFirestore";
import {
  SectionHeader,
  LinkCard,
  ProfileToast,
  AddLinkDialog,
  type NewBlockInput,
} from "@/components/profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, RotateCcw, User } from "lucide-react";

// 상단 프로필 영역에 표시할 정보 (이름 · 아이디 · 소개)
const PROFILE_INFO = {
  name: "My Name",
  handle: "@my_handle",
  bio: "Frontend Developer | 바이브 코딩 실습 중\n나만의 링크를 모아두는 공간 ✨",
};

// 클릭 시 사이트 이동 대신 "새 링크 추가" 다이얼로그를 여는 Blog 카드 id
const BLOG_BLOCK_ID = "link-3";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  // Blog 카드 클릭 시 열리는 "새 링크 추가" 다이얼로그 상태
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);

  // 기본 예시 블록 (코드 내 초기 데이터)
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  // 이번 세션에서 Firestore(users/anonymous/links)에 저장한 링크 목록
  // (Firestore 읽기 로직은 아직 미구현이므로 새로고침 시에는 표시되지 않음)
  const [savedLinks, setSavedLinks] = useState<ContentBlock[]>([]);

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

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    let shared = false;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName || "MyLink"}`,
          text: profile.bio || "나의 멀티링크 모음",
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
        showToast("프로필 링크가 복사되었어요");
      } catch {
        // clipboard write error
      }
    }
  };

  const handleLinkClick = (blockId: string, url?: string) => {
    if (!url) return;
    recordClick(blockId);
  };

  // 새 링크 추가: 링크 객체 생성 → Firestore(users/anonymous/links)에 저장 → 로컬 상태 업데이트
  // 저장 실패 시 예외를 그대로 던져 다이얼로그에서 오류를 표시
  const handleAddLink = async (newBlock: NewBlockInput) => {
    // 1. 링크 객체 생성
    const link: NewBlockInput = { ...newBlock, isVisible: true };

    // 2. Firestore에 저장 (생성된 문서 id를 링크 id로 사용)
    const id = await addLink(link);

    // 3. 로컬 상태 업데이트 → 목록에 즉시 반영
    setSavedLinks((prev) => [...prev, { ...link, id, order: prev.length }]);
  };

  const handleDeleteBlock = (blockId: string) => {
    const isSavedLink = savedLinks.some((link) => link.id === blockId);
    if (isSavedLink) {
      // Firestore에 저장된 링크는 문서 삭제
      deleteLink(blockId)
        .then(() => setSavedLinks((prev) => prev.filter((b) => b.id !== blockId)))
        .catch(() => {
          showToast("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
        });
    } else {
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    }
    showToast("항목이 삭제되었어요 🗑️");
  };

  const handleResetData = () => {
    if (window.confirm("초기 샘플 데이터로 복원하시겠습니까?")) {
      setBlocks(initialBlocks);
      showToast("초기 데이터로 복원되었어요 🔄");
    }
  };

  // 기본 예시 블록(순서 정렬) 뒤에 Firestore 저장 링크(생성 순서)를 이어서 표시
  const visibleBlocks = [
    ...[...blocks].sort((a, b) => a.order - b.order),
    ...savedLinks,
  ].filter((b) => b.isVisible !== false);

  return (
    <div className="min-h-screen bg-white py-6 sm:py-10 px-4 flex justify-center font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif] selection:bg-accent selection:text-primary">
      {/* 📱 중앙 컬럼 컨테이너 (스크린샷 비율: max-w-[460px]) */}
      <div className="w-full max-w-[460px] flex flex-col space-y-4">
        {/* 상단 0. 프로필 영역 (사진 · 이름 · 아이디 · 소개) */}
        <section className="flex flex-col items-center text-center pt-6 pb-5">
          <Avatar size="2xl" className="ring-4 ring-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] bg-secondary overflow-hidden border-0">
            <AvatarImage src="/profile-avatar.svg" alt="프로필 사진" className="size-full object-cover" />
            <AvatarFallback className="size-full bg-secondary flex items-center justify-center">
              <User className="size-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-[22px] font-bold tracking-tight text-[#191F28]">
            {PROFILE_INFO.name}
          </h1>
          <p className="mt-1 text-[13px] text-[#8B95A1]">{PROFILE_INFO.handle}</p>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[#4E5968] whitespace-pre-line break-keep">
            {PROFILE_INFO.bio}
          </p>
        </section>

        {/* 상단 1. '+ 새로운 링크 추가하기' 파란색 직사각형 버튼 (다이얼로그 트리거) */}
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

        {/* 상단 2. 링크 카드 리스트 (이미지 레이아웃) */}
        <div className="space-y-3.5">
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
                onClick={handleLinkClick}
                onDelete={handleDeleteBlock}
                onCardClick={block.id === BLOG_BLOCK_ID ? () => setBlogDialogOpen(true) : undefined}
              />
            );
          })}
        </div>

        {/* 하단 보조 액션 (초기 데이터 복원 및 공유) */}
        <div className="pt-6 pb-8 flex items-center justify-between text-xs text-muted-foreground/60 px-1 border-t border-gray-100">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            초기 예시 데이터 복원
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="hover:text-foreground transition-colors"
          >
            링크 공유하기 ↗
          </button>
        </div>
      </div>

      {/* Blog 카드 클릭 시: 제목과 URL을 입력하는 "새 링크 추가" 다이얼로그 */}
      <AddLinkDialog
        simple
        open={blogDialogOpen}
        onOpenChange={setBlogDialogOpen}
        onAdd={handleAddLink}
        onSuccessToast={showToast}
      />

      {/* TDS Toast 알림 */}
      <ProfileToast
        message={toastMessage}
        visible={toastVisible}
      />
    </div>
  );
}
