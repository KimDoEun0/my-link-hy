import { ImageResponse } from "next/og";
import { getUserByUsername } from "@/lib/publicProfile";
import {
  DEFAULT_OG_GLYPHS,
  DefaultOgContent,
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgBackground,
  OgLinkIcon,
  OgLogo,
  loadImageAsDataUrl,
  loadOgFonts,
} from "@/lib/og";

// 공개 프로필(/{username})용 동적 OG 이미지
// - params.username으로 유저를 조회해 프로필 사진 · 이름 · 소개글을 담은 이미지를 생성
// - 유저가 없으면 기본 OG 이미지로 대체 (공유 미리보기가 깨지지 않도록)
// - Firebase Client SDK와의 호환성을 위해 Edge 대신 Node.js Runtime 사용
export const runtime = "nodejs";
export const alt = "MyLink 프로필";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const BIO_MAX_CHARS = 40; // 이미지에 표시할 소개글 최대 길이 (한 줄, 넘으면 … 처리)

type Props = { params: Promise<{ username: string }> };

export default async function Image({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  // 유저가 없으면 기본 이미지
  if (!user) {
    const fonts = await loadOgFonts(DEFAULT_OG_GLYPHS);
    return new ImageResponse(<DefaultOgContent />, { ...size, fonts });
  }

  const name = user.displayName || user.username || "MyLink";
  const handle = user.username ?? username;
  const rawBio = (user.bio ?? "").replace(/\s+/g, " ").trim();
  const bio = rawBio.length > BIO_MAX_CHARS ? `${rawBio.slice(0, BIO_MAX_CHARS)}…` : rawBio;
  const pageUrl = `mylink/${handle}`;

  const [photo, fonts] = await Promise.all([
    loadImageAsDataUrl(user.photoURL),
    loadOgFonts(`MyLink${name}@${handle}${bio}${pageUrl}`),
  ]);

  return new ImageResponse(
    (
      <OgBackground>
        {/* 상단 좌측 브랜드 로고 */}
        <div style={{ position: "absolute", top: 48, left: 56, display: "flex" }}>
          <OgLogo scale={0.8} />
        </div>

        {/* 중앙 프로필 (프로필 페이지와 같은 구성: 사진 → 이름 → @username → 소개) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 1000, marginBottom: 70 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 184,
              height: 184,
              borderRadius: 9999,
              border: "8px solid #FFFFFF",
              boxShadow: "0 12px 32px rgba(25,31,40,0.12)",
              background: OG_COLORS.primaryWeak,
              overflow: "hidden",
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" width={168} height={168} style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", fontSize: 80, fontWeight: 700, color: OG_COLORS.primary }}>
                {name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 64,
              fontWeight: 700,
              color: OG_COLORS.text,
              letterSpacing: -2,
            }}
          >
            {name}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 14,
              padding: "6px 20px",
              borderRadius: 9999,
              background: OG_COLORS.primaryWeak,
              color: OG_COLORS.primary,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            @{handle}
          </div>

          {bio && (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 30,
                fontWeight: 400,
                color: OG_COLORS.textSecondary,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {bio}
            </div>
          )}
        </div>

        {/* 하단 주소 칩 */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 24px",
            borderRadius: 9999,
            background: OG_COLORS.card,
            border: `2px solid ${OG_COLORS.border}`,
            fontSize: 24,
            fontWeight: 700,
            color: OG_COLORS.text,
          }}
        >
          <OgLinkIcon size={24} color={OG_COLORS.primary} />
          {pageUrl}
        </div>
      </OgBackground>
    ),
    { ...size, fonts }
  );
}
