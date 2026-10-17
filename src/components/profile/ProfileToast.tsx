import React from "react";
import { Check } from "lucide-react";

export interface ProfileToastProps {
  message?: string;
  visible: boolean;
}

export function ProfileToast({
  message = "프로필 링크가 복사되었어요",
  visible,
}: ProfileToastProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--tds-grey-900)] text-white px-5 py-3 rounded-[14px] shadow-[var(--tds-shadow-toast)] flex items-center gap-2.5 text-[14px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 select-none"
    >
      {/* 20px green-500 원 + 흰 체크 (design.md 규격 1:1 매핑) */}
      <div className="size-5 rounded-full bg-[var(--tds-green-500)] flex items-center justify-center text-white shrink-0">
        <Check className="size-3.5 stroke-[3]" />
      </div>
      <span>{message}</span>
    </div>
  );
}
