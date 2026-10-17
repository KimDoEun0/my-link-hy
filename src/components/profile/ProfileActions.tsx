import React from "react";
import { Share2, Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProfileActionsProps {
  onShare: () => void;
  onCopyEmail: () => void;
  isEmailCopied?: boolean;
  isLinkCopied?: boolean;
}

export function ProfileActions({
  onShare,
  onCopyEmail,
  isEmailCopied = false,
  isLinkCopied = false,
}: ProfileActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 pt-2">
      {/* 1. 프로필 링크 공유하기 버튼 (shadcn/ui Button 기반 TDS Primary) */}
      <Button
        variant="default"
        size="lg"
        onClick={onShare}
        className="w-full h-12 rounded-xl text-[14px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
      >
        {isLinkCopied ? (
          <>
            <Check className="size-4 stroke-[2.5]" />
            <span>링크 복사됨</span>
          </>
        ) : (
          <>
            <Share2 className="size-4 stroke-[2.2]" />
            <span>프로필 링크 공유하기</span>
          </>
        )}
      </Button>

      {/* 2. 이메일 복사 버튼 (shadcn/ui Button 기반 TDS Secondary) */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onCopyEmail}
        className="w-full h-12 rounded-xl text-[14px] font-bold border border-border/80 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
      >
        {isEmailCopied ? (
          <>
            <Check className="size-4 stroke-[2.5] text-[#04B059]" />
            <span className="text-[#04B059]">이메일 복사됨</span>
          </>
        ) : (
          <>
            <Copy className="size-4 stroke-[2]" />
            <span>이메일 복사</span>
          </>
        )}
      </Button>
    </div>
  );
}
