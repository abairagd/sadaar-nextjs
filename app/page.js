import { cookies } from "next/headers";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { api, C } from "../lib/constants";
import { T } from "../lib/translations";
import { ProductCard } from "../components/ProductCard";

// Re-fetch on every request rather than caching a stale product list —
// matches the old SPA's always-fresh behavior.
export const dynamic = "force-dynamic";

async function getHomeData() {
  const [brands, products, spotlights] = await Promise.all([
    api("/brands").catch(() => []),
    api("/products").catch(() => []),
    api("/spotlight/active").catch(() => []),
  ]);
  return { brands, products, spotlights };
}

export default async function HomePage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("sadaar_lang")?.value === "ar" ? "ar" : "en";
  const t = T[lang];

  const { brands, products, spotlights: allSpotlights } = await getHomeData();
  // Only brands that paid for the homepage space appear here.
  const spotlights = allSpotlights.filter((s) => (s.placement || "Home") === "Home");
  const featured = products.slice(0, 8);

  return (
    <div>
      <section className="sadaar-hero" style={{ position: "relative", height: "clamp(420px, 70vh, 640px)", overflow: "hidden", marginBottom: 8 }}>
        <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="https://zqkxqzzakahnewjjlufa.supabase.co/storage/v1/object/public/site-assets/fashion%20add.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,40,46,0.25) 0%, rgba(20,40,46,0.6) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, height: "100%", maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bronze, marginBottom: 14 }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(34px, 6vw, 64px)", lineHeight: 1.05, color: C.warm, margin: 0 }}>{t.heroTitle1}<br />{t.heroTitle2}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#E7E2D3", marginTop: 20, maxWidth: 420, lineHeight: 1.6 }}>{t.heroSubtitle}</p>
          <Link href="/browse" style={{ marginTop: 28, background: C.warm, color: C.ink, border: "none", padding: "13px 28px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", width: "fit-content", textDecoration: "none", display: "inline-block" }}>{t.shopTheEdit}</Link>
        </div>
      </section>

      {spotlights.length > 0 && (
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Sparkles size={16} color={C.bronze} />
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 20, color: C.ink, margin: 0 }}>{t.spotlight}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 750px))", gap: 16 }}>
            {spotlights.map((s) => (
              <Link key={s.id} href={`/brand/${s.brand_slug}`} style={{ textAlign: "left", background: s.image_url ? `linear-gradient(to top, rgba(20,24,25,0.85), rgba(20,24,25,0.15)), url(${s.image_url}) center/cover` : C.deep, color: C.sand, border: "none", padding: 20, cursor: "pointer", textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: s.image_url ? "flex-end" : "flex-start", aspectRatio: s.image_url ? "750 / 430" : "auto" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bronze, margin: 0 }}>{t.spotlight}</p>
                <p style={{ fontFamily: "Fraunces, serif", fontSize: 18, margin: "6px 0" }}>{s.brand_name}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#C5CDCE", margin: 0 }}>{s.brand_description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 24px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: C.ink, margin: 0 }}>{t.curatedBrands}</h2>
          <Link href="/brands" style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.bronze, cursor: "pointer", textDecoration: "none" }}>{t.viewAll}</Link>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
          {brands.map((b) => (
            <div key={b.id} style={{ minWidth: 220, border: `1px solid ${C.line}`, padding: 18, background: C.warm }}>
              <p style={{ margin: 0, fontFamily: "Fraunces, serif", fontSize: 17, color: C.ink }}>{b.name}</p>
              <p style={{ margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted }}>{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "56px 24px 8px", textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bronze, marginBottom: 14 }}>{t.ourStory}</p>
        <h2 style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(22px, 3vw, 30px)", color: C.ink, lineHeight: 1.4, margin: "0 auto", maxWidth: 720 }}>
          {t.ourStoryText}
        </h2>
      </section>

      <section style={{ maxWidth: 1180, margin: "48px auto 0", padding: "36px 24px", background: C.deep, color: C.sand, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 20, margin: 0 }}>{t.joinQuestion}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#C5CDCE", marginTop: 6 }}>{t.joinSubtext}</p>
        </div>
        <a href="https://sadaar-apply-brand.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ background: C.sand, color: C.ink, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
          {t.applyToSell}
        </a>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px 8px" }}>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: C.ink, marginBottom: 18 }}>{t.thisWeeksEdit}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "28px 20px" }}>
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
