// 오픈 그래프(OG) 이미지 공통 설정
// - opengraph-image.tsx(일반 경로) · [username]/opengraph-image.tsx(동적 경로)에서 함께 사용
// - 장식(흐린 원 · 떠다니는 아이콘 · 배지)은 쓰지 않고 큰 글씨와 실제 데이터로 구성
// - ImageResponse(Satori)는 기본 한글 폰트가 없어 Google Fonts에서 필요한 글자만 받아 사용
import { SITE_URL } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";
export const DEFAULT_OG_ALT = "MyLink - 흩어진 링크를 하나의 페이지로";

// 디자인 토큰 (globals.css · design.md의 토스 TDS 값과 동일)
export const OG_COLORS = {
  white: "#FFFFFF",
  grey100: "#F2F4F6",
  grey200: "#E5E8EB",
  grey500: "#8B95A1",
  grey700: "#4E5968",
  grey900: "#191F28",
  blue500: "#3182F6",
  blue50: "#E8F3FF",
  blue400: "#64A8FF", // 다크 배경 위 포인트 색 (blue-500보다 한 단계 밝게)
};

// 사이트 도메인 (이미지 하단 주소 표시용)
export const SITE_HOST = new URL(SITE_URL).host;

const FETCH_TIMEOUT_MS = 3000; // 외부 요청(폰트 · 이미지)이 늦어져도 이미지 생성이 멈추지 않도록 제한

type OgFontWeight = 400 | 700 | 800;
type OgFont = { name: string; data: ArrayBuffer; weight: OgFontWeight; style: "normal" };

// Noto Sans KR 중 text에 쓰인 글자만 내려받기 (실패하면 null → 기본 폰트로 렌더링)
async function loadGoogleFont(weight: OgFontWeight, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// 이미지에 들어가는 모든 글자를 넘겨 400 · 700 · 800 세 굵기를 준비
export async function loadOgFonts(text: string): Promise<OgFont[]> {
  const unique = Array.from(new Set(text)).join("");
  const weights: OgFontWeight[] = [400, 700, 800];
  const data = await Promise.all(weights.map((w) => loadGoogleFont(w, unique)));
  return weights.flatMap((weight, i) => {
    const font = data[i];
    return font ? [{ name: "Noto Sans KR", data: font, weight, style: "normal" as const }] : [];
  });
}

// 이미지를 data URL로 변환 (불러오지 못하면 null)
export async function loadImageAsDataUrl(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith("data:image/")) return src;
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/") || type.includes("svg")) return null;
    const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${type};base64,${base64}`;
  } catch {
    return null;
  }
}

// 링크 주소 → Google 파비콘 API 주소 (FaviconImage와 같은 방식, 서버에서 쓰기 위해 별도 정의)
export function faviconUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    return hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=64` : null;
  } catch {
    return null;
  }
}

// 긴 글자 자르기 (넘치면 …)
export function clip(text: string, max: number): string {
  const value = text.replace(/\s+/g, " ").trim();
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

// 텍스트 워드마크 "MyLink"
export function OgWordmark({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <div style={{ display: "flex", fontSize: size, fontWeight: 800, color, letterSpacing: -1 }}>MyLink</div>
  );
}

// 클릭 아이콘 (lucide MousePointerClick)
export function OgClickIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4.1 12 6" />
      <path d="m5.1 8-2.9-.8" />
      <path d="m6 12-1.9 2" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
    </svg>
  );
}

// 파비콘 (불러오지 못하면 회색 칸)
export function OgFavicon({ src, size }: { src: string | null; size: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={size} height={size} style={{ borderRadius: 6 }} />
  ) : (
    <div style={{ display: "flex", width: size, height: size, borderRadius: 6, background: OG_COLORS.grey100 }} />
  );
}

// ───────────── 일반 경로용 기본 이미지 ─────────────
// 왼쪽: 다크 네이비 배경 + 큰 글씨 / 오른쪽: 실제 서비스 화면 두 장(프로필 · 클릭 통계)을 나란히 배치
// - 겹치거나 떠 있는 장식 없이, 같은 높이에서 시작해 이미지 아래쪽에서 잘리는 실제 화면처럼 구성
export const DEFAULT_OG_TEXT = {
  line1: "흩어진 링크를,",
  line2: "하나의 페이지로.",
  description1: "GitHub, 블로그, 포트폴리오를", // Satori는 단어 단위 줄바꿈(keep-all)이 없어 줄을 직접 나눔
  description2: "주소 하나로 공유하세요.",
  statsLabel: "이번 주 클릭",
  statsValue: "1,284",
  topLabel: "가장 많이 클릭",
};

// 예시 프로필 (랜딩 페이지 미리보기 카드와 같은 예시)
const SAMPLE = {
  name: "김개발",
  username: "dev_kim",
  links: [
    { title: "GitHub", url: "https://github.com", clicks: 128 },
    { title: "개발 블로그", url: "https://velog.io", clicks: 86 },
    { title: "YouTube", url: "https://youtube.com", clicks: 54 },
    { title: "포트폴리오", url: "https://notion.so", clicks: 42 },
  ],
  days: ["월", "화", "수", "목", "금", "토", "일"],
  bars: [38, 52, 44, 70, 58, 86, 100], // 요일별 클릭 막대 높이(%)
};

