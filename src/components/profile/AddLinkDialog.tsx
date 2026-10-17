"use client";

import React, { useState } from "react";
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
import { useMyLinkStore } from "@/lib/useMyLinkStore";
import {
  YoutubeIcon,
  InstagramIcon,
  TikTokIcon,
  GithubIcon,
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
  Sparkles,
} from "lucide-react";

interface AddLinkDialogProps {
  onSuccessToast?: (msg: string) => void;
  triggerButton?: React.ReactNode;
}

const AVAILABLE_ICONS = [
  { id: "Youtube", label: "유튜브", icon: <YoutubeIcon className="w-4 h-4 text-red-500" /> },
  { id: "Instagram", label: "인스타", icon: <InstagramIcon className="w-4 h-4 text-pink-500" /> },
  { id: "Video", label: "숏폼/틱톡", icon: <TikTokIcon className="w-4 h-4 text-neutral-800" /> },
  { id: "ShoppingBag", label: "마켓", icon: <ShoppingBag className="w-4 h-4 text-orange-500" /> },
  { id: "ShoppingCart", label: "쇼핑", icon: <ShoppingCart className="w-4 h-4 text-amber-500" /> },
  { id: "FileText", label: "노션/문서", icon: <FileText className="w-4 h-4 text-blue-500" /> },
  { id: "BookOpen", label: "강의/책", icon: <BookOpen className="w-4 h-4 text-emerald-500" /> },
  { id: "Clapperboard", label: "미디어", icon: <Clapperboard className="w-4 h-4 text-indigo-500" /> },
  { id: "Mail", label: "메일", icon: <Mail className="w-4 h-4 text-sky-500" /> },
  { id: "MessageCircle", label: "카카오톡", icon: <MessageCircle className="w-4 h-4 text-yellow-600" /> },
  { id: "github", label: "깃허브", icon: <GithubIcon className="w-4 h-4 text-neutral-700" /> },
  { id: "Globe", label: "웹사이트", icon: <Globe className="w-4 h-4 text-slate-600" /> },
  { id: "Link2", label: "일반 링크", icon: <Link2 className="w-4 h-4 text-neutral-500" /> },
];

const PRESET_BADGES = ["인기", "NEW", "추천", "한정 특가", "베스트셀러"];

