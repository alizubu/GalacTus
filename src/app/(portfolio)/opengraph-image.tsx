import { ImageResponse } from "next/og";
import { DATA } from "@/data/resume";

export const runtime = "edge";

export const alt = DATA.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const getFontData = async () => {
  try {
    const [cabinetGrotesk, clashDisplay] = await Promise.all([
      fetch(new URL("../../../public/fonts/CabinetGrotesk-Medium.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
      fetch(new URL("../../../public/fonts/ClashDisplay-Semibold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
    ]);
    return { cabinetGrotesk, clashDisplay };
  } catch {
    return null;
  }
};

const styles = {
  outerWrapper: { height: "100%", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", position: "relative" },
  middleWrapper: { height: "100%", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#ffffff", position: "relative", padding: "40px" },
  wrapper: { height: "100%", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa", position: "relative", padding: "40px", border: "1px solid #e5e5e5", borderRadius: "12px" },
  imageSection: { position: "absolute", top: "40px", left: "40px", display: "flex", alignItems: "center", zIndex: "2" },
  mainContainer: { display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", height: "100%", width: "100%", position: "relative", zIndex: "1" },
  image: { width: "140px", height: "140px", borderRadius: "24px", border: "4px solid #e5e5e5", objectFit: "cover" },
  title: { fontFamily: "Clash Display", fontSize: "48px", fontWeight: "600", lineHeight: "1.1", textAlign: "left", color: "#000000", marginBottom: "16px", letterSpacing: "-0.02em", maxWidth: "900px" },
  description: { fontSize: "20px", fontWeight: "400", lineHeight: "1.5", textAlign: "left", maxWidth: "800px", color: "#404040", marginBottom: "32px", textWrap: "balance" },
} as const;

export default async function Image() {
  try {
    const fontData = await getFontData();

    // [M11] Fetch hero data from DB instead of hardcoded DATA
    let heroName = DATA.name;
    let heroDescription = DATA.description;
    let heroAvatarUrl = DATA.avatarUrl;
    let siteUrl = DATA.url;

    try {
      // Edge runtime: use fetch to hit our own content API would require full URL.
      // Instead import db directly — Prisma Edge is not available, so we use a
      // raw fetch to the internal API or fall back gracefully.
      const baseUrl = process.env.NEXTAUTH_URL ?? "https://www.shelveyswork.com";
      const res = await fetch(`${baseUrl}/api/navbar`, { next: { revalidate: 60 } });
      // The above is just the public navbar route — instead we read content from DB
      // by importing the data helper. Edge runtime can't use Prisma, so we fetch
      // from the internal content endpoint.
      const contentRes = await fetch(`${baseUrl}/api/admin/content`);
      if (contentRes.ok) {
        const data = await contentRes.json();
        if (data.hero_name) heroName = data.hero_name;
        if (data.hero_tagline) heroDescription = data.hero_tagline;
        if (data.hero_avatar_url) heroAvatarUrl = data.hero_avatar_url;
        if (data.site_url) siteUrl = data.site_url;
      }
    } catch {
      // Fall back to static DATA — acceptable for OG image
    }

    const imageUrl = heroAvatarUrl?.startsWith("http")
      ? heroAvatarUrl
      : heroAvatarUrl
      ? new URL(heroAvatarUrl, siteUrl).toString()
      : undefined;

    return new ImageResponse(
      (
        <div style={styles.outerWrapper}>
          <div style={styles.middleWrapper}>
            <div style={styles.wrapper}>
              {imageUrl && (
                <div style={styles.imageSection}>
                  <img src={imageUrl} alt={heroName} style={styles.image} />
                </div>
              )}
              <div style={styles.mainContainer}>
                <div style={styles.title}>{heroName}</div>
                {heroDescription && <div style={styles.description}>{heroDescription}</div>}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [
              { name: "Cabinet Grotesk", data: fontData.cabinetGrotesk, weight: 400, style: "normal" },
              { name: "Cabinet Grotesk", data: fontData.cabinetGrotesk, weight: 700, style: "normal" },
              { name: "Clash Display",   data: fontData.clashDisplay,   weight: 600, style: "normal" },
            ]
          : undefined,
      }
    );
  } catch (error) {
    console.error("OG image error:", error);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
