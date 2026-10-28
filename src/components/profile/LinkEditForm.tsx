"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { inlineCancelButtonClass, inlineInputClass, inlineSaveButtonClass } from "./inlineEditStyles";
import {
  linkEditSchema,
  normalizeUrl,
  TITLE_MAX,
  type LinkEditValues,
} from "@/lib/linkFormSchema";

interface LinkEditFormProps {
  initialTitle: string;
  initialUrl: string;
  // 저장 실패 시 예외를 던지면 폼 하단에 오류를 표시
  onSave: (data: { title: string; url: string }) => Promise<void>;
  // 수정 종료 (취소 또는 변경 없음)
  onCancel: () => void;
}

// 링크 카드 인라인 수정 폼
// - Enter 또는 입력칸 밖 클릭(Blur) 시 저장, Esc 시 취소
// - 링크 추가와 동일한 zod 검증 규칙 사용
export function LinkEditForm({ initialTitle, initialUrl, onSave, onCancel }: LinkEditFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LinkEditValues>({
    resolver: zodResolver(linkEditSchema),
    defaultValues: { title: initialTitle, url: initialUrl },
    mode: "onSubmit", // 첫 검증은 저장 시
    reValidateMode: "onChange", // 이후에는 입력할 때마다 재검증
  });

  const onSubmit = async (data: LinkEditValues) => {
    const next = { title: data.title, url: normalizeUrl(data.url) };

    // 변경 사항이 없으면 저장하지 않고 수정 모드만 종료
    if (next.title === initialTitle && next.url === initialUrl) {
      onCancel();
      return;
    }

    try {
      await onSave(next);
    } catch {
      setError("root", { message: "수정에 실패했어요. 잠시 후 다시 시도해주세요." });
    }
  };

  const save = () => {
    if (isSubmitting) return; // 중복 저장 방지
    void handleSubmit(onSubmit)();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          save();
        } else if (e.key === "Escape" && !isSubmitting) {
          e.preventDefault();
          onCancel();
        }
      }}
      onBlur={(e) => {
        // 포커스가 폼 밖으로 나갈 때만 저장 (제목 ↔ URL 칸 이동은 제외)
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) save();
      }}
      noValidate
      aria-label="링크 수정"
      aria-busy={isSubmitting}
      className="w-full px-5 py-4 bg-white border border-[#8B95A1] rounded-none sm:rounded-[2px] space-y-3"
    >
      {/* 제목 */}
      <div className="space-y-1">
        <label className="text-[12px] font-semibold text-foreground/80">
          제목 <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          placeholder="예: 유튜브 채널 바로가기"
          maxLength={TITLE_MAX}
          autoFocus
          disabled={isSubmitting}
          aria-invalid={!!errors.title}
          {...register("title")}
          className={cn(inlineInputClass, "h-10 text-[14px]")}
        />
        {errors.title && <FieldError message={errors.title.message} />}
      </div>

      {/* URL */}
      <div className="space-y-1">
        <label className="text-[12px] font-semibold text-foreground/80">
          주소 (URL) <span className="text-destructive">*</span>
        </label>
        <Input
          type="text"
          inputMode="url"
          placeholder="예: https://youtube.com/@channel"
          disabled={isSubmitting}
          aria-invalid={!!errors.url}
          {...register("url")}
          className={cn(inlineInputClass, "h-10 text-[14px]")}
        />
        {errors.url && <FieldError message={errors.url.message} />}
      </div>

      {errors.root && (
        <p role="alert" className="text-[12px] text-destructive font-medium text-center">
          {errors.root.message}
        </p>
      )}

      {/* 안내 · 취소(✕) · 저장(✓) */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] text-[#8B95A1]">
          {isSubmitting ? "저장 중..." : "Enter 또는 바깥 클릭 시 저장 · Esc 취소"}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            // 마우스를 누를 때 입력칸 포커스가 빠지면서 저장(Blur)되지 않도록 막음
            onMouseDown={(e) => e.preventDefault()}
            onClick={onCancel}
            disabled={isSubmitting}
            title="취소"
            aria-label="취소"
            className={inlineCancelButtonClass}
          >
            <X className="size-4" />
          </button>
          <button
            type="button"
            // Blur 저장과 겹쳐 두 번 저장되지 않도록 포커스 이동을 막고 클릭으로만 저장
            onMouseDown={(e) => e.preventDefault()}
            onClick={save}
            disabled={isSubmitting}
            title="저장"
            aria-label="저장"
            className={inlineSaveButtonClass}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          </button>
        </div>
      </div>
    </form>
  );
}

// 입력칸 아래 빨간 주의 아이콘 + 오류 문구
function FieldError({ message }: { message?: string }) {
  return (
    <p role="alert" className="flex items-center gap-1 pl-1 text-[12px] font-medium text-destructive">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