export function AddLinkDialog({ onSuccessToast, triggerButton }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const addBlock = useMyLinkStore((state) => state.addBlock);

  // Tab state: "link" | "header"
  const [blockType, setBlockType] = useState<"link" | "header">("link");

  // Form states
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [iconName, setIconName] = useState("Link2");
  const [badge, setBadge] = useState("");
  const [customBadgeInput, setCustomBadgeInput] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setSubtitle("");
    setIconName("Link2");
    setBadge("");
    setCustomBadgeInput(false);
    setErrors({});
    setBlockType("link");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const validate = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = blockType === "header" ? "섹션 헤더 제목을 입력해주세요." : "링크 제목을 입력해주세요.";
    }

    if (blockType === "link") {
      if (!url.trim()) {
        newErrors.url = "연결할 URL 링크를 입력해주세요.";
      } else {
        let testUrl = url.trim();
        if (!/^https?:\/\//i.test(testUrl) && !/^mailto:/i.test(testUrl)) {
          testUrl = "https://" + testUrl;
        }
        try {
          new URL(testUrl);
        } catch {
          newErrors.url = "올바른 URL 형식(예: https://example.com)을 입력해주세요.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (blockType === "header") {
      addBlock({
        type: "header",
        title: title.trim(),
        isVisible: true,
      });
      onSuccessToast?.("새로운 섹션 헤더가 추가되었어요 📑");
    } else {
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !/^mailto:/i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }

      addBlock({
        type: "link",
        title: title.trim(),
        url: finalUrl,
        subtitle: subtitle.trim() || undefined,
        iconName: iconName || "Link2",
        badge: badge.trim() || undefined,
        isVisible: true,
      });
      onSuccessToast?.("새로운 링크가 추가되었어요 ✨");
    }

    setOpen(false);
    resetForm();
  };

  const selectedIconObj = AVAILABLE_ICONS.find((item) => item.id === iconName);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          triggerButton ? (
            (triggerButton as React.ReactElement)
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-full h-13 rounded-2xl border-dashed border-2 border-border/80 bg-background/50 hover:bg-secondary/70 hover:border-primary/50 text-[15px] font-semibold text-foreground/80 gap-2 transition-all shadow-none"
            >
              <Plus className="w-4 h-4 text-primary" />
              새 링크 추가하기
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-accent text-primary">
              <Sparkles className="w-4 h-4" />
            </span>
            <DialogTitle>콘텐츠 블록 추가</DialogTitle>
          </div>
          <DialogDescription>
            방문자에게 보여줄 새 링크 버튼이나 섹션 구분 헤더를 추가하세요.
          </DialogDescription>
        </DialogHeader>

        {/* 블록 타입 세그먼트 컨트롤 (링크 vs 섹션 헤더) */}
        <div className="flex p-1 bg-secondary rounded-xl gap-1 mb-2">
          <button
            type="button"
            onClick={() => {
              setBlockType("link");
              setErrors({});
            }}
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
            onClick={() => {
              setBlockType("header");
              setErrors({});
            }}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${
              blockType === "header"
                ? "bg-white text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📑 섹션 구분 헤더
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 블록 제목 입력 */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
              <span>
                {blockType === "header" ? "섹션 헤더 제목" : "링크 제목"}{" "}
                <span className="text-destructive">*</span>
              </span>
              <span className="text-[12px] font-normal text-muted-foreground">{title.length}/40</span>
            </label>
            <Input
              type="text"
              placeholder={
                blockType === "header"
                  ? "예: 🔥 대표 채널 & 최신 소식"
                  : "예: 유튜브 채널 바로가기"
              }
              value={title}
              maxLength={40}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={errors.title ? "border-destructive focus-visible:ring-destructive/30" : ""}
            />
            {errors.title && (
              <p className="text-[12px] text-destructive font-medium pl-1">{errors.title}</p>
            )}
          </div>

          {/* 링크 전용 필드들 */}
          {blockType === "link" && (
            <>
              {/* 연결 대상 URL 입력 */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
                  <span>연결 URL <span className="text-destructive">*</span></span>
                  <span className="text-[12px] font-normal text-muted-foreground">https://...</span>
                </label>
                <Input
                  type="text"
                  placeholder="예: https://youtube.com/@channel"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
                  }}
                  className={errors.url ? "border-destructive focus-visible:ring-destructive/30" : ""}
                />
                {errors.url && (
                  <p className="text-[12px] text-destructive font-medium pl-1">{errors.url}</p>
                )}
              </div>

              {/* 보조 설명 입력 (선택) */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-foreground/90 flex items-center justify-between">
                  <span>보조 설명 <span className="text-[12px] font-normal text-muted-foreground">(선택)</span></span>
                  <span className="text-[12px] font-normal text-muted-foreground">{subtitle.length}/50</span>
                </label>
                <Input
                  type="text"
                  placeholder="예: 매주 목요일 저녁 8시 신규 영상 업로드 🎥"
                  value={subtitle}
                  maxLength={50}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
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
                        onClick={() => setIconName(item.id)}
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
                        setBadge("");
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
                          setBadge(isSelected ? "" : preset);
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
                    value={badge}
                    maxLength={10}
                    onChange={(e) => setBadge(e.target.value)}
                    className="h-10 text-[13px] mt-1.5"
                    autoFocus
                  />
                )}
              </div>
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
                    {selectedIconObj?.icon || <Link2 className="w-4 h-4 text-primary" />}
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

          <DialogFooter className="pt-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
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
              className="w-full sm:w-auto bg-primary text-white"
            >
              추가 완료
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
