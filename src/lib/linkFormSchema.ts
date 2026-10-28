import { z } from "zod";

// 프로토콜이 없으면 https://를 붙여 URL을 정규화 (mailto:는 그대로 유지)
export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

// 정규화된 URL이 실제로 열 수 있는 주소인지 확인
export function isValidLinkUrl(value: string): boolean {
  // 주소 중간에 공백이 있으면 잘못된 형식
  if (/\s/.test(value.trim())) return false;
  try {
    const parsed = new URL(normalizeUrl(value));
    if (parsed.protocol === "mailto:") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.pathname);
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    // 도메인: 영문·숫자·하이픈 라벨 + 점(.) + 2자 이상 TLD (한글 도메인은 punycode로 변환되어 검사, localhost는 예외)
    const host = parsed.hostname;
    return (
      host === "localhost" ||
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,}|xn--[a-z0-9-]+)$/i.test(host)
    );
  } catch {
    return false;
  }
}

export const TITLE_MAX = 40;
export const SUBTITLE_MAX = 50;
export const BADGE_MAX = 10;

// 공통 검증 규칙 (링크 추가·수정에서 함께 사용)
const titleField = z.string().trim().max(TITLE_MAX, `제목은 ${TITLE_MAX}자 이하로 입력해주세요.`);
const LINK_TITLE_REQUIRED = "링크 제목을 입력해주세요.";

// URL: 필수 + 형식 검사
function refineLinkUrl(url: string, ctx: z.RefinementCtx) {
  if (!url) {
    ctx.addIssue({ code: "custom", path: ["url"], message: "연결할 URL 링크를 입력해주세요." });
  } else if (!isValidLinkUrl(url)) {
    ctx.addIssue({
      code: "custom",
      path: ["url"],
      message: "올바른 URL 형식(예: https://example.com)을 입력해주세요.",
    });
  }
}

// 링크 추가 다이얼로그 입력 검증 스키마
export const linkFormSchema = z
  .object({
    blockType: z.enum(["link", "header"]),
    title: titleField,
    url: z.string().trim(),
    subtitle: z.string().trim().max(SUBTITLE_MAX, `보조 설명은 ${SUBTITLE_MAX}자 이하로 입력해주세요.`),
    iconName: z.string(),
    badge: z.string().trim().max(BADGE_MAX, `뱃지는 ${BADGE_MAX}자 이하로 입력해주세요.`),
  })
  .superRefine((data, ctx) => {
    // 제목: 필수 (블록 종류에 따라 안내 문구 구분)
    if (!data.title) {
      ctx.addIssue({
        code: "custom",
        path: ["title"],
        message: data.blockType === "header" ? "섹션 헤더 제목을 입력해주세요." : LINK_TITLE_REQUIRED,
      });
    }

    // URL: 링크 블록일 때만 필수 + 형식 검사
    if (data.blockType === "link") {
      refineLinkUrl(data.url, ctx);
    }
  });

export type LinkFormValues = z.infer<typeof linkFormSchema>;

export const linkFormDefaults: LinkFormValues = {
  blockType: "link",
  title: "",
  url: "",
  subtitle: "",
  iconName: "Favicon",
  badge: "",
};

// 링크 인라인 수정 검증 스키마 (추가와 동일한 제목·URL 규칙)
export const linkEditSchema = z
  .object({
    title: titleField,
    url: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (!data.title) {
      ctx.addIssue({ code: "custom", path: ["title"], message: LINK_TITLE_REQUIRED });
    }
    refineLinkUrl(data.url, ctx);
  });

export type LinkEditValues = z.infer<typeof linkEditSchema>;
