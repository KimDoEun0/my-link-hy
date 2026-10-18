"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteLinkDialogProps {
  // 삭제할 링크 (null이면 닫힘)
  target: { id: string; title: string } | null;
  // 삭제 실패 시 예외를 던지면 모달 안에 오류를 표시
  onConfirm: (id: string) => Promise<void>;
  onClose: () => void;
}

// 링크 삭제 확인 모달
export function DeleteLinkDialog({ target, onConfirm, onClose }: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      setError("");
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    setError("");
    try {
      await onConfirm(target.id);
      onClose();
    } catch {
      setError("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={target !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]" showCloseButton={false}>
        <DialogHeader className="items-center text-center pr-0 mb-4">
          <span className="mb-1 size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="size-6" />
          </span>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription render={<div />} className="space-y-2 pt-1">
            {/* 삭제할 링크 이름 */}
            <p className="text-[15px] font-semibold text-foreground break-all">
              &ldquo;{target?.title}&rdquo;
            </p>
            {/* 경고 문구 */}
            <p className="text-[14px] font-semibold text-destructive">이 작업은 되돌릴 수 없습니다</p>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p role="alert" className="text-[12px] text-destructive font-medium text-center mb-2">
            {error}
          </p>
        )}

        {/* 화면 너비와 관계없이 [취소][삭제하기] 가로 배치 */}
        <DialogFooter className="flex-row sm:flex-row justify-center">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-busy={isDeleting}
            // 삭제 중에는 스피너 아이콘만 표시 (화면 낭독기용 이름은 유지)
            aria-label={isDeleting ? "삭제 중" : undefined}
            // 삭제 중에도 흐려지지 않도록 disabled 투명도 대신 진행 표시
            className="flex-1 disabled:opacity-100"
          >
            {isDeleting ? <Loader2 className="animate-spin" aria-hidden="true" /> : "삭제하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
