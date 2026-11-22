import Link from "next/link";
import { C, SUBCATEGORIES_BY_CATEGORY, catTone } from "../lib/constants";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS, T } from "../lib/translations";
import { CATEGORY_LANDING, brandMatchesCategory } from "../lib/categoryLanding";

const eyebrow = { fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bronze, margin: 0 };
const h2 = { fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500, color: C.ink, margin: "0 0 18px" };

// A category's "second home page": a hero, big tiles into each subcategory,
// paid Sponsored brand cards, and the brands that sell in it. The product
// list only appears once a shopper picks a subcategory.
export function CategoryLanding({ cat, lang, spotlights, brands }) {
  const t = T[lang];
  const content = CATEGORY_LANDING[cat];
  const copy = content[lang];
  const catLabel = CATEGORY_LABELS[lang][cat] || cat;
  const subcats = SUBCATEGORIES_BY_CATEGORY[cat] || [];
  const tone = catTone[cat] || catTone.Men;

  // Only brands that paid for this category's own space.
  const sponsored = (spotlights || []).filter((s) => s.placement === cat);
  const catBrands = (brands || []).filter((b) => brandMatchesCategory(b.category, cat));
  const firstSub = subcats[0];

  return (
    <div>
      <section style={{ position: "relative", minHeight: "clamp(300px, 48vh, 460px)", overflow: "hidden", background: content.image ? C.ink : `linear-gradient(135deg, ${C.deep} 0%, ${C.ink} 100%)` }}>
        {content.image && <img src={content.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,40,46,0.2) 0%, rgba(20,40,46,0.65) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, minHeight: "inherit", maxWidth: 1180, margin: "0 auto", padding: "56px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p style={eyebrow}>{catLabel}</p>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(32px, 5.5vw, 56px)", lineHeight: 1.08, color: C.warm, margin: "12px 0 0" }}>{copy.title}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#E7E2D3", marginTop: 16, maxWidth: 460, lineHeight: 1.6 }}>{copy.sub}</p>
          {firstSub && (
            <Link href={`/browse?cat=${cat}&subcat=${encodeURIComponent(firstSub)}`} style={{ marginTop: 26, background: C.warm, color: C.ink, padding: "12px 26px", fontFamily: "Inter, sans-serif", fontSize: 14, textDecoration: "none", width: "fit-content" }}>
              {t.landingShop} {SUBCATEGORY_LABELS[lang][firstSub] || firstSub}
            </Link>
          )}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 8px" }}>
        <h2 style={h2}>{t.landingShopBy}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {subcats.map((s) => {
            const img = content.tiles[s];
            return (
              <Link key={s} href={`/browse?cat=${cat}&subcat=${encodeURIComponent(s)}`} className="sadaar-card-hover" style={{ position: "relative", display: "flex", alignItems: "flex-end", minHeight: 200, padding: 20, background: tone.bg, color: tone.fg, textDecoration: "none", overflow: "hidden" }}>
                {img && <img src={img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
                {img && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,40,46,0) 40%, rgba(20,40,46,0.6) 100%)" }} />}
                <div style={{ position: "relative", color: img ? C.warm : tone.fg }}>
                  <p style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: 0 }}>{SUBCATEGORY_LABELS[lang][s] || s}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, margin: "6px 0 0", opacity: 0.8 }}>{t.landingExplore} →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {sponsored.length > 0 && (
        <section style={{ maxWidth: "none", margin: "0 auto", padding: "36px 24px 8px" }}>
          <h2 style={h2}>{t.landingSponsored}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            {sponsored.map((s) => (
              <Link key={s.id} href={`/brand/${s.brand_slug}`} style={{ background: s.image_url ? `linear-gradient(to top, rgba(20,24,25,0.85), rgba(20,24,25,0.15)), url(${s.image_url}) center/cover` : C.deep, color: C.sand, padding: 20, textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: s.image_url ? "flex-end" : "flex-start", height: s.image_url ? "max(420px, calc(100vh - 140px))" : "auto" }}>
                <p style={{ ...eyebrow, fontSize: 10 }}>{t.landingSponsoredTag}</p>
                <p style={{ fontFamily: "Fraunces, serif", fontSize: 19, margin: "8px 0 6px" }}>{s.brand_name}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#C5CDCE", margin: 0, lineHeight: 1.5 }}>{s.brand_description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {catBrands.length > 0 && (
        <section style={{ maxWidth: 1180, margin: "0 auto", padding: "36px 24px 64px" }}>
          <h2 style={h2}>{t.landingBrands}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {catBrands.map((b) => (
              <Link key={b.id} href={`/brand/${b.slug}`} style={{ border: `1px solid ${C.line}`, padding: "10px 18px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.ink, textDecoration: "none", background: C.warm }}>
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}
      {catBrands.length === 0 && <div style={{ height: 56 }} />}
    </div>
  );
}
