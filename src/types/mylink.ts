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
