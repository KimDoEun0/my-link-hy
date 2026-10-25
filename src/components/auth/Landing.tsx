import { Code2, Link2, Lock, Pencil, ShieldCheck } from "lucide-react";
import { GithubBadgeIcon, PortfolioGlobeIcon, VelogBlogIcon } from "@/components/icons";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface LandingProps {
  onLogin: () => void;
  signingIn: boolean;
}

// 미리보기용 예시 링크 (실제 링크가 아닌 소개 이미지 역할)
const PREVIEW_LINKS = [
  { icon: <GithubBadgeIcon className="w-6 h-6" />, title: "GitHub" },
  { icon: <VelogBlogIcon className="w-6 h-6" />, title: "개발 블로그" },
  { icon: <PortfolioGlobeIcon className="w-6 h-6" />, title: "포트폴리오" },
];

const FEATURES = [
  { icon: Link2, text: "깃허브, 블로그, 포트폴리오를 한 곳에 모아요" },
  { icon: Pencil, text: "링크를 추가하고, 수정하고, 삭제할 수 있어요" },
  { icon: ShieldCheck, text: "내 계정에만 저장되어 다른 사람과 섞이지 않아요" },
];

// 비로그인 랜딩 페이지: "Development in One Link" 서비스 소개
export function Landing({ onLogin, signingIn }: LandingProps) {
  return (
    <section aria-labelledby="landing-title" className="flex flex-col items-center text-center pt-6 pb-4">
      {/* 소개 문구 */}
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

      {/* 미리보기 */}
      <div
        aria-hidden="true"
        className="mt-8 w-full max-w-[320px] p-4 bg-[#F9FAFB] border border-[#E5E8EB] rounded-2xl space-y-2.5"
      >
        {PREVIEW_LINKS.map((item) => (
          <div
            key={item.title}
            className="h-12 px-4 bg-white border border-[#E5E8EB] rounded-[2px] flex items-center"
          >
            <span className="w-8 flex justify-start shrink-0">{item.icon}</span>
            <span className="flex-1 text-[14px] font-semibold text-[#191F28] pr-8">{item.title}</span>
          </div>
        ))}
      </div>

      {/* 기능 안내 */}
      <ul className="mt-8 w-full space-y-2.5 text-left">
        {FEATURES.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-[14px] text-[#4E5968]">
            <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>

      {/* 로그인 */}
      <div className="mt-8 w-full">
        <GoogleLoginButton onClick={onLogin} loading={signingIn} size="lg" label="Google로 계속하기" />
      </div>
      <p className="mt-3 flex items-center justify-center gap-1 text-[13px] text-[#8B95A1] break-keep">
        <Lock className="size-3.5 shrink-0" aria-hidden="true" />
        Google 계정으로 로그인한 뒤 마이페이지를 사용할 수 있어요.
      </p>
    </section>
  );
}
