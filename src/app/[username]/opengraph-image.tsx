import { ImageResponse } from "next/og";
import { getUserByUsername } from "@/lib/publicProfile";
import { getLinks } from "@/lib/linksFirestore";
import {
  DEFAULT_OG_GLYPHS,
  DefaultOgContent,
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFavicon,
  OgWordmark,
  SITE_HOST,
  clip,
  faviconUrl,
  loadDefaultOgFavicons,
  loadImageAsDataUrl,
  loadOgFonts,
} from "@/lib/og";

// 공개 프로필(/{username})용 동적 OG 이미지 — 기본 이미지와 같은 틀
// - 왼쪽: 다크 네이비 배경 + 큰 흰 글씨 (이름 · @username · 소개)
// - 오른쪽: 실제 프로필 페이지 화면(사진 · 이름 · 링크 카드 + 파비콘) + 링크 개수 카드를 겹쳐 배치
// - 유저가 없으면 기본 OG 이미지로 대체 (공유 미리보기가 깨지지 않도록)
// - Firebase Client SDK와의 호환성을 위해 Edge 대신 Node.js Runtime 사용
export const runtime = "nodejs";
export const alt = "MyLink 프로필";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const MAX_CARD_LINKS = 4; // 프로필 카드에 보여줄 링크 수
const MAX_ICON_LINKS = 5; // 링크 개수 카드에 보여줄 파비콘 수

type Props = { params: Promise<{ username: string }> };

type OgLink = { title: string; icon: string | null };

// 최신 링크를 제목 + 파비콘(data URL)으로 준비 (실패하면 빈 목록)
async function loadLinks(uid: string): Promise<{ links: OgLink[]; total: number }> {
  try {
    const snapshot = await getLinks(uid);
    const all = snapshot.docs
      .map((doc) => doc.data() as { title?: string; url?: string; isVisible?: boolean })
      .filter((link) => link.title && link.isVisible !== false);
    const links = await Promise.all(
      all.slice(0, Math.max(MAX_CARD_LINKS, MAX_ICON_LINKS)).map(async (link) => ({
        title: clip(link.title ?? "", 16),
        icon: await loadImageAsDataUrl(faviconUrl(link.url)),
      }))
    );
    return { links, total: all.length };
  } catch {
    return { links: [], total: 0 };
  }
}

export default async function Image({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  // 유저가 없으면 기본 이미지
  if (!user) {
    const [fonts, favicons] = await Promise.all([loadOgFonts(DEFAULT_OG_GLYPHS), loadDefaultOgFavicons()]);
    return new ImageResponse(<DefaultOgContent favicons={favicons} />, { ...size, fonts });
  }

  const handle = user.username ?? username;
  const fullName = (user.displayName || handle).trim();
  const name = clip(fullName, 10);
  const cardName = clip(fullName, 12);
  const bio = clip(user.bio ?? "", 36) || `${clip(fullName, 10)}님의 링크 모음`;
  const nameSize = name.length <= 5 ? 104 : name.length <= 8 ? 84 : 68; // 이름 길이에 따라 글자 크기 조절

  const [photo, { links, total }] = await Promise.all([loadImageAsDataUrl(user.photoURL), loadLinks(user.uid)]);
  const cardLinks = links.slice(0, MAX_CARD_LINKS);
  const iconLinks = links.slice(0, MAX_ICON_LINKS);
  const countLabel = "공유 중인 링크";
  const countValue = `${total}개`;
  const footer = `개발자를 위한 멀티링크 · ${SITE_HOST}/${handle}`;
  const fonts = await loadOgFonts(
    `MyLink${name}${cardName}@${handle}${bio}${countLabel}${countValue}${footer}${links.map((l) => l.title).join("")}`
  );

  return new ImageResponse(
    (
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
            width: 600,
            padding: "72px 0 72px 88px",
          }}
        >
          <OgWordmark color={OG_COLORS.white} size={34} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: nameSize,
                fontWeight: 800,
                letterSpacing: -4,
                lineHeight: 1.1,
                color: OG_COLORS.white,
              }}
            >
              {name}
            </div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 30, fontWeight: 700, color: OG_COLORS.blue400 }}>
              @{handle}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 28, lineHeight: 1.5, color: "rgba(255,255,255,0.75)", maxWidth: 480 }}>
              {bio}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.5)" }}>{footer}</div>
        </div>

        {/* 오른쪽 1: 실제 프로필 페이지 화면 (아래쪽은 이미지 밖으로 잘림) */}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 96,
            width: 360,
            height: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 24px",
            background: OG_COLORS.white,
            borderRadius: 32,
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" width={88} height={88} style={{ borderRadius: 9999, objectFit: "cover" }} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 88,
                height: 88,
                borderRadius: 9999,
                background: OG_COLORS.blue50,
                color: OG_COLORS.blue500,
                fontSize: 38,
                fontWeight: 800,
              }}
            >
              {fullName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div style={{ display: "flex", marginTop: 14, fontSize: 24, fontWeight: 700, color: OG_COLORS.grey900 }}>{cardName}</div>
          <div style={{ display: "flex", fontSize: 16, color: OG_COLORS.grey500 }}>@{handle}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 22 }}>
            {(cardLinks.length > 0 ? cardLinks : Array.from({ length: 4 }, () => null)).map((link, i) =>
              link ? (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 56,
                    padding: "0 16px",
                    border: `2px solid ${OG_COLORS.grey200}`,
                    borderRadius: 4,
                  }}
                >
                  <OgFavicon src={link.icon} size={24} />
                  <div style={{ display: "flex", marginLeft: 12, fontSize: 18, fontWeight: 700, color: OG_COLORS.grey900 }}>
                    {link.title}
                  </div>
                </div>
              ) : (
                // 링크가 없을 때: 빈 카드 자리
                <div key={i} style={{ display: "flex", height: 56, borderRadius: 4, background: OG_COLORS.grey100 }} />
              )
            )}
          </div>
        </div>

        {/* 오른쪽 2: 링크 개수 카드 (기본 이미지의 통계 카드 자리) */}
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 56,
            width: 240,
            display: "flex",
            flexDirection: "column",
            padding: "22px 24px",
            background: OG_COLORS.white,
            borderRadius: 24,
            boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", fontSize: 16, color: OG_COLORS.grey500 }}>{countLabel}</div>
          <div style={{ display: "flex", marginTop: 2, fontSize: 40, fontWeight: 800, letterSpacing: -1.5, color: OG_COLORS.grey900 }}>
            {countValue}
          </div>
          {iconLinks.length > 0 && (
            <div style={{ display: "flex", marginTop: 14 }}>
              {iconLinks.map((link, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    marginLeft: i === 0 ? 0 : -8,
                    borderRadius: 9999,
                    background: OG_COLORS.white,
                    border: `2px solid ${OG_COLORS.grey200}`,
                  }}
                >
                  <OgFavicon src={link.icon} size={20} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