export const DEFAULT_OG_GLYPHS =
  `MyLink${Object.values(DEFAULT_OG_TEXT).join("")}${SITE_HOST}${SAMPLE.name}@${SAMPLE.username}${SAMPLE.days.join("")}` +
  SAMPLE.links.map((l) => `${l.title}${l.clicks}`).join("");

// 예시 링크의 파비콘을 미리 받아두기 (기본 이미지 생성 시 1회)
export async function loadDefaultOgFavicons(): Promise<(string | null)[]> {
  return Promise.all(SAMPLE.links.map((l) => loadImageAsDataUrl(faviconUrl(l.url))));
}

// 오른쪽 화면 카드 공통 스타일 (같은 위쪽 선에서 시작, 아래는 이미지 밖으로 잘림)
const screenCard = {
  position: "absolute",
  top: 96,
  height: 600,
  display: "flex",
  flexDirection: "column",
  background: OG_COLORS.white,
  borderRadius: 24,
} as const;

export function DefaultOgContent({ favicons = [] }: { favicons?: (string | null)[] }) {
  const lastBar = SAMPLE.bars.length - 1;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: OG_COLORS.grey900,
        fontFamily: '"Noto Sans KR"',
      }}
    >
      {/* 왼쪽: 글씨 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 580,
          padding: "72px 0 72px 88px",
        }}
      >
        <OgWordmark color={OG_COLORS.white} size={34} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.22,
              letterSpacing: -3,
              color: OG_COLORS.white,
            }}
          >
            <span>{DEFAULT_OG_TEXT.line1}</span>
            <span>{DEFAULT_OG_TEXT.line2}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 26,
              fontSize: 25,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <span>{DEFAULT_OG_TEXT.description1}</span>
            <span>{DEFAULT_OG_TEXT.description2}</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: OG_COLORS.blue400 }}>{SITE_HOST}</div>
      </div>

      {/* 오른쪽 1: 프로필 화면 */}
      <div style={{ ...screenCard, left: 628, width: 300, alignItems: "center", padding: "30px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 9999,
            background: OG_COLORS.blue50,
            color: OG_COLORS.blue500,
            fontSize: 30,
            fontWeight: 800,
          }}
        >
          {SAMPLE.name.slice(0, 1)}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 22, fontWeight: 700, color: OG_COLORS.grey900 }}>{SAMPLE.name}</div>
        <div style={{ display: "flex", fontSize: 15, color: OG_COLORS.grey500 }}>@{SAMPLE.username}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 20 }}>
          {SAMPLE.links.map((link, i) => (
            <div
              key={link.title}
              style={{
                display: "flex",
                alignItems: "center",
                height: 52,
                padding: "0 14px",
                border: `2px solid ${OG_COLORS.grey200}`,
                borderRadius: 4,
              }}
            >
              <OgFavicon src={favicons[i] ?? null} size={22} />
              <div style={{ display: "flex", flex: 1, marginLeft: 10, fontSize: 17, fontWeight: 700, color: OG_COLORS.grey900 }}>
                {link.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: OG_COLORS.grey500 }}>
                <div style={{ display: "flex", marginRight: 4 }}>
                  <OgClickIcon size={14} color={OG_COLORS.grey500} />
                </div>
                {link.clicks}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 2: 클릭 통계 화면 */}
      <div style={{ ...screenCard, left: 944, width: 196, padding: "28px 22px" }}>
        <div style={{ display: "flex", fontSize: 15, color: OG_COLORS.grey500 }}>{DEFAULT_OG_TEXT.statsLabel}</div>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: -1, color: OG_COLORS.grey900 }}>
          {DEFAULT_OG_TEXT.statsValue}
        </div>
        {/* 요일별 막대 */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 150, marginTop: 24 }}>
          {SAMPLE.bars.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flex: 1,
                height: `${h}%`,
                borderRadius: 3,
                background: i === lastBar ? OG_COLORS.blue500 : "#C9E2FF",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {SAMPLE.days.map((day, i) => (
            <div
              key={day}
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                fontSize: 12,
                color: i === lastBar ? OG_COLORS.grey900 : OG_COLORS.grey500,
                fontWeight: i === lastBar ? 700 : 400,
              }}
            >
              {day}
            </div>
          ))}
        </div>
        {/* 가장 많이 클릭된 링크 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, paddingTop: 18, borderTop: `2px solid ${OG_COLORS.grey100}` }}>
          <div style={{ display: "flex", fontSize: 14, color: OG_COLORS.grey500 }}>{DEFAULT_OG_TEXT.topLabel}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <OgFavicon src={favicons[0] ?? null} size={20} />
            <div style={{ display: "flex", marginLeft: 8, fontSize: 17, fontWeight: 700, color: OG_COLORS.grey900 }}>
              {SAMPLE.links[0].title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
