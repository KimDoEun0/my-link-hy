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
// - 왼쪽: 다크 네이비 배경 + 큰 흰 글씨 (이름 · @username · 소개), 하단에 페이지 주소
// - 오른쪽: 실제 화면 두 장을 나란히 배치 (겹침 없이 같은 높이에서 시작, 아래쪽은 이미지 밖으로 잘림)
//   1) 프로필 화면: 프로필 사진 · 이름 · 링크 카드(파비콘)
//   2) 요약 화면: 공유 중인 링크 수 · 파비콘 모음 · 가입 시기
// - 유저가 없으면 기본 OG 이미지로 대체 (공유 미리보기가 깨지지 않도록)
// - Firebase Client SDK와의 호환성을 위해 Edge 대신 Node.js Runtime 사용
export const runtime = "nodejs";
export const alt = "MyLink 프로필";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const MAX_CARD_LINKS = 4; // 프로필 화면에 보여줄 링크 수
const MAX_ICON_LINKS = 6; // 요약 화면에 보여줄 파비콘 수 (3개씩 2줄)

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
        title: clip(link.title ?? "", 14),
        icon: await loadImageAsDataUrl(faviconUrl(link.url)),
      }))
    );
    return { links, total: all.length };
  } catch {
    return { links: [], total: 0 };
  }
}

// 오른쪽 화면 카드 공통 스타일 (기본 이미지와 같은 위치 · 크기)
const screenCard = {
  position: "absolute",
  top: 96,
  height: 600,
  display: "flex",
  flexDirection: "column",
  background: OG_COLORS.white,
  borderRadius: 24,
} as const;

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
  const name = clip(fullName, 9);
  const cardName = clip(fullName, 10);
  const bio = clip(user.bio ?? "", 34) || `${clip(fullName, 10)}님의 링크 모음`;
  const nameSize = name.length <= 4 ? 104 : name.length <= 6 ? 80 : 56; // 이름 길이에 따라 글자 크기 조절 (왼쪽 영역 안에 한 줄)
  const pageUrl = `${SITE_HOST}/${handle}`;

  // 가입 시기 (예: 2026년 10월부터)
  const joined = user.createdAt?.toDate?.();
  const joinedText = joined ? `${joined.getFullYear()}년 ${joined.getMonth() + 1}월부터` : "";

  const [photo, { links, total }] = await Promise.all([loadImageAsDataUrl(user.photoURL), loadLinks(user.uid)]);
  const cardLinks = links.slice(0, MAX_CARD_LINKS);
  const iconLinks = links.slice(0, MAX_ICON_LINKS);
  const TEXT = { countLabel: "공유 중인 링크", countValue: `${total}개`, joinedLabel: "MyLink와 함께한 지" };
  const fonts = await loadOgFonts(
    `MyLink${name}${cardName}@${handle}${bio}${pageUrl}${joinedText}${Object.values(TEXT).join("")}${links.map((l) => l.title).join("")}`
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
            width: 580,
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
            <div style={{ display: "flex", marginTop: 12, fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
              @{handle}
            </div>
            <div style={{ display: "flex", marginTop: 22, fontSize: 25, lineHeight: 1.5, color: "rgba(255,255,255,0.6)" }}>{bio}</div>
          </div>
          {/* 페이지 주소 (기본 이미지의 사이트 주소와 같은 자리 · 색) */}
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: OG_COLORS.blue400 }}>{pageUrl}</div>
        </div>

        {/* 오른쪽 1: 프로필 화면 */}
        <div style={{ ...screenCard, left: 628, width: 300, alignItems: "center", padding: "30px 20px" }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" width={72} height={72} style={{ borderRadius: 9999, objectFit: "cover" }} />
          ) : (
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
              {fullName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div style={{ display: "flex", marginTop: 12, fontSize: 22, fontWeight: 700, color: OG_COLORS.grey900 }}>{cardName}</div>
          <div style={{ display: "flex", fontSize: 15, color: OG_COLORS.grey500 }}>@{handle}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 20 }}>
            {(cardLinks.length > 0 ? cardLinks : Array.from({ length: 4 }, () => null)).map((link, i) =>
              link ? (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 52,
                    padding: "0 14px",
                    border: `2px solid ${OG_COLORS.grey200}`,
                    borderRadius: 4,
                  }}
                >
                  <OgFavicon src={link.icon} size={22} />
                  <div style={{ display: "flex", marginLeft: 10, fontSize: 17, fontWeight: 700, color: OG_COLORS.grey900 }}>
                    {link.title}
                  </div>
                </div>
              ) : (
                // 링크가 없을 때: 빈 카드 자리
                <div key={i} style={{ display: "flex", height: 52, borderRadius: 4, background: OG_COLORS.grey100 }} />
              )
            )}
          </div>
        </div>

        {/* 오른쪽 2: 요약 화면 (링크 수 · 파비콘 모음 · 가입 시기) */}
        <div style={{ ...screenCard, left: 944, width: 196, padding: "28px 22px" }}>
          <div style={{ display: "flex", fontSize: 15, color: OG_COLORS.grey500 }}>{TEXT.countLabel}</div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: -1, color: OG_COLORS.grey900 }}>
            {TEXT.countValue}
          </div>
          {iconLinks.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
              {iconLinks.map((link, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: `2px solid ${OG_COLORS.grey200}`,
                  }}
                >
                  <OgFavicon src={link.icon} size={22} />
                </div>
              ))}
            </div>
          )}
          {joinedText && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 24, paddingTop: 18, borderTop: `2px solid ${OG_COLORS.grey100}` }}>
              <div style={{ display: "flex", fontSize: 14, color: OG_COLORS.grey500 }}>{TEXT.joinedLabel}</div>
              <div style={{ display: "flex", marginTop: 6, fontSize: 17, fontWeight: 700, color: OG_COLORS.grey900 }}>{joinedText}</div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
