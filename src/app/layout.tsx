import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "마이링크 (MyLink) | 크리에이터 멀티링크 프로필",
  description: "크리에이터를 위한 한국형 멀티링크 바이오 서비스 마이링크(MyLink)입니다.",
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
        {children}
        {/* sonner 토스트: 화면 상단 중앙 */}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
