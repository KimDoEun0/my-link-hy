"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ContentBlock } from "@/types/mylink";
import { FaviconImage } from "./FaviconImage";
import {
  linkFormSchema,
  linkFormDefaults,
  normalizeUrl,
  TITLE_MAX,
  SUBTITLE_MAX,
  BADGE_MAX,
  type LinkFormValues,
} from "@/lib/linkFormSchema";
import {
  YoutubeIcon,
  InstagramIcon,
  TikTokIcon,
  GithubIcon,
  InstagramBadgeIcon,
  YoutubeBadgeIcon,
  VelogBlogIcon,
  GithubBadgeIcon,
  PortfolioGlobeIcon,
  Symbol123Icon,
} from "@/components/icons";
import {
  Plus,
  ShoppingBag,
  ShoppingCart,
  FileText,
  BookOpen,
  Clapperboard,
  Mail,
  MessageCircle,
  Globe,
  Link2,
  Loader2,
  Sparkles,
} from "lucide-react";

// 부모 컴포넌트로 전달할 새 블록 데이터 (id, order는 부모에서 부여)
export type NewBlockInput = Omit<ContentBlock, "id" | "order">;

interface AddLinkDialogProps {
  // 저장이 비동기(Firestore 등)면 Promise를 반환하고, 실패 시 예외를 던짐
  onAdd: (block: NewBlockInput) => void | Promise<void>;
  onSuccessToast?: (msg: string) => void;
  triggerButton?: React.ReactNode;
  // 외부에서 열림 상태를 제어할 때 사용 (지정 시 트리거 버튼을 렌더링하지 않음)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // 간단 모드: 제목과 URL만 입력받는 "새 링크 추가" 다이얼로그
  simple?: boolean;
}

const AVAILABLE_ICONS = [
  { id: "Favicon", label: "자동(파비콘)", icon: <Globe className="w-5 h-5 text-primary" /> },
  { id: "Instagram", label: "인스타그램", icon: <InstagramBadgeIcon className="w-5 h-5" /> },
  { id: "Youtube", label: "유튜브", icon: <YoutubeBadgeIcon className="w-5 h-5" /> },
  { id: "Blog", label: "블로그", icon: <VelogBlogIcon className="w-5 h-5" /> },
  { id: "github", label: "깃허브", icon: <GithubBadgeIcon className="w-5 h-5" /> },
  { id: "Portfolio", label: "포트폴리오", icon: <PortfolioGlobeIcon className="w-5 h-5" /> },
  { id: "123", label: "123 심볼", icon: <Symbol123Icon className="w-5 h-5" /> },
  { id: "Link2", label: "일반 링크", icon: <Link2 className="w-5 h-5 text-neutral-500" /> },
  { id: "ShoppingBag", label: "마켓", icon: <ShoppingBag className="w-4 h-4 text-orange-500" /> },
  { id: "FileText", label: "노션/문서", icon: <FileText className="w-4 h-4 text-blue-500" /> },
  { id: "Mail", label: "메일", icon: <Mail className="w-4 h-4 text-sky-500" /> },
];

const PRESET_BADGES = ["인기", "NEW", "추천", "한정 특가", "베스트셀러"];

