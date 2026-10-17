// 링크 목록을 불러오는 동안 표시하는 스켈레톤 카드 (LinkCard와 동일한 크기)
export function LinkCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full h-[76px] px-6 bg-white border border-[#E5E8EB] rounded-none sm:rounded-[2px] flex items-center justify-between animate-pulse"
    >
      {/* 좌측 아이콘 자리 */}
      <div className="w-10 flex items-center justify-start shrink-0">
        <div className="size-8 rounded-lg bg-[#F2F4F6]" />
      </div>

      {/* 중앙 타이틀 자리 */}
      <div className="flex-1 flex justify-center px-2">
        <div className="h-4 w-32 rounded bg-[#F2F4F6]" />
      </div>

      {/* 우측 대칭 공간 */}
      <div className="w-10 shrink-0" />
    </div>
  );
}
