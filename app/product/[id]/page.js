import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, C, money } from "../../../lib/constants";
import { T, CATEGORY_LABELS, SUBCATEGORY_LABELS, PRODUCT_TYPE_LABELS } from "../../../lib/translations";
import { Gallery } from "../../../components/Gallery";
import { ProductActions, WishlistHeartButton } from "../../../components/ProductActions";
import { BackButton } from "../../../components/BackButton";
import { ProductCard } from "../../../components/ProductCard";

export const dynamic = "force-dynamic";

async function getProduct(id) {
  try {
    return await api(`/products/${id}`);
  } catch {
    return null;
  }
}

// This is the actual payoff of the whole SSR migration: a real, unique,
// crawlable <title> and description per product — the old SPA had no way
// to do this since every product lived at the same client-only URL.
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product not found — SADAAR" };
  return {
    title: `${product.name} by ${product.brand_name} — SADAAR`,
    description: product.description ? product.description.slice(0, 160) : `${product.name} from ${product.brand_name}, available on SADAAR.`,
    openGraph: {
      title: `${product.name} by ${product.brand_name}`,
      description: product.description || `${product.name} from ${product.brand_name}, available on SADAAR.`,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const cookieStore = cookies();
  const lang = cookieStore.get("sadaar_lang")?.value === "ar" ? "ar" : "en";
  const t = T[lang];
  const categoryLabel = (c) => CATEGORY_LABELS[lang][c] || c;
  const subcategoryLabel = (s) => SUBCATEGORY_LABELS[lang][s] || s;
  const productTypeLabel = (p) => PRODUCT_TYPE_LABELS[lang][p] || p;

  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await api(`/products?category=${encodeURIComponent(product.category)}`)
    .then((list) => list.filter((item) => item.id !== product.id).slice(0, 4))
    .catch(() => []);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <BackButton label={t.back} />
        <WishlistHeartButton productId={product.id} />
      </div>
      <div className="sadaar-product-layout" style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
        <div className="sadaar-product-image" style={{ flex: "1 1 380px" }}><Gallery product={product} /></div>
        <div style={{ flex: "1 1 320px" }}>
          <Link href={`/brand/${product.brand_slug}`} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: C.bronze, textDecoration: "underline", display: "inline-block" }}>{product.brand_name}</Link>
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: 30, color: C.ink, margin: "6px 0" }}>{product.name}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 12 }}>{categoryLabel(product.category)}{product.subcategory ? ` · ${subcategoryLabel(product.subcategory)}` : ""}{product.product_type ? ` · ${productTypeLabel(product.product_type)}` : ""}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: C.char, marginBottom: 20 }}>{money(product.price)}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>{product.description}</p>

          <ProductActions product={product} />

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginTop: 16, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>{t.shippedBy(product.brand_name)}</p>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 20, color: C.ink, marginBottom: 18 }}>{t.youMightAlsoLike}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px 20px" }}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
