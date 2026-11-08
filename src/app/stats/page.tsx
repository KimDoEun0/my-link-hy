"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { Activity, Crown, Divide, MousePointerClick, TrendingUp } from "lucide-react";
import { Header } from "@/components/auth";
import { FaviconImage } from "@/components/profile";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { personalPagePath } from "@/lib/publicProfile";
import { useUser } from "@/hooks/useUser";
import { useLinks } from "@/hooks/useLinks";
import { useAuthActions } from "@/hooks/useAuthActions";

const PREVIEW_PATH = "/mypage/preview";

// 막대 차트 설정 (shadcn chart): 클릭 수 막대는 Primary 색
const chartConfig = {
  clicks: { label: "클릭 수", color: "var(--primary)" },
} satisfies ChartConfig;

// 카드 공통 스타일: 반투명 흰 배경 + 블러(글래스모피즘) + 부드러운 그림자
const glassCard =
  "rounded-2xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(25,31,40,0.06)]";

// 숫자 카운트업 애니메이션 (0 → target, 약 0.8초)
// 동작 줄이기 설정을 켠 사용자에게는 바로 최종 숫자를 보여줌
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // 끝에서 천천히 멈춤
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

// 카운트업 숫자 (소수점 자릿수 지정 가능)
function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const scale = 10 ** decimals;
  const animated = useCountUp(Math.round(value * scale)) / scale;
  return <>{animated.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

type ChartItem = { id: string; title: string; url?: string; clicks: number };

// 커스텀 툴팁: 링크 이름 + 클릭 수 + 전체 대비 비율
type ClickTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
  totalClicks: number;
};

function ClickTooltip({ active, payload, totalClicks }: ClickTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as ChartItem;
  const percent = totalClicks > 0 ? Math.round((item.clicks / totalClicks) * 100) : 0;
  return (
    <div className="min-w-[140px] rounded-xl border border-[#E5E8EB] bg-white/95 px-3.5 py-2.5 shadow-[0_8px_24px_rgba(25,31,40,0.12)] backdrop-blur">
      <p className="max-w-[200px] truncate text-[13px] font-semibold text-[#191F28]">{item.title}</p>
      <div className="mt-1.5 flex items-center justify-between gap-4">
        <span className="flex items-center gap-1.5 text-[12px] text-[#8B95A1]">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          클릭 수
        </span>
        <span className="text-[13px] font-bold tabular-nums text-[#191F28]">{item.clicks.toLocaleString()}회</span>
      </div>
      <p className="mt-0.5 text-right text-[11px] tabular-nums text-[#8B95A1]">전체의 {percent}%</p>
    </div>
  );
}

// 보조 지표 카드
function MetricCard({
  icon,
  label,
  children,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  caption?: React.ReactNode;
}) {
  return (
    <div className={cn(glassCard, "p-5 transition-transform duration-200 hover:-translate-y-0.5")}>
      <p className="flex items-center gap-2 text-[13px] font-medium text-[#8B95A1]">
        <span className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
        {label}
      </p>
      <div className="mt-3">{children}</div>
      {caption && <p className="mt-1 text-[12px] text-[#8B95A1]">{caption}</p>}
    </div>
  );
}

