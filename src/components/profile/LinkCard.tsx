"use client";

import { useState } from "react";
import { MousePointerClick, Pencil, Trash2 } from "lucide-react";
import { getBlockIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { FaviconImage } from "./FaviconImage";
import { LinkEditForm } from "./LinkEditForm";
import { DeleteLinkDialog } from "./DeleteLinkDialog";

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
  // 지정 시 URL로 이동하지 않고 이 동작을 실행 (예: 다이얼로그 열기)
  onCardClick?: (id: string) => void;
  // 수정 저장 (지정 시 수정 버튼 표시). 실패 시 예외를 던지면 수정 폼에 오류 표시
  onUpdate?: (id: string, data: { title: string; url: string }) => Promise<void>;
  // 삭제 실행 (지정 시 삭제 버튼 표시). 실패 시 예외를 던지면 삭제 모달에 오류 표시
  onDelete?: (id: string) => Promise<void>;
  // 읽기 전용: 수정 · 삭제 버튼과 수정 폼 · 삭제 모달을 숨기고 링크 클릭만 가능 (공개 프로필 페이지)
  readonly?: boolean;
  // 클릭 수 (지정 시 제목 아래에 아이콘 + 숫자로 표시, 마이페이지에서만 전달)
  clickCount?: number;
}

// 링크 카드: 수정(인라인 편집) · 삭제(확인 모달) 상태를 카드마다 독립적으로 관리
export function LinkCard({
  id,
  title,
  subtitle,
  url,
  iconName,
  shapeClass,
  variantClass,
  className,
  onClick,
  onCardClick,
  onUpdate,
  onDelete,
  readonly = false,
  clickCount,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // "Favicon" 아이콘이면 Google 파비콘 API로 사이트 아이콘을 자동 표시
  const useFavicon = iconName?.toLowerCase() === "favicon";
  const iconStyle = getBlockIcon(iconName || title);
  const canEdit = !readonly && !!onUpdate;
  const canDelete = !readonly && !!onDelete;
  const hasActions = canEdit || canDelete;

  // 인라인 수정 모드
  if (isEditing && canEdit && onUpdate) {
    return (
      <LinkEditForm
        initialTitle={title}
        initialUrl={url ?? ""}
        onSave={async (data) => {
          await onUpdate(id, data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onCardClick) {
      e.preventDefault();
      onCardClick(id);
      return;
    }
    onClick?.(id, url);
  };

  // 좌우 영역 너비를 같게 맞춰 제목을 가운데 정렬 (버튼이 있으면 넓게)
  const sideWidth = hasActions ? "w-20" : "w-10";

  return (
    <>
      <div
        className={cn(
          "w-full h-[76px] bg-white border border-[#E5E8EB] rounded-none sm:rounded-[2px] flex items-center relative shadow-none hover:border-gray-300 hover:shadow-xs transition-all duration-120 group",
          shapeClass,
          variantClass,
          className
        )}
      >
        {/* 링크 영역 (아이콘 + 제목): 클릭 시 새 탭으로 이동 */}
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex-1 min-w-0 h-full pl-6 flex items-center select-none no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.99] transition-transform"
        >
          {/* 좌측 아이콘 */}
          <div className={cn(sideWidth, "flex items-center justify-start shrink-0")}>
            <div className="size-9 rounded-lg flex items-center justify-center shrink-0">
              {useFavicon ? <FaviconImage url={url} /> : iconStyle.icon}
            </div>
          </div>

          {/* 중앙 타이틀 */}
          <div className="flex-1 min-w-0 text-center px-2">
            <span className="block truncate text-[16px] font-semibold text-[#191F28] tracking-tight group-hover:text-primary transition-colors">
              {title}
            </span>
            {subtitle && (
              <p className="text-[12px] text-muted-foreground truncate mt-0.5">{subtitle}</p>
            )}
            {clickCount !== undefined && (
              // 아이콘 + 숫자만 표시 (화면 낭독기용 이름은 "클릭 N회")
              <p
                className="mt-0.5 flex items-center justify-center gap-1 text-[12px] text-[#8B95A1]"
                aria-label={`클릭 ${clickCount}회`}
                title={`클릭 ${clickCount.toLocaleString()}회`}
              >
                <MousePointerClick className="size-3.5" aria-hidden="true" />
                {clickCount.toLocaleString()}
              </p>
            )}
          </div>
        </a>

        {/* 우측 수정 · 삭제 버튼 (항상 표시) / 버튼이 없으면 대칭용 빈 공간 */}
        {/* box-content: 좌측(pl-6 + 아이콘 영역)과 너비를 같게 맞춰 제목을 정확히 가운데 정렬 */}
        <div className={cn(sideWidth, "box-content pr-6 flex items-center justify-end gap-0.5 shrink-0")}>
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="링크 수정"
              aria-label={`${title} 수정`}
              // 수정 버튼: 항상 파란색(Primary)
              className="size-8 rounded-md flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
            >
              <Pencil className="size-4" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              title="링크 삭제"
              aria-label={`${title} 삭제`}
              // 삭제 버튼: 항상 빨간색(Destructive)
              className="size-8 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {canDelete && onDelete && (
        <DeleteLinkDialog
          target={isDeleteOpen ? { id, title } : null}
          onConfirm={onDelete}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  );
}
