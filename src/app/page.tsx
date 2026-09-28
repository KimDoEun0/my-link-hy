"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Globe,
  ExternalLink,
  Share2,
  Sparkles,
  MapPin,
  Laptop,
  BookOpen,
  Briefcase,
  Copy,
  Check,
  Code2,
  Heart,
} from "lucide-react";

// Brand SVG Icons for crisp, reliable rendering
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

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function Home() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const email = "gildong.hong@example.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "홍길동의 프로필 & 링크",
            text: "소프트웨어 개발자 홍길동의 프로필을 확인해보세요!",
            url: window.location.href,
          });
          return;
        } catch {
          // Fallback to clipboard if share was cancelled or failed
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2200);
    }
  };

  const techSkills = [
    { name: "Next.js 16", color: "bg-black/5 text-zinc-900 dark:bg-white/10 dark:text-zinc-100" },
    { name: "React 19", color: "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300" },
    { name: "TypeScript", color: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300" },
    { name: "Tailwind CSS", color: "bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300" },
    { name: "Node.js", color: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" },
    { name: "Git", color: "bg-orange-500/10 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300" },
  ];

  const featuredLinks = [
    {
      title: "MyLink - 개인 링크 & 포트폴리오",
      description: "Next.js 16과 Tailwind CSS로 구현한 반응형 바이오 링크 서비스",
      badge: "대표 프로젝트",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
      icon: <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      url: "https://github.com",
    },
    {
      title: "기술 블로그 (Tech Notes)",
      description: "개발 과정에서 겪은 문제 해결 경험과 기술 회고 기록",
      badge: "주 1회 업데이트",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-300",
      icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      url: "https://velog.io",
    },
    {
      title: "상세 이력서 & 포트폴리오",
      description: "프로젝트별 기여도, 협업 경험 및 학력/자격 상세 내용",
      badge: "Notion Resume",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
      icon: <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      url: "https://notion.so",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* 앰비언트 글로우 배경 블러 효과 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-indigo-500/15 to-violet-500/20 rounded-full blur-3xl opacity-80" />
        <div className="absolute bottom-10 right-[-10%] sm:right-[15%] w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl opacity-70" />
      </div>

      {/* 상단 액션 바 */}
      <header className="relative z-10 w-full max-w-xl mx-auto px-4 pt-6 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>My Profile</span>
        </div>

        <button
          onClick={handleShare}
          className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700/60 text-xs font-medium text-zinc-700 dark:text-zinc-200 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 cursor-pointer"
          title="페이지 공유하기"
        >
          {copiedUrl ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">복사완료!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>공유</span>
            </>
          )}
        </button>
      </header>

      {/* 메인 프로필 카드 */}
      <main className="relative z-10 flex-1 w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        <div className="w-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-zinc-800 shadow-xl shadow-indigo-500/5 dark:shadow-black/50 p-6 sm:p-8 space-y-7 transition-all">
          {/* 프로필 이미지 & 기본 정보 */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* 아바타 이미지 영역 */}
            <div className="relative group">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-800">
                  <Image
                    src="/avatar.svg"
                    alt="홍길동 프로필 사진"
                    width={128}
                    height={128}
                    priority
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* 활성 상태 뱃지 */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-emerald-500/30 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>협업 가능</span>
              </div>
            </div>

            {/* 이름 및 직무 */}
            <div className="pt-2 space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                홍길동 <span className="text-sm font-normal text-zinc-400">Gildong Hong</span>
              </h1>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                <Code2 className="w-4 h-4" />
                <span>주니어 프론트엔드 & 풀스택 개발자</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>대한민국 서울 (Seoul, KR)</span>
              </div>
            </div>

            {/* 자기소개 */}
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-md pt-1 font-normal break-keep">
              안녕하세요! 코드로 상상을 현실로 구현하는 개발자 홍길동입니다.
              사용자 중심의 부드러운 인터랙션과 유지보수하기 쉬운 클린 코드를 작성하는 것을 즐깁니다.
            </p>

            {/* 기술 스택 칩 */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              {techSkills.map((tech) => (
                <span
                  key={tech.name}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-transform hover:scale-105 select-none ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>

            {/* 소셜 & 연락처 퀵 아이콘 바 */}
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub 프로필 방문"
                className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all hover:-translate-y-0.5 shadow-2xs cursor-pointer"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn 프로필 방문"
                className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all hover:-translate-y-0.5 shadow-2xs cursor-pointer"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="https://velog.io"
                target="_blank"
                rel="noreferrer"
                aria-label="블로그 방문"
                className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all hover:-translate-y-0.5 shadow-2xs cursor-pointer"
              >
                <Globe className="w-5 h-5" />
              </a>
              <button
                onClick={handleCopyEmail}
                aria-label="이메일 주소 복사하기"
                className="relative group p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-all hover:-translate-y-0.5 shadow-2xs cursor-pointer"
                title="이메일 복사"
              >
                {copiedEmail ? <Check className="w-5 h-5 text-emerald-500" /> : <Mail className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 주요 링크 섹션 (Bento Links) */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500 px-1">
              Featured Links & Work
            </h2>

            <div className="space-y-2.5">
              {featuredLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center justify-between p-4 rounded-2xl bg-zinc-50/80 hover:bg-white dark:bg-zinc-800/50 dark:hover:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/60 shadow-2xs hover:shadow-md hover:border-indigo-400/70 dark:hover:border-indigo-500/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-700 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                      {item.icon}
                    </div>
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          {/* 원클릭 이메일 문의 카드 */}
          <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 dark:border-indigo-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center sm:justify-start gap-1.5">
                <span>프로젝트 제안이나 커피챗은 언제든 열려있어요</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {email}
              </p>
            </div>
            <button
              onClick={handleCopyEmail}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>이메일 복사하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* 푸터 영역 */}
      <footer className="relative z-10 w-full max-w-xl mx-auto px-4 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-1">
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by 홍길동
        </p>
        <p>© 2026 Gildong Hong. Powered by Next.js & Tailwind CSS.</p>
      </footer>

      {/* 하단 알림 토스트 (이메일 복사 시) */}
      {copiedEmail && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-zinc-900/90 text-white dark:bg-white/95 dark:text-zinc-900 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>이메일 주소가 클립보드에 복사되었습니다! 🎉</span>
        </div>
      )}
    </div>
  );
}
