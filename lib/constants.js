// Shared foundation used by every page — colors, fonts, taxonomy, and small
// helpers. This has no "use client" directive and no React hooks, so it works
// identically whether imported from a Server Component or a Client Component.

export const API_BASE = "https://sadaar-backend-production.up.railway.app/api";

export const C = {
  ink: "#14282E",
  deep: "#1A3B40",
  sand: "#F3ECDD",
  warm: "#FBF8F1",
  bronze: "#B08D57",
  char: "#22201B",
  line: "#DCD2BB",
  muted: "#7A7566",
  danger: "#A3402F",
};

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap');

* { box-sizing: border-box; }
body { overflow-x: hidden; }

.sadaar-rtl, .sadaar-rtl * { font-family: 'Tajawal', sans-serif !important; }

button { transition: opacity 0.15s ease, transform 0.15s ease, background-color 0.15s ease, border-color 0.15s ease; }
button:hover:not(:disabled) { opacity: 0.85; }
a:hover { opacity: 0.85; }
.sadaar-card-hover { transition: transform 0.2s ease; }
.sadaar-card-hover:hover { transform: translateY(-3px); }

@media (max-width: 680px) {
  .sadaar-header-row { flex-wrap: wrap !important; }
  .sadaar-header-row { padding-top: 12px !important; padding-bottom: 10px !important; row-gap: 8px !important; }
  .sadaar-header-left { display: contents !important; }
  .sadaar-top-nav { order: 3; flex: 0 0 100% !important; width: 100% !important; gap: 14px !important; overflow-x: auto !important; flex-wrap: nowrap !important; padding-top: 0 !important; }
  .sadaar-hero { height: clamp(320px, 55vh, 460px) !important; }
  .sadaar-hero > div { padding-left: 16px !important; padding-right: 16px !important; }
  .sadaar-browse-layout { flex-direction: column !important; padding-left: 16px !important; padding-right: 16px !important; }
  .sadaar-browse-sidebar { width: 100% !important; }
  .sadaar-browse-filters { display: flex !important; flex-wrap: wrap !important; gap: 16px 24px !important; margin-bottom: 20px !important; }
  .sadaar-browse-filters > div { margin-bottom: 0 !important; }
  .sadaar-product-layout { flex-direction: column !important; gap: 24px !important; padding-left: 16px !important; padding-right: 16px !important; }
  .sadaar-product-image { flex: 1 1 100% !important; }
  .sadaar-cart-row { flex-wrap: wrap !important; }
  .sadaar-section { padding-left: 16px !important; padding-right: 16px !important; }
}
`;

export const CATEGORIES = ["Men", "Women"];

// Subcategories are intentionally just a plain object here (not stored/enforced
// on the backend) — adding a new one later is just adding a string to this list.
// Shoes and Accessories are reused as subcategory names under both Men and
// Women — the (category, subcategory) pair together disambiguates them, so
// "Women > Shoes" and "Men > Shoes" filter correctly as separate groups.
export const SUBCATEGORIES_BY_CATEGORY = {
  Men: ["Clothing", "Shoes", "Accessories", "Jewelry"],
  Women: ["Clothing", "Shoes", "Accessories", "Jewelry"],
};

// Product types are nested by category first, then subcategory — this is
// what keeps women's-only items (Bikini, Abayas, Dresses) from ever showing
// up as options under Men, and vice versa, even though "Clothing" is a
// shared subcategory name for both.
export const PRODUCT_TYPES_BY_CATEGORY = {
  Men: {
    Clothing: ["T-Shirts", "Button-Up Shirts", "Polo Shirts", "Sweatshirts", "Hoodies", "Jeans", "Cargo Pants", "Chinos", "Joggers", "Shorts", "Bomber Jackets", "Swim Trunks", "Classic Thobe", "Modern Thobe"],
    Shoes: ["Sneakers", "Sandals", "Boots", "Loafers"],
    Accessories: ["Bags", "Belts", "Watches", "Sunglasses"],
    Jewelry: ["Necklaces", "Rings", "Bracelets"],
  },
  Women: {
    Clothing: ["T-Shirts", "Sweatshirts", "Hoodies", "Jeans", "Cargo Pants", "Chinos", "Joggers", "Shorts", "Swim Shorts", "One-Piece", "Bikini", "Classic Abaya", "Embroidered Abaya", "Kimono Abaya", "Maxi Dress", "Midi Dress", "Evening Dress"],
    Shoes: ["Sneakers", "Sandals", "Boots", "Heels", "Loafers"],
    Accessories: ["Bags", "Belts", "Watches", "Sunglasses"],
    Jewelry: ["Necklaces", "Rings", "Bracelets", "Earrings"],
  },
};

export const catTone = {
  Men: { bg: C.sand, fg: C.ink },
  Women: { bg: "#EDE3D0", fg: C.deep },
};

export function money(n) {
  return `SAR ${Number(n).toLocaleString()}`;
}

// Mirrors the backend's per-brand shipping calculation (src/controllers/ordersController.js)
// so the customer sees an accurate estimate before checkout. The backend always
// recomputes this authoritatively at order time — this is display-only.
export const SHIPPING_FEE_PER_BRAND = 25;
export const FREE_SHIPPING_THRESHOLD = 300;

export function estimateShipping(items) {
  const brandSubtotals = {};
  for (const item of items) {
    const brandId = item.product.brand_id;
    brandSubtotals[brandId] = (brandSubtotals[brandId] || 0) + item.product.price * item.qty;
  }
  return Object.values(brandSubtotals).reduce(
    (s, brandSubtotal) => s + (brandSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE_PER_BRAND),
    0
  );
}

export const inputStyle = { border: `1px solid ${C.line}`, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, background: C.warm, color: C.char };

// Plain fetch wrapper — safe to call from Server Components (during SSR) or
// Client Components (in the browser). Never touches window/localStorage itself.
export async function api(path, options = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    // Server-side fetches during SSR shouldn't be cached indefinitely by
    // Next.js's default fetch cache — product/brand data changes often.
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// Social / contact links. An empty value hides its footer icon.
export const SOCIAL = {
  instagram: "",
  tiktok: "",
  snapchat: "",
  x: "",
  whatsapp: "https://wa.me/966555226474", // e.g. https://wa.me/9665XXXXXXXX
};
