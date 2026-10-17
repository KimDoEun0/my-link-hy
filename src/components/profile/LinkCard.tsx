import { ArrowUpRight, Loader2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { FaviconImage } from "./FaviconImage";

export interface LinkCardProps {
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
  badge?: string;
  iconName?: string;
  shapeClass?: string;
  variantClass?: string;
  className?: string;
  onClick?: (id: string, url?: string) => void;
  onDelete?: (id: string) => void;
  // 지정 시 URL로 이동하지 않고 이 동작을 실행 (예: 다이얼로그 열기)
  onCardClick?: (id: string) => void;
  // 삭제 처리 중: 카드를 흐리게 하고 클릭을 막으며 삭제 버튼 자리에 스피너 표시
  isDeleting?: boolean;
}

export function LinkCard({
  id,
  title,
  subtitle,
  url,
  badge,
  iconName,
  shapeClass,
  variantClass,
  className,
  onClick,
  onDelete,
  onCardClick,
  isDeleting = false,
}: LinkCardProps) {
  // "Favicon" 아이콘이면 Google 파비콘 API로 사이트 아이콘을 자동 표시
  const useFavicon = iconName?.toLowerCase() === "favicon";
  const iconStyle = getBlockIcon(iconName || title);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDeleting) {
      e.preventDefault();
      return;
    }
    if (onCardClick) {
      e.preventDefault();
      onCardClick(id);
      return;
    }
    if (onClick) {
      onClick(id, url);
    }
  };

  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-busy={isDeleting}
      className={cn(
        "block group select-none no-underline outline-none",
        isDeleting && "opacity-50 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "w-full h-[76px] px-6 bg-white border border-[#E5E8EB] rounded-none sm:rounded-[2px] flex items-center justify-between relative shadow-none hover:border-gray-300 hover:shadow-xs transition-all duration-120 active:scale-[0.99] cursor-pointer",
          shapeClass,
          variantClass,
          className
        )}
      >
        {/* 좌측 아이콘 (36px 영역) */}
        <div className="w-10 flex items-center justify-start shrink-0">
          <div className="size-9 rounded-lg flex items-center justify-center shrink-0">
            {useFavicon ? <FaviconImage url={url} /> : iconStyle.icon}
          </div>
        </div>

        {/* 중앙 타이틀 (완벽한 중앙 정렬) */}
        <div className="flex-1 text-center px-2">
          <span className="text-[16px] font-semibold text-[#191F28] tracking-tight group-hover:text-primary transition-colors">
            {title}
          </span>
          {subtitle && (
            <p className="text-[12px] text-muted-foreground truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* 우측 액션 / 대칭 스페이스 (w-10으로 좌측과 대칭 유지) */}
        <div className="w-10 flex items-center justify-end shrink-0">
          {isDeleting ? (
            <span role="status" aria-label="삭제 중" className="size-8 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </span>
          ) : onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(id);
              }}
              title="링크 삭제"
              className="size-8 rounded-md flex items-center justify-center text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>
    </a>
  );
}
