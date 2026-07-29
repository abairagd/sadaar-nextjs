import { cookies } from "next/headers";
import Link from "next/link";
import { api, C } from "../../lib/constants";
import { T } from "../../lib/translations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Brands — SADAAR",
  description: "Browse every independent Saudi fashion brand curated on SADAAR.",
};

export default async function BrandsPage() {
  const cookieStore = cookies();
  const lang = cookieStore.get("sadaar_lang")?.value === "ar" ? "ar" : "en";
  const t = T[lang];

  const brands = await api("/brands").catch(() => []);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 24 }}>{t.allBrands}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {brands.map((b) => (
          <div key={b.id} style={{ border: `1px solid ${C.line}`, padding: 20, background: C.warm }}>
            <p style={{ margin: 0, fontFamily: "Fraunces, serif", fontSize: 18, color: C.ink }}>{b.name}</p>
            <p style={{ margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>{b.description}</p>
            <Link href={`/brand/${b.slug}`} style={{ marginTop: 14, background: "none", border: `1px solid ${C.ink}`, padding: "8px 14px", fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer", textDecoration: "none", color: C.ink, display: "inline-block" }}>{t.shopBrand(b.name)}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
