// 마이링크(MyLink) 핵심 타입 정의

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  github?: string;
  email?: string;
  chzzk?: string;
  blog?: string;
  threads?: string;
}

export interface ProfileConfig {
  displayName: string;
  bio: string;
  avatarUrl: string;
  badge?: string;
  socials: SocialLinks;
}

export type BlockType = "link" | "header";

export interface ContentBlock {
  id: string;
  type: BlockType;
  title: string;
  url?: string;
  subtitle?: string;
  iconName?: string;
  badge?: string;
  isVisible: boolean;
  order: number;
  clickCount?: number; // 클릭 수 (Firestore links 문서의 clickCount, 기본값 0)
}

export type PresetThemeId =
  | "toss-clean"
  | "modern-dark"
  | "soft-pastel"
  | "warm-minimal"
  | "neo-vibrant"
  | "monotone-sharp";

export interface ThemeConfig {
  presetId: PresetThemeId;
  backgroundStyle: "solid" | "gradient";
  backgroundColor: string; // Tailwind class or color
  buttonShape: "rounded-xl" | "rounded-full" | "rounded-none";
  buttonVariant: "filled" | "outline" | "shadow";
  buttonColor: string;
  buttonTextColor: string;
}

export interface DailyMetric {
  date: string;
  views: number;
  clicks: number;
}

export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  blockClicks: Record<string, number>;
  daily?: DailyMetric[];
}
