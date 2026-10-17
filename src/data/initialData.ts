import { ProfileConfig, ContentBlock, ThemeConfig } from "@/types/mylink";

export const initialProfile: ProfileConfig = {
  displayName: "크리에이터 민지",
  bio: "일상과 테크 라이프스타일을 기록합니다 ✨\n비즈니스 문의는 아래 링크나 메일로 부탁드려요!",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  badge: "Creator",
  socials: {
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    github: "https://github.com",
    email: "minji.creator@example.com",
  },
};

export const initialBlocks: ContentBlock[] = [
  {
    id: "link-1",
    type: "link",
    title: "Instagram",
    url: "https://instagram.com",
    iconName: "Instagram",
    isVisible: true,
    order: 1,
  },
  {
    id: "link-2",
    type: "link",
    title: "YouTube",
    url: "https://youtube.com",
    iconName: "Youtube",
    isVisible: true,
    order: 2,
  },
  {
    id: "link-3",
    type: "link",
    title: "Blog",
    url: "https://velog.io",
    iconName: "Blog",
    isVisible: true,
    order: 3,
  },
  {
    id: "link-4",
    type: "link",
    title: "GitHub",
    url: "https://github.com",
    iconName: "GitHub",
    isVisible: true,
    order: 4,
  },
  {
    id: "link-5",
    type: "link",
    title: "Portfolio",
    url: "https://portfolio.com",
    iconName: "Portfolio",
    isVisible: true,
    order: 5,
  },
  {
    id: "link-6",
    type: "link",
    title: "123",
    url: "https://example.com",
    iconName: "123",
    isVisible: true,
    order: 6,
  },
];

export const initialTheme: ThemeConfig = {
  presetId: "toss-clean",
  backgroundStyle: "solid",
  backgroundColor: "#F2F4F6",
  buttonShape: "rounded-xl",
  buttonVariant: "filled",
  buttonColor: "#FFFFFF",
  buttonTextColor: "#191F28",
};
