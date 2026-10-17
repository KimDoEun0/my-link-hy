"use client";

import { useEffect, useState } from "react";
import { useMyLinkStore } from "@/lib/useMyLinkStore";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firestore";
import { initialProfile } from "@/data/initialData";
import type { ContentBlock } from "@/types/mylink";
import { addLink, deleteLink } from "@/lib/linksFirestore";
import {
  SectionHeader,
  LinkCard,
  ProfileToast,
  AddLinkDialog,
  LinkCardSkeleton,
  type NewBlockInput,
} from "@/components/profile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, User } from "lucide-react";

// 상단 프로필 영역에 표시할 정보 (이름 · 아이디 · 소개)
const PROFILE_INFO = {
  name: "My Name",
  handle: "@my_handle",
  bio: "Frontend Developer | 바이브 코딩 실습 중\n나만의 링크를 모아두는 공간 ✨",
};

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // 링크 목록 (더미 데이터 없이 빈 배열로 시작, Firestore에서 불러온 데이터로 채움)
  const [links, setLinks] = useState<ContentBlock[]>([]);
  // 첫 로드(Firestore 조회) 중 여부
  const [isLoading, setIsLoading] = useState(true);
  // 삭제 처리 중인 링크 id 목록
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  // 컴포넌트 마운트 시 Firestore(users/anonymous/links)에서 링크를 1회 조회 (실시간 구독 아님)
  useEffect(() => {
    let ignore = false;

    const loadLinks = async () => {
      try {
        const linksQuery = query(
          collection(db, "users", "anonymous", "links"),
          orderBy("createdAt", "desc") // createdAt 기준 최신순
        );
        const snapshot = await getDocs(linksQuery);
        if (ignore) return;

        // 서버에 연결하지 못하면 getDocs는 오류 대신 캐시 결과를 반환하므로 별도로 안내
        if (snapshot.metadata.fromCache) {
          setToastMessage("서버에 연결하지 못해 링크를 불러오지 못했어요.");
          setToastVisible(true);
        }

        setLinks(
          snapshot.docs.map((doc, index) => ({
            id: doc.id,
            type: "link",
            title: doc.data().title ?? "",
            url: doc.data().url,
            iconName: "Favicon", // 저장된 링크는 Google 파비콘으로 표시
            isVisible: true,
            order: index,
          }))
        );
      } catch {
        if (ignore) return;
        setToastMessage("저장된 링크를 불러오지 못했어요.");
        setToastVisible(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadLinks();
    return () => {
      ignore = true;
    };
  }, []);

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

    // 3. 로컬 상태 업데이트 → 최신순 목록이므로 맨 앞에 추가하여 UI에 즉시 반영
    setLinks((prev) => [{ ...link, id, order: -1 }, ...prev]);
  };

  // 링크 삭제: Firestore 문서 삭제 후 로컬 상태에서도 제거
  const handleDeleteBlock = (blockId: string) => {
    if (deletingIds.includes(blockId)) return; // 중복 클릭 방지
    setDeletingIds((prev) => [...prev, blockId]);

    deleteLink(blockId)
      .then(() => {
        setLinks((prev) => prev.filter((b) => b.id !== blockId));
        showToast("항목이 삭제되었어요 🗑️");
      })
      .catch(() => {
        showToast("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        setDeletingIds((prev) => prev.filter((id) => id !== blockId));
      });
  };

  const visibleBlocks = links.filter((b) => b.isVisible !== false);

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
        <div className="space-y-3.5" aria-busy={isLoading}>
          {/* 첫 로드 중: 스켈레톤 카드 */}
          {isLoading &&
            Array.from({ length: 3 }, (_, i) => <LinkCardSkeleton key={`skeleton-${i}`} />)}

          {/* 불러온 링크가 없을 때 안내 */}
          {!isLoading && visibleBlocks.length === 0 && (
            <div className="py-10 text-center border border-dashed border-[#E5E8EB] rounded-none sm:rounded-[2px]">
              <p className="text-[15px] font-semibold text-[#4E5968]">아직 추가된 링크가 없어요</p>
              <p className="mt-1 text-[13px] text-[#8B95A1]">위의 버튼으로 첫 링크를 추가해 보세요</p>
            </div>
          )}

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
                isDeleting={deletingIds.includes(block.id)}
              />
            );
          })}
        </div>

        {/* 하단 보조 액션 (공유) */}
        <div className="pt-6 pb-8 flex items-center justify-end text-xs text-muted-foreground/60 px-1 border-t border-gray-100">
          <button
            type="button"
            onClick={handleShare}
            className="hover:text-foreground transition-colors"
          >
            링크 공유하기 ↗
          </button>
        </div>
      </div>

      {/* TDS Toast 알림 */}
      <ProfileToast
        message={toastMessage}
        visible={toastVisible}
      />
    </div>
  );
}
