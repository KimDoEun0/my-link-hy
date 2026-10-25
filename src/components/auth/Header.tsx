"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import type { User } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getDisplayName } from "@/lib/auth";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface HeaderProps {
  user: User | null;
  authLoading: boolean; // 첫 로그인 상태 확인 중
  signingIn: boolean; // Google 로그인 진행 중
  onLogin: () => void;
  onLogout: () => void;
}

// 상단 헤더 (와이어프레임: 가운데 "MyLink" 로고 + 오른쪽 액션 영역)
// - 로그아웃 상태: "Google로 로그인" 버튼
// - 로그인 상태: 내 프로필 사진 + 로그아웃 버튼
export function Header({ user, authLoading, signingIn, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center h-12">
      {/* 좌측 여백 (로고 가운데 정렬용) */}
      <div />

      {/* 가운데 로고 */}
      <span className="text-[18px] font-extrabold tracking-tight text-[#191F28] select-none">
        My<span className="text-primary">Link</span>
      </span>

      {/* 우측 로그인 영역 */}
      <div className="flex items-center justify-end gap-1.5 min-w-0">
        {authLoading ? (
          <div aria-hidden="true" className="h-9 w-24 rounded-full bg-[#F2F4F6] animate-pulse" />
        ) : user ? (
          <>
            <Avatar className="size-8 border border-black/5 shadow-none" title={getDisplayName(user)}>
              {user.photoURL && (
                <AvatarImage src={user.photoURL} alt="내 프로필 사진" referrerPolicy="no-referrer" />
              )}
              <AvatarFallback className="size-full rounded-full bg-secondary flex items-center justify-center">
                <UserIcon className="size-4 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            {/* 로그아웃: Base UI Button(ghost) */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="rounded-full text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]"
            >
              <LogOut aria-hidden="true" />
              로그아웃
            </Button>
          </>
        ) : (
          <GoogleLoginButton onClick={onLogin} loading={signingIn} />
        )}
      </div>
    </header>
  );
}
