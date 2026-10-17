import React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  id?: string;
  title: string;
  className?: string;
  onDelete?: (id: string) => void;
}

export function SectionHeader({ id, title, className, onDelete }: SectionHeaderProps) {
  return (
    <div className={cn("pt-4 pb-1 flex items-center justify-between group", className)}>
      <h2 className="text-[15px] font-bold text-foreground px-1 tracking-tight text-left">
        {title}
      </h2>
      {onDelete && id && (
        <button
          type="button"
          onClick={() => onDelete(id)}
          title="섹션 헤더 삭제"
          className="size-7 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-70 sm:opacity-0 group-hover:opacity-100 mr-1"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}
