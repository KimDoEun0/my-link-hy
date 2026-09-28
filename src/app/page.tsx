"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  Share2,
  Check,
  Globe,
  FileText,
  Code2,
  Sparkles,
  Layers,
  Copy,
  ArrowUpRight,
} from "lucide-react";

// Brand GitHub SVG Icon
function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Home() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "project" | "career">("all");

  const email = "gildong.hong@example.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "홍길동 · 개발자 프로필",
            text: "홍길동 개발자의 프로필과 링크를 확인해보세요.",
            url: window.location.href,
          });
          return;
        } catch {
          // ignore
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const techChips = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Node.js"];

  const activities = [
    {
      id: "mylink",
      category: "project",
      icon: <Layers className="w-5 h-5 text-[#3182F6]" />,
      iconBg: "bg-[#E8F3FF]",
      title: "MyLink - 바이오 링크 서비스",
      subtitle: "Next.js 16과 토스 디자인 시스템(TDS)으로 만든 웹 서비스예요",
      badge: "대표 프로젝트",
      url: "https://github.com",
    },
    {
      id: "blog",
      category: "project",
      icon: <Globe className="w-5 h-5 text-[#04B059]" />,
      iconBg: "bg-[#E8F8F0]",
      title: "기술 블로그 (Tech Notes)",
      subtitle: "개발 트러블슈팅과 배운 점을 꾸준히 기록하고 있어요",
      badge: "주 1회 기록",
      url: "https://velog.io",
    },
    {
      id: "resume",
      category: "career",
      icon: <FileText className="w-5 h-5 text-[#FF9E00]" />,
      iconBg: "bg-[#FFF6E6]",
      title: "상세 이력서 & 포트폴리오",
      subtitle: "참여한 프로젝트와 업무 기여도를 자세히 보실 수 있어요",
      badge: "Notion",
      url: "https://notion.so",
    },
    {
      id: "github",
      category: "career",
      icon: <GithubIcon className="w-5 h-5 text-[#333D4B]" />,
      iconBg: "bg-[#F2F4F6]",
      title: "GitHub 저장소",
      subtitle: "오픈소스 기여와 다양한 사이드 프로젝트를 둘러보세요",
      badge: "Open Source",
      url: "https://github.com",
    },
  ];

  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((item) => item.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-[-apple-system,BlinkMacSystemFont,'Pretendard',sans-serif] selection:bg-[#E8F3FF] selection:text-[#3182F6] flex flex-col justify-between">
      {/* 📱 토스 모바일 셸 (최대 480px) */}
      <div className="w-full max-w-[480px] mx-auto min-h-screen flex flex-col pb-28">
        {/* 1. TopBar (56pt 높이 표준 상단바) */}
        <header className="h-14 px-5 flex items-center justify-between sticky top-0 bg-[#F9FAFB]/90 backdrop-blur-md z-30">
          <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
            홍길동
          </span>
          <button
            onClick={handleShare}
            aria-label="프로필 공유하기"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4E5968] hover:bg-[#E5E8EB]/50 tds-press cursor-pointer"
          >
            <Share2 className="w-4 h-4 stroke-[2.2]" />
          </button>
        </header>

        {/* 2. 메인 바디 영역 */}
        <main className="px-5 pt-3 space-y-6">
          {/* 프로필 헤더 섹션 */}
          <section className="space-y-4">
            {/* 아바타 & 상태 뱃지 */}
            <div className="flex items-center justify-between">
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-3xl bg-[#F2F4F6] overflow-hidden border border-[#E5E8EB] p-1 shadow-2xs">
                  <Image
                    src="/avatar.svg"
                    alt="홍길동 프로필 사진"
                    width={72}
                    height={72}
                    priority
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>

              {/* 활성 상태 칩 (Full Pill) */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F8F0] text-[#04B059] text-[13px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#04B059]" />
                <span>협업 가능해요</span>
              </div>
            </div>

            {/* 타이틀 및 직무 (해요체 톤) */}
            <div className="space-y-1">
              <h1 className="text-[26px] font-bold tracking-tight text-[#191F28] leading-tight">
                안녕하세요,<br />개발자 홍길동이에요
              </h1>
              <p className="text-[15px] font-medium text-[#4E5968] pt-1">
                프론트엔드 & 풀스택 개발자
              </p>
            </div>

            {/* 자기소개 본문 */}
            <p className="text-[15px] text-[#4E5968] leading-relaxed break-keep">
              아이디어를 직관적이고 쓸모 있는 서비스로 코딩하고 있어요.
              사용자 경험을 먼저 고민하고, 읽기 쉬운 단단한 코드를 지향해요.
            </p>

            {/* 기술 스택 칩 (Brand-Weak Pill) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {techChips.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full bg-[#F2F4F6] text-[#4E5968] text-[13px] font-medium hover:bg-[#E8F3FF] hover:text-[#3182F6] transition-colors select-none"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* 분절형 컨트롤 (Segmented Control 탭) */}
          <div className="p-1 bg-[#F2F4F6] rounded-2xl flex items-center gap-1">
            {[
              { id: "all", label: "전체" },
              { id: "project", label: "프로젝트" },
              { id: "career", label: "경력 · 이력" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2 text-[14px] font-semibold rounded-xl tds-press transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                    : "text-[#8B95A1] hover:text-[#4E5968]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. 표준 TDS ListRow 카드 컨테이너 */}
          <section className="bg-white rounded-3xl p-5 border border-[#E5E8EB] shadow-[0_1px_2px_rgba(25,31,40,0.04)] space-y-1">
            <div className="flex items-center justify-between pb-2 px-1">
              <h2 className="text-[17px] font-bold text-[#191F28]">
                주요 활동이에요
              </h2>
              <span className="text-[13px] font-medium text-[#8B95A1]">
                {filteredActivities.length}개
              </span>
            </div>

            {/* ListRow 항목들 */}
            <div className="divide-y divide-[#F2F4F6]">
              {filteredActivities.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-1 flex items-center justify-between gap-3 group hover:bg-[#F9FAFB] rounded-2xl transition-colors tds-press cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 44px TDS 규격 아이콘 컨테이너 */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                    >
                      {item.icon}
                    </div>

                    {/* 타이틀 및 서브타이틀 스택 */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[16px] font-semibold text-[#191F28] group-hover:text-[#3182F6] transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F2F4F6] text-[#6B7684]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#8B95A1] truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 우측 Chevron Arrow */}
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* 4. 문의 및 연락 안내 카드 */}
          <section className="bg-white rounded-3xl p-5 border border-[#E5E8EB] shadow-[0_1px_2px_rgba(25,31,40,0.04)] space-y-2">
            <h3 className="text-[16px] font-bold text-[#191F28]">
              커피챗이나 프로젝트 제안을 기다려요
            </h3>
            <p className="text-[14px] text-[#6B7684] leading-relaxed">
              새로운 협업 기회나 가벼운 기술 이야기 모두 환영해요. 편하게 메일을 남겨주세요.
            </p>
            <div className="pt-2 flex items-center justify-between bg-[#F9FAFB] border border-[#E5E8EB] rounded-2xl px-4 py-3">
              <span className="text-[14px] font-medium text-[#191F28] truncate select-all">
                {email}
              </span>
              <button
                onClick={handleCopyEmail}
                className="text-[13px] font-bold text-[#3182F6] hover:underline shrink-0 ml-2 tds-press cursor-pointer"
              >
                복사
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* 5. 화면 최하단 고정 BottomCTA (보호 그라디언트 포함) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="w-full max-w-[480px] mx-auto px-5 pb-5 pointer-events-auto">
          {/* 상단 white → transparent 보호 그라디언트 */}
          <div className="h-8 bg-gradient-to-t from-[#F9FAFB] to-transparent w-full pointer-events-none -mb-1" />

          {/* 단일 강조색 TDS 56pt Primary Button */}
          <button
            onClick={handleCopyEmail}
            className="w-full h-14 bg-[#3182F6] hover:bg-[#2272EB] active:scale-[0.98] text-white font-bold text-[17px] rounded-2xl shadow-[0_4px_12px_rgba(49,130,246,0.25)] flex items-center justify-center gap-2 tds-press transition-all cursor-pointer"
          >
            {copiedEmail ? (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>이메일 주소를 복사했어요</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 stroke-[2]" />
                <span>이메일 주소 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6. TDS Toast (Grey-900 표면 + Green-500 체크 아이콘) */}
      {copiedEmail && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#191F28] text-white px-5 py-3 rounded-[14px] shadow-[0_8px_24px_rgba(25,31,40,0.16)] flex items-center gap-2 text-[14px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#04B059] flex items-center justify-center text-white shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>이메일 주소를 클립보드에 복사했어요</span>
        </div>
      )}
    </div>
  );
}