export function AddLinkDialog({
  onAdd,
  onSuccessToast,
  triggerButton,
  open: controlledOpen,
  onOpenChange,
  simple = false,
}: AddLinkDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (isOpen: boolean) => {
    if (!isControlled) setInternalOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  // react-hook-form + zod: 폼 값·오류 관리와 입력 검증
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: linkFormDefaults,
    mode: "onSubmit", // 첫 검증은 제출 시
    reValidateMode: "onChange", // 이후에는 입력할 때마다 재검증
  });

  // 미리보기·글자 수 표시용 실시간 값
  const { blockType, title, url, subtitle, iconName, badge } = {
    ...linkFormDefaults,
    ...useWatch({ control }),
  };

  const [customBadgeInput, setCustomBadgeInput] = useState(false);

  const resetForm = () => {
    reset(linkFormDefaults);
    setCustomBadgeInput(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    // 저장 중에는 Esc · 바깥 클릭 · 닫기 버튼으로 닫히지 않음 (완료 후 자동으로 닫힘)
    if (!isOpen && isSubmitting) return;
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const changeBlockType = (type: LinkFormValues["blockType"]) => {
    setValue("blockType", type);
    clearErrors();
  };

  // 검증을 통과한 값만 들어옴 (zod에서 trim 처리 완료)
  // 저장이 끝난 뒤에만 성공 안내 후 닫고, 실패하면 다이얼로그를 유지한 채 오류 표시
  const onSubmit = async (data: LinkFormValues) => {
    const block: NewBlockInput =
      data.blockType === "header"
        ? { type: "header", title: data.title, isVisible: true }
        : {
            type: "link",
            title: data.title,
            url: normalizeUrl(data.url),
            subtitle: data.subtitle || undefined,
            iconName: data.iconName || "Favicon",
            badge: data.badge || undefined,
            isVisible: true,
          };

    try {
      await onAdd(block);
    } catch {
      setError("root", { message: "저장에 실패했어요. 잠시 후 다시 시도해주세요." });
      return;
    }

    onSuccessToast?.(
      data.blockType === "header" ? "새로운 섹션 헤더가 추가되었어요 📑" : "새로운 링크가 추가되었어요 ✨"
    );
    setOpen(false);
    resetForm();
  };

  const selectedIconObj = AVAILABLE_ICONS.find((item) => item.id === iconName);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
      <DialogTrigger
        render={
          triggerButton ? (
            (triggerButton as React.ReactElement)
          ) : (
            <button
              type="button"
              className="w-full h-13 rounded-none sm:rounded-[2px] bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              새로운 링크 추가하기
            </button>
          )
        }
      />
      )}

      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-accent text-primary">
              <Sparkles className="w-4 h-4" />
            </span>
            <DialogTitle>{simple ? "새 링크 추가" : "내 링크 관리"}</DialogTitle>
          </div>
          <DialogDescription>
            새로 추가할 링크의 제목과 주소를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        {/* 블록 타입 세그먼트 컨트롤 (링크 vs 섹션 헤더) - 간단 모드에서는 숨김 */}
        {!simple && (
        <div className="flex p-1 bg-secondary rounded-xl gap-1 mb-2">
          <button
            type="button"
            onClick={() => changeBlockType("link")}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${
              blockType === "link"
                ? "bg-white text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔗 URL 링크
          </button>
          <button
            type="button"
            onClick={() => changeBlockType("header")}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${
              blockType === "header"
                ? "bg-white text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📑 섹션 구분 헤더
          </button>
        </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* 블록 제목 입력 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
              <span>
                {blockType === "header" ? "섹션 헤더 제목" : "제목"}{" "}
                <span className="text-destructive">*</span>
              </span>
              <span className="text-[12px] font-normal text-muted-foreground">{title.length}/{TITLE_MAX}</span>
            </label>
            <Input
              type="text"
              placeholder={
                blockType === "header"
                  ? "예: 🔥 대표 채널 & 최신 소식"
                  : "예: 유튜브 채널 바로가기"
              }
              maxLength={TITLE_MAX}
              aria-invalid={!!errors.title}
              {...register("title")}
              className={errors.title ? "border-destructive focus-visible:ring-destructive/30" : ""}
            />
            {errors.title && (
              <p className="text-[12px] text-destructive font-medium pl-1">{errors.title.message}</p>
            )}
          </div>

          {/* 링크 전용 필드들 */}
          {blockType === "link" && (
            <>
              {/* 연결 대상 주소(URL) 입력 */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
                  <span>주소 (URL) <span className="text-destructive">*</span></span>
                  <span className="text-[12px] font-normal text-muted-foreground">https://...</span>
                </label>
                <Input
                  type="text"
                  placeholder="예: https://youtube.com/@channel"
                  inputMode="url"
                  aria-invalid={!!errors.url}
                  {...register("url")}
                  className={errors.url ? "border-destructive focus-visible:ring-destructive/30" : ""}
                />
                {errors.url && (
                  <p className="text-[12px] text-destructive font-medium pl-1">{errors.url.message}</p>
                )}
              </div>

              {/* 선택 입력 항목 (보조 설명 · 아이콘 · 뱃지) - 간단 모드에서는 숨김 */}
              {!simple && (
              <>
              {/* 보조 설명 입력 (선택) */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
                  <span>보조 설명 <span className="text-[12px] font-normal text-muted-foreground">(선택)</span></span>
                  <span className="text-[12px] font-normal text-muted-foreground">{subtitle.length}/{SUBTITLE_MAX}</span>
                </label>
                <Input
                  type="text"
                  placeholder="예: 매주 목요일 저녁 8시 신규 영상 업로드 🎥"
                  maxLength={SUBTITLE_MAX}
                  aria-invalid={!!errors.subtitle}
                  {...register("subtitle")}
                />
                {errors.subtitle && (
                  <p className="text-[12px] text-destructive font-medium pl-1">{errors.subtitle.message}</p>
                )}
              </div>

              {/* 아이콘 선택 */}
              <div className="space-y-2 pt-1">
                <label className="text-[13px] font-semibold text-foreground/90">
                  아이콘 선택
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[130px] overflow-y-auto p-1.5 border border-border/60 rounded-xl bg-secondary/30">
                  {AVAILABLE_ICONS.map((item) => {
                    const isSelected = iconName === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setValue("iconName", item.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[12px] gap-1 transition-all ${
                          isSelected
                            ? "bg-card shadow-xs border border-primary text-primary font-bold ring-1 ring-primary/40"
                            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="p-1 rounded-lg bg-background/80 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="truncate w-full text-center text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 뱃지 선택 (선택) */}
              <div className="space-y-2 pt-1">
                <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
                  <span>강조 뱃지 <span className="text-[12px] font-normal text-muted-foreground">(선택)</span></span>
                  {badge && (
                    <button
                      type="button"
                      onClick={() => {
                        setValue("badge", "", { shouldValidate: true });
                        setCustomBadgeInput(false);
                      }}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline"
                    >
                      지우기
                    </button>
                  )}
                </label>

                {/* 프리셋 뱃지 칩 */}
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_BADGES.map((preset) => {
                    const isSelected = badge === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setValue("badge", isSelected ? "" : preset, { shouldValidate: true });
                          setCustomBadgeInput(false);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[12px] font-medium transition-all ${
                          isSelected
                            ? "bg-primary text-white shadow-xs font-semibold"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setCustomBadgeInput(!customBadgeInput)}
                    className={`px-2.5 py-1 rounded-full text-[12px] font-medium transition-all border ${
                      customBadgeInput
                        ? "border-primary text-primary bg-primary/5 font-semibold"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    + 직접 입력
                  </button>
                </div>

                {customBadgeInput && (
                  <Input
                    type="text"
                    placeholder="뱃지 문구 (예: 마감임박, 이벤트)"
                    maxLength={BADGE_MAX}
                    aria-invalid={!!errors.badge}
                    {...register("badge")}
                    className="h-10 text-[13px] mt-1.5"
                    autoFocus
                  />
                )}
                {errors.badge && (
                  <p className="text-[12px] text-destructive font-medium pl-1">{errors.badge.message}</p>
                )}
              </div>
              </>
              )}
            </>
          )}

          {/* 실시간 미리보기 (Live Mini Preview) */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              실시간 미리보기
            </span>
            {blockType === "header" ? (
              <div className="py-2 px-3 border border-dashed border-border rounded-xl bg-secondary/20 text-left">
                <span className="text-[14px] font-bold text-foreground">
                  {title || "섹션 헤더 제목을 입력하세요"}
                </span>
              </div>
            ) : (
              <div className="p-3 border border-border/80 rounded-xl bg-card flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    {iconName === "Favicon" ? (
                      <FaviconImage
                        url={normalizeUrl(url) || undefined}
                        className="w-6 h-6"
                      />
                    ) : (
                      selectedIconObj?.icon || <Link2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-foreground truncate">
                        {title || "링크 제목을 입력하세요"}
                      </span>
                      {badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent text-accent-foreground shrink-0">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                      {subtitle || url || "연결 대상 URL 및 부가 설명"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">↗</span>
              </div>
            )}
          </div>

          {errors.root && (
            <p className="text-[12px] text-destructive font-medium text-center">{errors.root.message}</p>
          )}

          <DialogFooter className="pt-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  취소
                </Button>
              }
            />
            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              // 저장 중에는 스피너 아이콘만 표시 (화면 낭독기용 이름은 유지)
              aria-label={isSubmitting ? "저장 중" : undefined}
              // 저장 중에도 흐려지지 않도록 하고, 아이콘만 있어도 버튼 너비 유지
              className="w-full sm:w-auto sm:min-w-20 bg-primary text-primary-foreground font-semibold disabled:opacity-100"
            >
              {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
