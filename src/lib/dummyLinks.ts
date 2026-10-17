// 링크 목록에 사용할 더미 데이터
// icon 필드는 Lucide 아이콘 이름(string)으로 저장하고,
// page.tsx에서 ICON_MAP을 통해 실제 JSX 컴포넌트로 렌더링합니다.

export type LinkCategory = "all" | "project" | "career";

export interface DummyLink {
  id: string;
  category: Exclude<LinkCategory, "all">;
  iconName: string;      // Lucide 아이콘 이름
  iconColor: string;     // Tailwind text-* 클래스
  iconBg: string;        // Tailwind bg-* 클래스
  title: string;
  subtitle: string;
  badge: string;
  url: string;
}

export const dummyLinks: DummyLink[] = [
  // ── 프로젝트 ──────────────────────────────────────────────
  {
    id: "mylink",
    category: "project",
    iconName: "Layers",
    iconColor: "text-[#3182F6]",
    iconBg: "bg-[#E8F3FF]",
    title: "MyLink - 바이오 링크 서비스",
    subtitle: "Next.js 16과 토스 디자인 시스템(TDS)으로 만든 웹 서비스예요",
    badge: "대표 프로젝트",
    url: "https://github.com/gildong/mylink",
  },
  {
    id: "blog",
    category: "project",
    iconName: "Globe",
    iconColor: "text-[#04B059]",
    iconBg: "bg-[#E8F8F0]",
    title: "기술 블로그 (Tech Notes)",
    subtitle: "개발 트러블슈팅과 배운 점을 꾸준히 기록하고 있어요",
    badge: "주 1회 기록",
    url: "https://velog.io/@gildong",
  },
  {
    id: "side-chat",
    category: "project",
    iconName: "MessageSquare",
    iconColor: "text-[#8B5CF6]",
    iconBg: "bg-[#F3F0FF]",
    title: "SideChat - AI 슬랙 봇",
    subtitle: "팀 회의록을 자동 요약해주는 사내 챗봇 프로젝트예요",
    badge: "해커톤 수상",
    url: "https://github.com/gildong/side-chat",
  },
  {
    id: "design-system",
    category: "project",
    iconName: "Paintbrush",
    iconColor: "text-[#EC4899]",
    iconBg: "bg-[#FDF2F8]",
    title: "사내 디자인 시스템 (DS-Core)",
    subtitle: "Storybook + Figma 연동 컴포넌트 라이브러리 구축 경험이에요",
    badge: "팀 프로젝트",
    url: "https://storybook.js.org",
  },

  // ── 경력 · 이력 ──────────────────────────────────────────
  {
    id: "resume",
    category: "career",
    iconName: "FileText",
    iconColor: "text-[#FF9E00]",
    iconBg: "bg-[#FFF6E6]",
    title: "상세 이력서 & 포트폴리오",
    subtitle: "참여한 프로젝트와 업무 기여도를 자세히 보실 수 있어요",
    badge: "Notion",
    url: "https://notion.so/gildong-resume",
  },
  {
    id: "github",
    category: "career",
    iconName: "Github",
    iconColor: "text-[#333D4B]",
    iconBg: "bg-[#F2F4F6]",
    title: "GitHub 저장소",
    subtitle: "오픈소스 기여와 다양한 사이드 프로젝트를 둘러보세요",
    badge: "Open Source",
    url: "https://github.com/gildong",
  },
  {
    id: "linkedin",
    category: "career",
    iconName: "Linkedin",
    iconColor: "text-[#0A66C2]",
    iconBg: "bg-[#E8F0FB]",
    title: "LinkedIn 프로필",
    subtitle: "업무 경력과 추천서를 확인하실 수 있어요",
    badge: "경력 3년",
    url: "https://linkedin.com/in/gildong",
  },
  {
    id: "certifications",
    category: "career",
    iconName: "Award",
    iconColor: "text-[#F59E0B]",
    iconBg: "bg-[#FFFBEB]",
    title: "자격증 & 수료 이력",
    subtitle: "정보처리기사, AWS SAA, SQLD 등 보유 자격증 목록이에요",
    badge: "자격증 5개",
    url: "https://notion.so/gildong-certs",
  },
];
