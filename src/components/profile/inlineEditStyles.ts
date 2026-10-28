// 인라인 수정 모드 공용 스타일
// - 입력칸: 직사각형 + 조금 진한 회색 테두리 (포커스 시 더 진한 회색, 파란색 사용 안 함)
// - 오류 시 빨간 테두리는 Input/Textarea 기본 스타일(aria-invalid)을 그대로 사용
export const inlineInputClass =
  "rounded-[2px] border-[#8B95A1] bg-white shadow-none focus-visible:bg-white focus-visible:border-[#4E5968] focus-visible:ring-1 focus-visible:ring-[#4E5968]";

// ✕(취소) · ✓(저장) 아이콘 버튼: 입력칸과 같은 직사각형
export const inlineCancelButtonClass =
  "size-8 rounded-[2px] flex items-center justify-center bg-secondary text-[#4E5968] hover:bg-[oklch(0.930_0.005_248)] transition-colors disabled:opacity-30";
export const inlineSaveButtonClass =
  "size-8 rounded-[2px] flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60";
