import React from "react";
import { Mail, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ContactCardProps {
  email: string;
  onCopyEmail: () => void;
  isCopied?: boolean;
}

export function ContactCard({
  email,
  onCopyEmail,
  isCopied = false,
}: ContactCardProps) {
  const displayEmail = email.replace(/^mailto:/, "");

  return (
    <Card className="w-full p-4 rounded-2xl bg-card border border-border shadow-[0_1px_2px_rgba(25,31,40,0.04)] space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
          <Mail className="size-4 stroke-[2]" />
        </div>
        <div className="text-left">
          <h3 className="text-[14px] font-bold text-foreground">
            비즈니스 및 협업 문의
          </h3>
          <p className="text-[12px] text-muted-foreground">
            프로젝트 제안이나 커피챗은 언제든 편하게 연락주세요
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-secondary/80 border border-border/60 rounded-xl px-3.5 py-2.5">
        <span className="text-[13px] font-medium text-foreground truncate select-all">
          {displayEmail}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopyEmail}
          className="h-7 px-2.5 text-[12px] font-bold text-primary hover:bg-accent/80 active:scale-95 transition-all cursor-pointer shrink-0 ml-2"
        >
          {isCopied ? (
            <span className="flex items-center gap-1 text-[#04B059]">
              <Check className="size-3.5 stroke-[2.5]" />
              복사됨
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Copy className="size-3.5 stroke-[2]" />
              복사
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
}
