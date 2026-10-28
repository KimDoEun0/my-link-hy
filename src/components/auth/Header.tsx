"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, ExternalLink, Eye, LogOut, User as UserIcon, UserRound } from "lucide-react";
import type { User } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDisplayName } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleLoginButton } from "./GoogleLoginButton";

const MY_PAGE_EDIT_PATH = "/mypage"; // 내 페이지 편집 화면

interface HeaderProps {
  user: User | null;
  // users/{uid} 프로필에 저장된 이름 · 이메일 (없으면 로그인 계정 정보 사용)
  displayName?: string;
  email?: string;
  photoURL?: string; // users/{uid}의 프로필 이미지 (비어 있으면 기본 아이콘)
  authLoading: boolean; // 첫 로그인 상태 확인 중
  signingIn: boolean; // Google 로그인 진행 중
  previewHref: string; // 내 페이지 미리보기 주소 (실제 공개 페이지 /{표시 이름}, 새 탭)
  myPageHref?: string; // 내 개인 페이지 주소 (/{표시 이름}), 프로필을 불러오기 전에는 없음
  onLogin: () => void;
  onLogout: () => void;
  onCopyLink: () => void;
}

// 상단 헤더 (화면 전체 너비: 왼쪽 "MyLink" 로고 + 오른쪽 액션 영역)
// - 로그아웃 상태: "Google로 로그인" 버튼
// - 로그인 상태: 프로필 사진 → 클릭 시 프로필 드롭다운 (Base UI Menu)
export function Header({
  user,
  displayName,
  email,
  photoURL,
  authLoading,
  signingIn,
  previewHref,
  myPageHref,
  onLogin,
  onLogout,
  onCopyLink,
}: HeaderProps) {
  const name = displayName || (user ? getDisplayName(user) : "");
  const mail = email || user?.email || "";
  // 지금 내 페이지를 보고 있는지 (한글 주소는 인코딩 여부와 관계없이 비교)
  const pathname = usePathname();
  const decode = (v: string) => {
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  const onMyPage = !!myPageHref && decode(pathname) === decode(myPageHref);

  return (
    // 화면 전체 너비 헤더: 왼쪽 로고 · 오른쪽 '내 페이지' 버튼 + 아바타, 아래 구분선
    <header className="w-full h-14 bg-white border-b border-[#E5E8EB]">
      <div className="mx-auto max-w-5xl h-full px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* 왼쪽 로고 */}
      <Link href="/" className="text-[18px] font-extrabold tracking-tight text-primary select-none">
        MyLink
      </Link>

      {/* 오른쪽 로그인 영역 */}
      <div className="flex items-center justify-end gap-2 min-w-0">
        {/* 내 페이지 바로가기 (로그인 상태, 아바타 왼쪽, 사각형 Primary 버튼)
            - 내 공개 페이지(/{표시 이름})를 새 탭으로 열어 지금 화면은 그대로 유지
            - 이미 내 공개 페이지를 보고 있으면 편집 화면(/mypage)으로 이동 */}
        {user && myPageHref && (
          <Link
            href={onMyPage ? MY_PAGE_EDIT_PATH : myPageHref}
            target={onMyPage ? undefined : "_blank"}
            rel={onMyPage ? undefined : "noopener noreferrer"}
            aria-label="내 페이지"
            title={onMyPage ? "내 페이지 편집" : "내 페이지 (새 탭)"}
            className={cn(
              // Primary 버튼 (파란 배경 + 흰 글자), 사각형
              buttonVariants({ variant: "default", size: "sm" }),
              "shrink-0 h-8 rounded-[2px] px-2.5 gap-1.5 text-[13px] font-medium shadow-none"
            )}
          >
            <ExternalLink aria-hidden="true" className="size-3.5" />
            내 페이지
          </Link>
        )}
        {authLoading ? (
          <div aria-hidden="true" className="h-9 w-24 rounded-full bg-[#F2F4F6] animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="프로필 메뉴 열기"
              title={name}
              className="rounded-full outline-none cursor-pointer transition-shadow hover:ring-2 hover:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary/40 data-popup-open:ring-2 data-popup-open:ring-primary/40"
            >
              <Avatar className="size-9 border border-black/5 shadow-none">
                {(photoURL ?? user.photoURL) && (
                  <AvatarImage src={(photoURL ?? user.photoURL) || ""} alt="내 프로필 사진" referrerPolicy="no-referrer" />
                )}
                <AvatarFallback className="size-full rounded-full bg-secondary flex items-center justify-center">
                  <UserIcon className="size-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5 rounded-xl">
              {/* 내 이름 · 이메일 */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2.5 py-2">
                  <p className="text-[15px] font-bold text-[#191F28] truncate">{name}</p>
                  <p className="mt-0.5 text-[12px] font-normal text-[#8B95A1] truncate">{mail}</p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 내 개인 페이지로 이동 */}
              {myPageHref && (
                <DropdownMenuItem
                  render={<Link href={myPageHref} />}
                  className="px-2.5 py-2 text-[14px] text-[#333D4B] cursor-pointer"
                >
                  <UserRound aria-hidden="true" />
                  내 페이지로 이동
                </DropdownMenuItem>
              )}

              {/* 내 페이지 미리보기 (새 탭) */}
              <DropdownMenuItem
                render={<a href={previewHref} target="_blank" rel="noopener noreferrer" />}
                className="px-2.5 py-2 text-[14px] text-[#333D4B] cursor-pointer"
              >
                <Eye aria-hidden="true" />
                내 페이지 미리보기
              </DropdownMenuItem>

              {/* 링크 복사 */}
              <DropdownMenuItem onClick={onCopyLink} className="px-2.5 py-2 text-[14px] text-[#333D4B] cursor-pointer">
                <Copy aria-hidden="true" />
                링크 복사
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* 로그아웃 (빨간색) */}
              <DropdownMenuItem
                variant="destructive"
                onClick={onLogout}
                className="px-2.5 py-2 text-[14px] font-semibold cursor-pointer"
              >
                <LogOut aria-hidden="true" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <GoogleLoginButton onClick={onLogin} loading={signingIn} />
        )}
      </div>
      </div>
    </header>
  );
}
