import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProfileShareButtonProps {
  onShare: () => void;
  className?: string;
}

export function ProfileShareButton({ onShare, className }: ProfileShareButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onShare}
      aria-label="프로필 공유하기"
      className="size-9 rounded-full bg-card shadow-xs border border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-90 transition-all cursor-pointer p-0"
    >
      <Share2 className="size-4 stroke-[2.2]" />
    </Button>
  );
}
