// 오픈 그래프(OG) 이미지 공통 설정
// - opengraph-image.tsx(일반 경로) · [username]/opengraph-image.tsx(동적 경로)에서 함께 사용
// - ImageResponse(Satori)는 기본 한글 폰트가 없어 Google Fonts에서 필요한 글자만 받아 사용

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// 디자인 토큰 (globals.css · design.md의 토스 TDS 값과 동일)
export const OG_COLORS = {
  background: "#F9FAFB", // bg-gray-50
  card: "#FFFFFF",
  border: "#E5E8EB", // grey-200
  primary: "#3182F6", // blue-500
  primaryWeak: "#E8F3FF", // blue-50
  text: "#191F28", // grey-900
  textSecondary: "#4E5968", // grey-700
  textTertiary: "#8B95A1", // grey-500
};

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

// Noto Sans KR 중 text에 쓰인 글자만 내려받기 (실패하면 null → 기본 폰트로 렌더링)
async function loadGoogleFont(weight: 400 | 700, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// 이미지에 들어가는 모든 글자를 넘겨 400 · 700 두 굵기를 준비
export async function loadOgFonts(text: string): Promise<OgFont[]> {
  const unique = Array.from(new Set(text)).join("");
  const [regular, bold] = await Promise.all([loadGoogleFont(400, unique), loadGoogleFont(700, unique)]);
  const fonts: OgFont[] = [];
  if (regular) fonts.push({ name: "Noto Sans KR", data: regular, weight: 400, style: "normal" });
  if (bold) fonts.push({ name: "Noto Sans KR", data: bold, weight: 700, style: "normal" });
  return fonts;
}

// 프로필 이미지를 data URL로 변환 (불러오지 못하면 null → 이름 첫 글자 아바타로 대체)
export async function loadImageAsDataUrl(src: string | undefined): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith("data:image/")) return src;
  try {
    const res = await fetch(src);
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/") || type.includes("svg")) return null;
    const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${type};base64,${base64}`;
  } catch {
    return null;
  }
}

// 링크 아이콘 (lucide Link2와 같은 모양)
export function OgLinkIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </svg>
  );
}

// "MyLink" 로고 (블루 아이콘 배지 + 텍스트)
export function OgLogo({ scale = 1 }: { scale?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 * scale }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52 * scale,
          height: 52 * scale,
          borderRadius: 16 * scale,
          background: OG_COLORS.primary,
        }}
      >
        <OgLinkIcon size={30 * scale} color="#FFFFFF" />
      </div>
      <div style={{ display: "flex", fontSize: 36 * scale, fontWeight: 700, color: OG_COLORS.text, letterSpacing: -1 }}>
        MyLink
      </div>
    </div>
  );
}

// 공통 배경: 단색(기본 연한 회색) + 랜딩 히어로처럼 은은한 파란 원 두 개
export function OgBackground({
  children,
  background = OG_COLORS.background,
}: {
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background,
        fontFamily: '"Noto Sans KR"',
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -120,
          top: -160,
          width: 560,
          height: 560,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(49,130,246,0.16) 0%, rgba(49,130,246,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -140,
          bottom: -200,
          width: 600,
          height: 600,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0) 70%)",
        }}
      />
      {children}
    </div>
  );
}

// ───────────── 일반 경로용 기본 이미지: 랜딩 페이지 히어로 섹션과 같은 구성 ─────────────
// 왼쪽: 배지 · "Development in One Link" · 설명 / 오른쪽: 내 페이지 미리보기 카드 / 배경: 떠다니는 아이콘

// lucide 아이콘을 Satori에서 쓰기 위한 SVG 래퍼 (stroke 아이콘)
function LucideSvg({ size, color, children }: { size: number; color: string; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const CodeIcon = ({ size, color }: { size: number; color: string }) => (
  <LucideSvg size={size} color={color}>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </LucideSvg>
);
const LockIcon = ({ size, color }: { size: number; color: string }) => (
  <LucideSvg size={size} color={color}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </LucideSvg>
);
const UserIcon = ({ size, color }: { size: number; color: string }) => (
  <LucideSvg size={size} color={color}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </LucideSvg>
);
const ClickIcon = ({ size, color }: { size: number; color: string }) => (
  <LucideSvg size={size} color={color}>
    <path d="M14 4.1 12 6" />
    <path d="m5.1 8-2.9-.8" />
    <path d="m6 12-1.9 2" />
    <path d="M7.2 2.2 8 5.1" />
    <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
  </LucideSvg>
);

// 랜딩 페이지와 같은 브랜드 아이콘 (components/icons.tsx와 같은 모양, 크기만 width/height로 지정)
const GithubIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="#181717">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 2C8.268 2 2 8.268 2 16c0 6.186 4.011 11.433 9.574 13.284.7.129.956-.304.956-.675 0-.332-.012-1.213-.019-2.382-3.895.846-4.717-1.877-4.717-1.877-.637-1.618-1.556-2.049-1.556-2.049-1.271-.869.096-.851.096-.851 1.405.099 2.145 1.443 2.145 1.443 1.249 2.14 3.277 1.522 4.075 1.164.127-.905.489-1.523.89-1.873-3.11-.354-6.38-1.555-6.38-6.921 0-1.529.546-2.778 1.442-3.757-.144-.354-.625-1.778.137-3.705 0 0 1.176-.376 3.852 1.436a13.415 13.415 0 013.507-.472c1.19.006 2.388.161 3.508.472 2.674-1.812 3.848-1.436 3.848-1.436.764 1.927.283 3.351.139 3.705.898.979 1.44 2.228 1.44 3.757 0 5.38-3.276 6.563-6.397 6.91.503.433.951 1.289.951 2.598 0 1.876-.017 3.389-.017 3.85 0 .375.253.811.963.673C25.993 27.43 30 22.184 30 16c0-7.732-6.268-14-14-14z"
    />
  </svg>
);
const VelogIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#20C997" />
    <path d="M9 11L16 23L23 11" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GlobeIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill="#EEF2FF" />
    <circle cx="16" cy="16" r="13.5" stroke="#6366F1" strokeWidth="1.5" />
    <ellipse cx="16" cy="16" rx="6.5" ry="13.5" stroke="#6366F1" strokeWidth="1.5" />
    <line x1="2.5" y1="16" x2="29.5" y2="16" stroke="#6366F1" strokeWidth="1.5" />
    <line x1="5.5" y1="9.5" x2="26.5" y2="9.5" stroke="#6366F1" strokeWidth="1.5" />
    <line x1="5.5" y1="22.5" x2="26.5" y2="22.5" stroke="#6366F1" strokeWidth="1.5" />
  </svg>
);
const YoutubeIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FF0000" />
    <path d="M13 10.5v11l9-5.5-9-5.5z" fill="white" />
  </svg>
);

// 히어로 문구 (랜딩 페이지와 동일)
export const DEFAULT_OG_TEXT = {
  badge: "개발자를 위한 멀티링크",
  titleLine1: "Development",
  titleLine2: "in ",
  titleHighlight: "One Link",
  description1: "흩어져 있는 개발 활동을 하나의 링크로.",
  description2: "나만의 마이페이지에서 모든 링크를 관리하세요.",
};

// 미리보기 카드 예시 (랜딩 페이지와 동일)
const PREVIEW = {
  username: "dev_kim",
  name: "김개발",
  links: [
    { icon: <GithubIcon size={30} />, title: "GitHub", clicks: 128 },
    { icon: <VelogIcon size={30} />, title: "개발 블로그", clicks: 86 },
    { icon: <GlobeIcon size={30} />, title: "포트폴리오", clicks: 42 },
  ],
};

// 기본 이미지에 쓰이는 모든 글자 (폰트 서브셋용)
export const DEFAULT_OG_GLYPHS =
  Object.values(DEFAULT_OG_TEXT).join("") +
  `mylink/${PREVIEW.username}${PREVIEW.name}@` +
  PREVIEW.links.map((l) => `${l.title}${l.clicks}`).join("");

// 배경에 은은하게 떠 있는 아이콘 (랜딩 히어로의 floating icons와 같은 구성, 투명도 40%)
const FLOATING = [
  { icon: <GithubIcon size={44} />, left: 40, top: 36 },
  { icon: <YoutubeIcon size={40} />, left: 1110, top: 40 },
  { icon: <VelogIcon size={36} />, left: 620, top: 50 },
  { icon: <GlobeIcon size={40} />, left: 60, top: 540 },
];

export function DefaultOgContent() {
  return (
    <OgBackground background={OG_COLORS.card}>
      {FLOATING.map(({ icon, left, top }, i) => (
        <div key={i} style={{ position: "absolute", left, top, display: "flex", opacity: 0.4 }}>
          {icon}
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 72, padding: "0 90px" }}>
        {/* 왼쪽: 히어로 텍스트 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: 560 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 9999,
              background: OG_COLORS.primaryWeak,
              color: OG_COLORS.primary,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <CodeIcon size={24} color={OG_COLORS.primary} />
            {DEFAULT_OG_TEXT.badge}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -3,
              color: OG_COLORS.text,
            }}
          >
            <span>{DEFAULT_OG_TEXT.titleLine1}</span>
            <span style={{ display: "flex" }}>
              {DEFAULT_OG_TEXT.titleLine2}
              <span style={{ color: OG_COLORS.primary, marginLeft: 22 }}>{DEFAULT_OG_TEXT.titleHighlight}</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.6,
              color: OG_COLORS.textSecondary,
            }}
          >
            <span>{DEFAULT_OG_TEXT.description1}</span>
            <span>{DEFAULT_OG_TEXT.description2}</span>
          </div>
        </div>

        {/* 오른쪽: 내 페이지 미리보기 카드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 400,
            padding: 26,
            borderRadius: 24,
            background: OG_COLORS.background,
            border: `2px solid ${OG_COLORS.border}`,
            boxShadow: "0 16px 40px rgba(25,31,40,0.08)",
          }}
        >
          {/* 주소 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: OG_COLORS.textTertiary }}>
            <div style={{ display: "flex", marginRight: 6 }}>
              <LockIcon size={16} color={OG_COLORS.textTertiary} />
            </div>
            mylink/
            <span style={{ fontWeight: 700, color: OG_COLORS.textSecondary }}>{PREVIEW.username}</span>
          </div>
          {/* 프로필 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: 9999,
                background: OG_COLORS.primaryWeak,
                border: "6px solid #FFFFFF",
              }}
            >
              <UserIcon size={38} color={OG_COLORS.primary} />
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 24, fontWeight: 700, color: OG_COLORS.text }}>{PREVIEW.name}</div>
            <div style={{ display: "flex", fontSize: 18, color: OG_COLORS.textTertiary }}>@{PREVIEW.username}</div>
          </div>
          {/* 링크 카드 + 클릭 수 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
            {PREVIEW.links.map((link) => (
              <div
                key={link.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 62,
                  padding: "0 20px",
                  background: OG_COLORS.card,
                  border: `2px solid ${OG_COLORS.border}`,
                  borderRadius: 3,
                }}
              >
                <div style={{ display: "flex", width: 44 }}>{link.icon}</div>
                <div style={{ display: "flex", flex: 1, fontSize: 21, fontWeight: 700, color: OG_COLORS.text }}>{link.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 18, color: OG_COLORS.textTertiary }}>
                  <ClickIcon size={18} color={OG_COLORS.textTertiary} />
                  {link.clicks}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OgBackground>
  );
}
