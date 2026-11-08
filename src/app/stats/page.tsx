"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { MousePointerClick } from "lucide-react";
import { Header } from "@/components/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { personalPagePath } from "@/lib/publicProfile";
import { useUser } from "@/hooks/useUser";
import { useLinks } from "@/hooks/useLinks";
import { useAuthActions } from "@/hooks/useAuthActions";

const PREVIEW_PATH = "/mypage/preview";

// 막대 차트 설정 (shadcn chart): 클릭 수 막대는 Primary 색
const chartConfig = {
  clicks: { label: "클릭 수", color: "var(--primary)" },
} satisfies ChartConfig;

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
  // 차트 데이터: 클릭 수가 많은 순
  const chartData = [...links]
    .map((link) => ({ title: link.title || "(제목 없음)", clicks: link.clickCount ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif]">
      {/* 상단 헤더 (전체 너비) */}
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

      <main className="flex-1 w-full px-4 py-6 sm:py-8 flex justify-center">
        <div className="w-full max-w-[640px] flex flex-col gap-4">
          <h1 className="text-[22px] font-bold tracking-tight text-[#191F28]">통계</h1>

          {authLoading || !user || linksQuery.isPending ? (
            // 로그인 확인 · 링크 불러오는 중
            <div aria-busy="true" className="space-y-4">
              <div className="h-28 rounded-xl bg-[#F2F4F6] animate-pulse" />
              <div className="h-64 rounded-xl bg-[#F2F4F6] animate-pulse" />
            </div>
          ) : linksQuery.isError ? (
            <div role="alert" className="py-10 text-center border border-dashed border-[#E5E8EB] bg-white">
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
              {/* 총 클릭 수 카드 */}
              <Card>
                <CardHeader>
                  <CardDescription className="flex items-center gap-1.5">
                    <MousePointerClick className="size-4" aria-hidden="true" />
                    총 클릭 수
                  </CardDescription>
                  <CardTitle className="text-[32px] font-bold tracking-tight text-[#191F28]">
                    {totalClicks.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[13px] text-[#8B95A1]">
                  링크 {links.length}개의 클릭 수를 모두 더한 값이에요
                </CardContent>
              </Card>

              {/* 링크별 클릭 수 막대 차트 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[16px] font-bold text-[#191F28]">링크별 클릭 수</CardTitle>
                  <CardDescription>클릭 수가 많은 순서예요</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length === 0 ? (
                    <p className="py-10 text-center text-[14px] text-[#8B95A1]">아직 링크가 없어요</p>
                  ) : (
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto w-full"
                      style={{ height: Math.max(160, chartData.length * 48) }}
                    >
                      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 40 }}>
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" dataKey="clicks" allowDecimals={false} hide />
                        <YAxis
                          type="category"
                          dataKey="title"
                          width={96}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v: string) => (v.length > 8 ? `${v.slice(0, 8)}…` : v)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                        <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4}>
                          <LabelList dataKey="clicks" position="right" className="fill-foreground" fontSize={12} />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
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