// /stats 통계 대시보드 페이지 — 로그인 필수
// - useUser로 로그인 상태 확인, 비로그인 시 router.push("/")로 메인 이동
// - useLinks로 내 링크(users/{uid}/links)를 가져와 clickCount 합계(totalClicks) · 링크별 클릭 수 차트 표시 (실시간 구독 없음)
export default function StatsPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useUser();
  const { signingIn, login, logout } = useAuthActions((message) => toast(message));
  const uid = user?.uid ?? null;
  const linksQuery = useLinks(uid, { owner: true });
  const links = linksQuery.data ?? [];

  // 로그인 상태 확인이 끝났는데 로그인하지 않았으면 메인으로 이동
  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [authLoading, user, router]);

  const myPagePath = profile?.username ? personalPagePath(profile.username) : undefined;

  const copyMyLink = async () => {
    const url = `${window.location.origin}${myPagePath ?? "/mypage"}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("내 페이지 링크가 복사되었어요", { description: url });
    } catch {
      toast.error("링크를 복사하지 못했어요", { description: "브라우저의 클립보드 권한을 확인해주세요." });
    }
  };

  // 총 클릭 수: 모든 링크의 clickCount 합계
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount ?? 0), 0);
  // 차트 · 상세 리스트 데이터: 클릭 수가 많은 순
  const chartData: ChartItem[] = [...links]
    .map((link) => ({ id: link.id, title: link.title || "(제목 없음)", url: link.url, clicks: link.clickCount ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks);
  const top = chartData[0];
  // 평균 클릭 수: 링크 1개당 (소수점 1자리)
  const averageClicks = links.length > 0 ? totalClicks / links.length : 0;
  // 활성 링크: 한 번 이상 클릭된 링크
  const activeLinks = chartData.filter((item) => item.clicks > 0).length;
  // 전체 클릭 중 차지하는 비율 (%)
  const share = (clicks: number) => (totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif]">
      {/* 사이트 공통 헤더 (로고 → 메인, 내 페이지 버튼, 프로필 드롭다운으로 페이지 이동) */}
      <Header
        user={user}
        displayName={profile?.displayName}
        email={profile?.email}
        photoURL={profile ? profile.photoURL : user?.photoURL ?? ""}
        authLoading={authLoading}
        signingIn={signingIn}
        previewHref={myPagePath ?? PREVIEW_PATH}
        myPageHref={myPagePath}
        onLogin={login}
        onLogout={logout}
        onCopyLink={copyMyLink}
      />

      <main className="relative flex-1 w-full px-4 py-8 sm:py-10 flex justify-center overflow-hidden">
        {/* 배경 장식: 글래스 카드 뒤로 은은하게 비치는 색 번짐 */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-24 left-1/2 -translate-x-[70%] size-[420px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-64 left-1/2 translate-x-[10%] size-[360px] rounded-full bg-sky-300/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-[680px] flex flex-col gap-5">
          {/* 페이지 제목: 그라디언트 텍스트 + 서브타이틀 */}
          <div>
            <h1 className="text-[30px] font-extrabold tracking-tight bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
              통계 대시보드
            </h1>
            <p className="mt-1.5 text-[14px] text-[#6B7684]">내 링크가 얼마나 클릭됐는지 한눈에 확인해요</p>
          </div>

          {authLoading || !user || linksQuery.isPending ? (
            // 로그인 확인 · 링크 불러오는 중
            <div aria-busy="true" className="space-y-5">
              <div className="h-40 rounded-2xl bg-white/70 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white/70 animate-pulse" />
                ))}
              </div>
              <div className="h-80 rounded-2xl bg-white/70 animate-pulse" />
            </div>
          ) : linksQuery.isError ? (
            <div role="alert" className={cn(glassCard, "py-10 text-center")}>
              <p className="text-[15px] font-semibold text-[#4E5968]">통계를 불러오지 못했어요</p>
              <button
                type="button"
                onClick={() => linksQuery.refetch()}
                className="mt-3 text-[13px] font-semibold text-primary hover:underline"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <>
              {/* 주요 지표 1. 총 클릭 수 (대표 숫자): 눈부시지 않게 흰 글래스 카드 + 파란 포인트 */}
              <section aria-label="총 클릭 수" className={cn(glassCard, "relative overflow-hidden px-6 py-7")}>
                <div aria-hidden="true" className="absolute -right-10 -top-14 size-44 rounded-full bg-primary/10 blur-2xl" />
                <p className="relative flex items-center gap-2 text-[14px] font-medium text-[#6B7684]">
                  <span className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center" aria-hidden="true">
                    <MousePointerClick className="size-4" />
                  </span>
                  총 클릭 수
                </p>
                <p className="relative mt-3 text-[48px] leading-none font-extrabold tracking-tight tabular-nums text-[#191F28]">
                  <CountUp value={totalClicks} />
                  <span className="ml-1 text-[20px] font-bold text-[#8B95A1]">회</span>
                </p>
                <p className="relative mt-3 text-[13px] text-[#8B95A1]">
                  링크 {links.length}개의 클릭 수를 모두 더한 값이에요
                </p>
              </section>

              {/* 주요 지표 2~4. 인기 링크 · 평균 클릭 수 · 활성 링크 수 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard icon={<Crown className="size-4" />} label="가장 인기 있는 링크">
                  {top && top.clicks > 0 ? (
                    <>
                      <p className="truncate text-[18px] font-bold tracking-tight text-[#191F28]" title={top.title}>
                        {top.title}
                      </p>
                      <p className="mt-0.5 text-[13px] text-[#4E5968] tabular-nums">{top.clicks.toLocaleString()}회 클릭</p>
                    </>
                  ) : (
                    <p className="text-[16px] font-semibold text-[#B0B8C1]">아직 없어요</p>
                  )}
                </MetricCard>
                <MetricCard icon={<Divide className="size-4" />} label="평균 클릭 수" caption="링크 1개당">
                  <p className="text-[26px] leading-none font-bold tracking-tight text-[#191F28] tabular-nums">
                    <CountUp value={averageClicks} decimals={1} />
                    <span className="ml-0.5 text-[15px] font-semibold text-[#8B95A1]">회</span>
                  </p>
                </MetricCard>
                <MetricCard icon={<Activity className="size-4" />} label="활성 링크 수" caption="한 번 이상 클릭된 링크">
                  <p className="text-[26px] leading-none font-bold tracking-tight text-[#191F28] tabular-nums">
                    <CountUp value={activeLinks} />
                    <span className="ml-1 text-[15px] font-semibold text-[#8B95A1]">/ {links.length}개</span>
                  </p>
                </MetricCard>
              </div>

              {/* 링크별 클릭 수: 가로 막대 차트 + 상세 리스트 */}
              <section aria-label="링크별 클릭 수" className={cn(glassCard, "p-5 sm:p-6")}>
                <div className="pb-4">
                  <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#191F28]">
                    <TrendingUp className="size-4.5 text-primary" aria-hidden="true" />
                    링크별 클릭 수
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[#8B95A1]">클릭 수가 많은 순서예요</p>
                </div>

                {chartData.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-[15px] font-semibold text-[#4E5968]">아직 링크가 없어요</p>
                    <p className="mt-1 text-[13px] text-[#8B95A1]">마이페이지에서 링크를 추가해 보세요</p>
                  </div>
                ) : (
                  <>
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto w-full"
                      style={{ height: Math.max(140, chartData.length * 48) }}
                    >
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
                        barCategoryGap={12}
                      >
                        {/* 막대 색: Primary → 하늘색 가로 그라디언트 */}
                        <defs>
                          <linearGradient id="clicksGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="var(--color-clicks)" stopOpacity={0.85} />
                            <stop offset="100%" stopColor="#38BDF8" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid horizontal={false} vertical={false} />
                        {/* 축: 선 · 눈금 제거 (깔끔하게) */}
                        <XAxis
                          type="number"
                          dataKey="clicks"
                          allowDecimals={false}
                          hide
                          domain={[0, (max: number) => Math.max(max, 1)]}
                        />
                        <YAxis
                          type="category"
                          dataKey="title"
                          width={96}
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fill: "#4E5968", fontSize: 13, fontWeight: 500 }}
                          tickFormatter={(v: string) => (v.length > 7 ? `${v.slice(0, 7)}…` : v)}
                        />
                        <ChartTooltip
                          cursor={{ fill: "rgba(49,130,246,0.06)", radius: 8 }}
                          content={(props) => <ClickTooltip {...props} totalClicks={totalClicks} />}
                        />
                        {/* 막대 끝만 둥글게 (기준선 쪽은 직각), 등장 애니메이션 */}
                        <Bar
                          dataKey="clicks"
                          fill="url(#clicksGradient)"
                          radius={[0, 6, 6, 0]}
                          maxBarSize={24}
                          animationDuration={900}
                          animationEasing="ease-out"
                        >
                          <LabelList
                            dataKey="clicks"
                            position="right"
                            offset={10}
                            className="fill-[#4E5968]"
                            fontSize={12}
                            fontWeight={700}
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>

                    {/* 상세 리스트: 순위 · 아이콘 · 이름 · 클릭 수 · 비율 막대 */}
                    <ol className="mt-5 divide-y divide-[#F2F4F6] border-t border-[#F2F4F6]">
                      {chartData.map((item, index) => (
                        <li key={item.id} className="flex items-center gap-3 py-3.5">
                          <span
                            className={cn(
                              "size-6 shrink-0 rounded-full text-[12px] font-bold tabular-nums flex items-center justify-center",
                              index === 0 && item.clicks > 0 ? "bg-primary text-white" : "bg-[#F2F4F6] text-[#8B95A1]"
                            )}
                          >
                            {index + 1}
                          </span>
                          <span className="size-9 shrink-0 rounded-xl bg-white shadow-[0_1px_4px_rgba(25,31,40,0.08)] flex items-center justify-center">
                            <FaviconImage url={item.url} className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-semibold text-[#191F28]">{item.title}</span>
                            {/* 전체 대비 비율 막대 */}
                            <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-[#F2F4F6]">
                              <span
                                className="block h-full rounded-full bg-gradient-to-r from-primary to-sky-400 transition-[width] duration-700"
                                style={{ width: `${share(item.clicks)}%` }}
                              />
                            </span>
                          </span>
                          <span className="w-16 shrink-0 text-right">
                            <span className="block text-[15px] font-bold text-[#191F28] tabular-nums">
                              {item.clicks.toLocaleString()}회
                            </span>
                            <span className="block text-[12px] text-[#8B95A1] tabular-nums">{share(item.clicks)}%</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="py-8 text-center text-[12px] text-[#8B95A1]">
        © {new Date().getFullYear()} MyLink. All rights reserved.
      </footer>
    </div>
  );
}
