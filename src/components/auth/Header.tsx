"use client";

import { Copy, Eye, LogOut, User as UserIcon } from "lucide-react";
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
import { GoogleLoginButton } from "./GoogleLoginButton";

interface HeaderProps {
  user: User | null;
  // users/{uid} 프로필에 저장된 이름 · 이메일 (없으면 로그인 계정 정보 사용)
  displayName?: string;
  email?: string;
  photoURL?: string; // users/{uid}의 프로필 이미지 (비어 있으면 기본 아이콘)
  authLoading: boolean; // 첫 로그인 상태 확인 중
  signingIn: boolean; // Google 로그인 진행 중
  previewHref: string; // 내 페이지 미리보기 주소
  onLogin: () => void;
  onLogout: () => void;
  onCopyLink: () => void;
}

// 상단 헤더 (와이어프레임: 가운데 "MyLink" 로고 + 오른쪽 액션 영역)
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
  onLogin,
  onLogout,
  onCopyLink,
}: HeaderProps) {
  const name = displayName || (user ? getDisplayName(user) : "");
  const mail = email || user?.email || "";

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center h-12">
      {/* 좌측 여백 (로고 가운데 정렬용) */}
      <div />

      {/* 가운데 로고 */}
      <span className="text-[18px] font-extrabold tracking-tight text-[#191F28] select-none">
        My<span className="text-primary">Link</span>
      </span>

      {/* 우측 로그인 영역 */}
      <div className="flex items-center justify-end min-w-0">
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
    </header>
  );
}
