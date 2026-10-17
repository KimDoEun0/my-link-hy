import { ArrowUpRight, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

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
}

export function LinkCard({
  id,
  title,
  subtitle,
  url,
  badge,
  iconName,
  shapeClass = "rounded-2xl",
  variantClass = "bg-card border border-border shadow-[0_1px_2px_rgba(25,31,40,0.04)] hover:shadow-md",
  className,
  onClick,
  onDelete,
}: LinkCardProps) {
  const iconStyle = getBlockIcon(iconName);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      className="block group select-none no-underline outline-none"
    >
      <Card
        className={cn(
          "w-full p-4 flex flex-row items-center justify-between gap-3.5 transition-all duration-120 active:scale-[0.98] cursor-pointer",
          shapeClass,
          variantClass,
          className
        )}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* 44px 아이콘 컨테이너 */}
          <div
            className={cn(
              "size-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
              iconStyle.bgClass
            )}
          >
            {iconStyle.icon}
          </div>

          {/* 타이틀 및 서브타이틀 스택 */}
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {title}
              </span>
              {badge && (
                <Badge
                  variant="default"
                  className="rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-[11px] font-semibold border-0"
                >
                  {badge}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="text-[13px] text-muted-foreground group-hover:text-foreground/80 truncate mt-0.5 transition-colors">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 우측 액션: 삭제 버튼 & 새 창 이동 화살표 */}
        <div className="flex items-center gap-1 shrink-0">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(id);
              }}
              title="링크 삭제"
              className="size-8 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-70 sm:opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
          <div className="size-8 rounded-full flex items-center justify-center text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
            <ArrowUpRight className="size-4 stroke-[2.2]" />
          </div>
        </div>
      </Card>
    </a>
  );
}
