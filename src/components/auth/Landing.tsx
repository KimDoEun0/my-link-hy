import { BarChart3, Code2, Link2, Lock, LogIn, MousePointerClick, Pencil, Share2, User, Zap } from "lucide-react";
import {
  GithubBadgeIcon,
  InstagramBadgeIcon,
  PortfolioGlobeIcon,
  VelogBlogIcon,
  YoutubeBadgeIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface LandingProps {
  onLogin: () => void;
  signingIn: boolean;
}

// 배경에 은은하게 떠다니는 아이콘 (위치 · 크기 · 지연을 다르게 해 자연스럽게)
// 좁은 화면에서는 일부만 보여 글자를 가리지 않도록 함
const FLOATING_ICONS = [
  { icon: <GithubBadgeIcon className="size-full" />, className: "left-[2%] top-[4%] size-9 sm:size-11", delay: "0s" },
  { icon: <YoutubeBadgeIcon className="size-full" />, className: "right-[3%] top-[8%] size-8 sm:size-10", delay: "1.2s" },
  {
    icon: <Link2 className="size-full p-2 text-primary" />,
    className: "left-[10%] top-[58%] size-9 rounded-xl bg-white border border-[#E5E8EB] hidden sm:block",
    delay: "2.1s",
  },
  { icon: <InstagramBadgeIcon className="size-full" />, className: "right-[9%] top-[62%] size-9 hidden sm:block", delay: "0.6s" },
  { icon: <VelogBlogIcon className="size-full" />, className: "left-[20%] top-[18%] size-8 hidden lg:block", delay: "1.7s" },
  { icon: <PortfolioGlobeIcon className="size-full" />, className: "right-[20%] top-[24%] size-9 hidden lg:block", delay: "2.6s" },
];

// 미리보기 카드의 예시 링크 (실제 링크가 아닌 소개 이미지 역할)
const PREVIEW_LINKS = [
  { icon: <GithubBadgeIcon className="w-6 h-6" />, title: "GitHub", clicks: 128 },
  { icon: <VelogBlogIcon className="w-6 h-6" />, title: "개발 블로그", clicks: 86 },
  { icon: <PortfolioGlobeIcon className="w-6 h-6" />, title: "포트폴리오", clicks: 42 },
];

// 주요 기능 (Features): 히어로와 같은 카드 톤(흰 배경 · 회색 테두리 · 블루 포인트)
const FEATURES = [
  {
    icon: Zap,
    label: "Speed",
    title: "압도적인 속도",
    text: "Google 로그인 한 번이면 내 프로필 페이지가 바로 만들어져요.",
  },
  {
    icon: Pencil,
    label: "Editing",
    title: "직관적인 편집",
    text: "마우스를 올려 이름 · 소개 · 링크를 그 자리에서 바로 수정해요.",
  },
  {
    icon: BarChart3,
    label: "Insights",
    title: "통찰력 있는 데이터",
    text: "링크마다 클릭 수를 모아 통계 대시보드에서 한눈에 확인해요.",
  },
];

// 시작 가이드 (How It Works): 로그인 → 꾸미기 → 공유하기
const STEPS = [
  { icon: LogIn, title: "로그인", text: "Google 계정으로 3초 만에 시작해요." },
  { icon: Pencil, title: "꾸미기", text: "프로필 사진 · 소개를 다듬고 링크를 추가해요." },
  { icon: Share2, title: "공유하기", text: "mylink/내아이디 주소 하나만 공유하면 끝!" },
];

// 비로그인 랜딩 페이지: "Development in One Link" 서비스 소개
// 히어로(배지 · 제목 · 설명)는 기존 디자인 유지, 나머지 섹션은 같은 톤(흰 배경 · 회색 테두리 · Primary 포인트)으로 구성
export function Landing({ onLogin, signingIn }: LandingProps) {
  return (
    <section aria-labelledby="landing-title" className="relative isolate flex flex-col items-center text-center pt-6 pb-4">
      {/* 배경 장식: 은은하게 깜빡이는(animate-pulse) 파란 원 + 떠다니는 아이콘 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] -z-10">
        <span className="absolute left-1/2 top-6 -translate-x-[85%] size-56 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <span
          className="absolute left-1/2 top-24 translate-x-[5%] size-48 rounded-full bg-sky-300/20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        {FLOATING_ICONS.map(({ icon, className, delay }, i) => (
          <span key={i} className={cn("absolute opacity-40 animate-float", className)} style={{ animationDelay: delay }}>
            {icon}
          </span>
        ))}
      </div>

      {/* 히어로 (기존 디자인 그대로) */}
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary bg-accent px-3 py-1 rounded-full">
        <Code2 className="size-3.5" aria-hidden="true" />
        개발자를 위한 멀티링크
      </span>
      <h1
        id="landing-title"
        className="mt-4 text-[34px] leading-[1.15] font-extrabold tracking-tight text-[#191F28]"
      >
        Development
        <br />
        in <span className="text-primary">One Link</span>
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[#4E5968] break-keep">
        흩어져 있는 개발 활동을 하나의 링크로.
        <br />
        나만의 마이페이지에서 모든 링크를 관리하세요.
      </p>

      {/* 미리보기: 실제로 만들어질 내 페이지 예시 (마우스를 올리면 살짝 떠오름) */}
      <div
        aria-hidden="true"
        className="group mt-8 w-full max-w-[340px] p-4 bg-[#F9FAFB] border border-[#E5E8EB] rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(25,31,40,0.08)]"
      >
        {/* 주소 */}
        <div className="flex items-center justify-center gap-1 text-[12px] text-[#8B95A1]">
          <Lock className="size-3" />
          mylink/<span className="font-semibold text-[#4E5968]">dev_kim</span>
        </div>
        {/* 프로필 */}
        <div className="mt-3 flex flex-col items-center">
          <span className="size-14 rounded-full bg-accent ring-4 ring-white flex items-center justify-center">
            <User className="size-7 text-primary" />
          </span>
          <p className="mt-2 text-[15px] font-bold text-[#191F28]">김개발</p>
          <p className="text-[12px] text-[#8B95A1]">@dev_kim</p>
        </div>
        {/* 링크 카드 + 클릭 수 */}
        <div className="mt-4 space-y-2.5">
          {PREVIEW_LINKS.map((item, i) => (
            <div
              key={item.title}
              className="h-12 px-4 bg-white border border-[#E5E8EB] rounded-[2px] flex items-center transition-transform duration-300 group-hover:translate-x-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="w-8 flex justify-start shrink-0">{item.icon}</span>
              <span className="flex-1 text-left text-[14px] font-semibold text-[#191F28]">{item.title}</span>
              <span className="flex items-center gap-1 text-[12px] text-[#8B95A1] tabular-nums">
                <MousePointerClick className="size-3.5" />
                {item.clicks}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 기능 (Features): 모바일 세로 · 데스크톱 가로 3단 */}
      <div className="mt-14 w-full max-w-[880px]">
        <h2 className="text-[20px] font-bold tracking-tight text-[#191F28]">MyLink의 주요 기능</h2>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
          {FEATURES.map(({ icon: Icon, label, title, text }) => (
            <li
              key={label}
              className="group p-5 bg-white border border-[#E5E8EB] rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_28px_rgba(25,31,40,0.06)]"
            >
              <span className="size-9 rounded-full bg-accent text-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-primary">{label}</p>
              <h3 className="mt-0.5 text-[15px] font-bold text-[#191F28]">{title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-[#4E5968] break-keep">{text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* 시작 가이드 (How It Works): 모바일 세로 · 데스크톱 지그재그(좌우 교차) */}
      <div className="mt-14 w-full max-w-[720px]">
        <h2 className="text-[20px] font-bold tracking-tight text-[#191F28]">이렇게 시작해요</h2>
        <ol className="relative mt-6 space-y-4 sm:space-y-6">
          {/* 단계 사이를 잇는 세로 점선 (데스크톱은 가운데, 모바일은 왼쪽) */}
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-[27px] sm:left-1/2 border-l-2 border-dashed border-[#E5E8EB]"
          />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={cn("relative flex items-center gap-4 sm:gap-0", i % 2 === 1 && "sm:flex-row-reverse")}
            >
              {/* 단계 카드 */}
              <div className={cn("order-2 sm:order-none flex-1 sm:w-1/2 sm:flex-none", i % 2 === 0 ? "sm:pr-10" : "sm:pl-10")}>
                <div
                  className={cn(
                    "p-4 bg-white border border-[#E5E8EB] rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30",
                    i % 2 === 0 ? "sm:text-right" : "sm:text-left"
                  )}
                >
                  <p className="text-[12px] font-semibold text-primary">STEP {i + 1}</p>
                  <h3 className="mt-0.5 text-[15px] font-bold text-[#191F28]">{title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#4E5968] break-keep">{text}</p>
                </div>
              </div>
              {/* 가운데(모바일은 왼쪽) 아이콘 */}
              <span className="order-1 sm:order-none relative z-10 size-14 shrink-0 rounded-full bg-white border-2 border-primary/20 text-primary flex items-center justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              {/* 데스크톱 반대편 빈 공간 */}
              <div className="hidden sm:block sm:w-1/2" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>

      {/* 로그인 */}
      <div className="mt-10 w-full max-w-[460px]">
        <GoogleLoginButton
          onClick={onLogin}
          loading={signingIn}
          size="lg"
          label="Google로 시작하기"
          className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(25,31,40,0.08)]"
        />
      </div>
      <p className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#8B95A1] break-keep">
        <Lock className="size-3.5 shrink-0" aria-hidden="true" />
        Google 계정으로 로그인한 뒤 마이페이지를 사용할 수 있어요.
      </p>
    </section>
  );
}
