"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { C, CATEGORIES, SUBCATEGORIES_BY_CATEGORY, PRODUCT_TYPES_BY_CATEGORY } from "../lib/constants";
import { useLang } from "../lib/LangContext";
import { useCustomerAuth } from "../lib/CustomerAuthContext";
import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";

const boldNavBtn = { background: "none", border: "none", cursor: "pointer", color: C.char, padding: "6px 14px", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.01em", outline: "none", borderRadius: 3, textDecoration: "none", display: "inline-block" };
const activeNavBtn = { ...boldNavBtn, background: C.ink, color: C.warm };

export function Header() {
  const { t, lang, toggleLang, categoryLabel, subcategoryLabel, productTypeLabel } = useLang();
  const { customerToken } = useCustomerAuth();
  const { wishlistIds } = useWishlist();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hoveredSubcat, setHoveredSubcat] = useState(null);

  const isHomeActive = pathname === "/";
  const isBrandsActive = pathname === "/brands";
  const activeCat = pathname === "/browse" ? searchParams.get("cat") : null;
  const activeSubcat = pathname === "/browse" ? searchParams.get("subcat") : null;
  const subcatsForActiveCat = activeCat && SUBCATEGORIES_BY_CATEGORY[activeCat] ? SUBCATEGORIES_BY_CATEGORY[activeCat] : null;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: C.warm, borderBottom: `1px solid ${C.line}` }}>
      <div className="sadaar-header-row" style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div className="sadaar-header-left" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "start", textDecoration: "none", display: "block" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 26, letterSpacing: "0.04em", color: C.ink }}>SADAAR</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.bronze, marginTop: -2 }}>{t.tagline}</div>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }} className="sadaar-top-nav">
            <Link href="/" style={isHomeActive ? activeNavBtn : boldNavBtn}>{t.home}</Link>
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/browse?cat=${c}`} style={activeCat === c ? activeNavBtn : boldNavBtn}>{categoryLabel(c)}</Link>
            ))}
            <Link href="/brands" style={isBrandsActive ? activeNavBtn : boldNavBtn}>{t.brandsNav}</Link>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={toggleLang} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 3, padding: "4px 9px", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.char }}>
            {lang === "en" ? "ع" : "EN"}
          </button>
          <Link href="/browse" style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} aria-label="Search"><Search size={19} color={C.ink} /></Link>
          <Link href="/account" style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex" }} aria-label="Account">
            <User size={19} color={C.ink} />
            {customerToken && (
              <span style={{ position: "absolute", top: -2, insetInlineEnd: -2, background: "#2F5B3C", width: 8, height: 8, borderRadius: "50%" }} />
            )}
          </Link>
          <Link href="/wishlist" style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex" }} aria-label="Wishlist">
            <Heart size={19} color={C.ink} />
            {wishlistIds.length > 0 && (
              <span style={{ position: "absolute", top: -6, insetInlineEnd: -8, background: C.ink, color: C.warm, fontSize: 10, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{wishlistIds.length}</span>
            )}
          </Link>
          <Link href="/cart" style={{ background: "none", border: "none", cursor: "pointer", position: "relative", display: "flex" }} aria-label="Cart">
            <ShoppingBag size={19} color={C.ink} />
            {cart.length > 0 && (
              <span style={{ position: "absolute", top: -6, insetInlineEnd: -8, background: C.ink, color: C.warm, fontSize: 10, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>
            )}
          </Link>
        </div>
      </div>

      {subcatsForActiveCat && (
        <div style={{ borderTop: `1px solid ${C.line}` }}>
          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {subcatsForActiveCat.map((s) => (
              <div key={s} onMouseEnter={() => setHoveredSubcat(s)} onMouseLeave={() => setHoveredSubcat(null)} style={{ position: "relative" }}>
                <Link
                  href={`/browse?cat=${activeCat}&subcat=${s}`}
                  style={{ background: "none", border: "none", cursor: "pointer", outline: "none", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: activeSubcat === s ? 700 : 400, color: activeSubcat === s ? C.ink : C.muted, padding: "2px 0", textDecoration: "none" }}
                >
                  {subcategoryLabel(s)}
                </Link>
                {hoveredSubcat === s && ((PRODUCT_TYPES_BY_CATEGORY[activeCat] && PRODUCT_TYPES_BY_CATEGORY[activeCat][s]) || []).length > 0 && (
                  <div style={{ position: "absolute", top: "100%", insetInlineStart: 0, paddingTop: 10, zIndex: 30 }}>
                    <div style={{ background: C.warm, border: `1px solid ${C.line}`, boxShadow: "0 8px 20px rgba(0,0,0,0.08)", minWidth: 200, maxHeight: 320, overflowY: "auto", padding: "10px 0" }}>
                      {PRODUCT_TYPES_BY_CATEGORY[activeCat][s].map((pt) => (
                        <button
                          key={pt}
                          onClick={() => { setHoveredSubcat(null); router.push(`/browse?cat=${activeCat}&subcat=${s}&ptype=${encodeURIComponent(pt)}`); }}
                          style={{ display: "block", width: "100%", textAlign: "start", background: "none", border: "none", cursor: "pointer", padding: "8px 18px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char, outline: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = C.sand)}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          {productTypeLabel(pt)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
