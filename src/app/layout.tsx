import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { BASE_OPEN_GRAPH, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 사이트 공통 메타데이터 (SEO)
// - 페이지별로 title만 정하면 "제목 | 마이링크 (MyLink)" 형태로 표시
// - OG 이미지는 파일 규칙(opengraph-image.tsx)으로 자동 연결
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // OG 이미지 등 절대 주소가 필요한 메타데이터의 기준 주소
  title: {
    default: `${SITE_NAME} | 개발자를 위한 멀티링크`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: `${SITE_NAME} | 개발자를 위한 멀티링크`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image", // 공유 시 OG 이미지를 크게 표시
    title: `${SITE_NAME} | 개발자를 위한 멀티링크`,
    description: SITE_DESCRIPTION,
  },
  // 한국어 페이지이므로 Chrome 자동 번역 제안을 띄우지 않음
  other: { google: "notranslate" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* TanStack Query: 데이터 조회 · 추가 · 수정 · 삭제 (실시간 · 자동 재요청 없음) */}
        <QueryProvider>{children}</QueryProvider>
        {/* sonner 토스트: 화면 상단 중앙 */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
