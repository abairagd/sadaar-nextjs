import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaInstagram, FaTiktok, FaSnapchat, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { Globe } from "lucide-react";
import { api, C, money } from "../../../lib/constants";
import { T } from "../../../lib/translations";
import { ProductCard } from "../../../components/ProductCard";
import { Swatch } from "../../../components/Swatch";
import { TabToggle } from "../../../components/TabToggle";

export const dynamic = "force-dynamic";

async function getBrand(slug) {
  try {
    return await api(`/brands/${slug}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const brand = await getBrand(params.slug);
  if (!brand) return { title: "Brand not found — SADAAR" };
  return {
    title: `${brand.name} — SADAAR`,
    description: brand.description ? brand.description.slice(0, 160) : `Shop ${brand.name} on SADAAR.`,
  };
}

export default async function BrandPage({ params }) {
  const cookieStore = cookies();
  const lang = cookieStore.get("sadaar_lang")?.value === "ar" ? "ar" : "en";
  const t = T[lang];

  const brand = await getBrand(params.slug);
  if (!brand) notFound();

  const products = await api(`/products?brandId=${brand.id}`).catch(() => []);

  const socialLinks = [
    { url: brand.instagram_url, Icon: FaInstagram, label: "Instagram" },
    { url: brand.tiktok_url, Icon: FaTiktok, label: "TikTok" },
    { url: brand.snapchat_url, Icon: FaSnapchat, label: "Snapchat" },
    { url: brand.x_url, Icon: FaXTwitter, label: "X" },
    { url: brand.whatsapp_url, Icon: FaWhatsapp, label: "WhatsApp" },
  ].filter((s) => s.url);

  const shopContent = (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 64px" }}>
      {products.length === 0 ? (
        <p style={{ fontFamily: "Inter, sans-serif", color: C.muted }}>No products yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "28px 20px" }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );

  const aboutContent = (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 64px" }}>
      {brand.founder_story && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.bronze, marginBottom: 10 }}>{t.founderStory}</p>
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 18, color: C.ink, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{brand.founder_story}</p>
        </div>
      )}
      {brand.brand_philosophy && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.bronze, marginBottom: 10 }}>{t.brandPhilosophy}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: C.char, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{brand.brand_philosophy}</p>
        </div>
      )}
      {brand.signatureProducts && brand.signatureProducts.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.bronze, marginBottom: 14 }}>{t.signatureProducts}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {brand.signatureProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none", display: "block" }}>
                <Swatch product={p} height={140} />
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.ink, marginTop: 8 }}>{p.name}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, margin: "2px 0 0" }}>{money(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      {(socialLinks.length > 0 || brand.website_url) && (
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.bronze, marginBottom: 12 }}>{t.followUs}</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            {socialLinks.map(({ url, Icon, label }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ color: C.ink, display: "flex" }}><Icon size={20} /></a>
            ))}
            {brand.website_url && (
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer" style={{ color: C.ink, display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 13, textDecoration: "none" }}>
                <Globe size={18} /> {t.visitWebsite}
              </a>
            )}
          </div>
        </div>
      )}
      {!brand.founder_story && !brand.brand_philosophy && (!brand.signatureProducts || brand.signatureProducts.length === 0) && socialLinks.length === 0 && !brand.website_url && (
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.muted }}>This brand hasn't added their story yet.</p>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ background: C.deep, color: C.sand, padding: "48px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: "clamp(28px, 4vw, 40px)", margin: 0 }}>{brand.name}</h1>
          {brand.origin_city && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#C5CDCE", marginTop: 8 }}>{t.basedIn(brand.origin_city)}</p>}
          {brand.description && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#C5CDCE", marginTop: 12, maxWidth: 560, lineHeight: 1.6 }}>{brand.description}</p>}
        </div>
      </div>
      <TabToggle tabALabel={t.shopTab} tabBLabel={t.aboutTab} tabAContent={shopContent} tabBContent={aboutContent} />
    </div>
  );
}
