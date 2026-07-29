"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { C, SUBCATEGORIES_BY_CATEGORY, PRODUCT_TYPES_BY_CATEGORY } from "../lib/constants";
import { useLang } from "../lib/LangContext";

function useBrowseParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "" || value === undefined) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/browse?${params.toString()}`);
  };
  return { searchParams, updateParams, router };
}

export function BrowseSidebar({ brands }) {
  const { searchParams, updateParams, router } = useBrowseParams();
  const { t, categoryLabel, subcategoryLabel, productTypeLabel } = useLang();

  const cat = searchParams.get("cat") || "all";
  const subcat = searchParams.get("subcat") || "all";
  const ptype = searchParams.get("ptype") || "all";
  const brand = searchParams.get("brand") || "all";

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const handle = setTimeout(() => updateParams({ search, minPrice, maxPrice }), 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minPrice, maxPrice]);

  const activeFilterCount = [
    cat !== "all", subcat !== "all", ptype !== "all", brand !== "all", search.trim(), minPrice, maxPrice,
  ].filter(Boolean).length;

  return (
    <aside className="sadaar-browse-sidebar" style={{ width: 200, flexShrink: 0 }}>
      <div className="sadaar-browse-filters">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          style={{ width: "100%", border: `1px solid ${C.line}`, padding: "8px 10px", fontFamily: "Inter, sans-serif", fontSize: 13, background: C.warm, color: C.char, marginBottom: 20, boxSizing: "border-box" }}
        />

        {cat !== "all" && (SUBCATEGORIES_BY_CATEGORY[cat] || []).length > 0 && (
          <>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>{categoryLabel(cat)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
              {["all", ...SUBCATEGORIES_BY_CATEGORY[cat]].map((s) => (
                <button key={s} onClick={() => updateParams({ subcat: s, ptype: "all" })} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: subcat === s ? C.ink : C.muted, fontWeight: subcat === s ? 600 : 400 }}>{s === "all" ? t.all : subcategoryLabel(s)}</button>
              ))}
            </div>
          </>
        )}
        {subcat !== "all" && ((PRODUCT_TYPES_BY_CATEGORY[cat] && PRODUCT_TYPES_BY_CATEGORY[cat][subcat]) || []).length > 0 && (
          <>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>{subcategoryLabel(subcat)}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
              {["all", ...PRODUCT_TYPES_BY_CATEGORY[cat][subcat]].map((pt) => (
                <button key={pt} onClick={() => updateParams({ ptype: pt })} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: ptype === pt ? C.ink : C.muted, fontWeight: ptype === pt ? 600 : 400 }}>{pt === "all" ? t.all : productTypeLabel(pt)}</button>
              ))}
            </div>
          </>
        )}
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>{t.brand}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
          {[{ id: "all", name: t.all }, ...brands].map((b) => (
            <button key={b.id} onClick={() => updateParams({ brand: String(b.id) })} style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, color: brand === String(b.id) ? C.ink : C.muted, fontWeight: brand === String(b.id) ? 600 : 400 }}>{b.name}</button>
          ))}
        </div>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>{t.price}</p>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" placeholder={t.min} style={{ width: "50%", border: `1px solid ${C.line}`, padding: "7px 8px", fontFamily: "Inter, sans-serif", fontSize: 13, background: C.warm, color: C.char, boxSizing: "border-box" }} />
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" placeholder={t.max} style={{ width: "50%", border: `1px solid ${C.line}`, padding: "7px 8px", fontFamily: "Inter, sans-serif", fontSize: 13, background: C.warm, color: C.char, boxSizing: "border-box" }} />
        </div>

        {activeFilterCount > 0 && (
          <button onClick={() => router.push("/browse")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.bronze, textDecoration: "underline" }}>
            {t.clearFilters} ({activeFilterCount})
          </button>
        )}
      </div>
    </aside>
  );
}

export function BrowseSortBar({ resultCount }) {
  const { searchParams, updateParams } = useBrowseParams();
  const { t } = useLang();
  const sort = searchParams.get("sort") || "featured";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>{resultCount} {t.pieces}</p>
      <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} style={{ fontFamily: "Inter, sans-serif", fontSize: 13, border: `1px solid ${C.line}`, padding: "6px 10px", background: C.warm, color: C.char }}>
        <option value="featured">{t.sortNewest}</option>
        <option value="price-asc">{t.sortPriceAsc}</option>
        <option value="price-desc">{t.sortPriceDesc}</option>
        <option value="name-asc">{t.sortNameAsc}</option>
      </select>
    </div>
  );
}

export function NoResultsMessage({ activeFilterCount }) {
  const { t } = useLang();
  const router = useRouter();
  if (!activeFilterCount) return <p style={{ fontFamily: "Inter, sans-serif", color: C.muted, marginBottom: 12 }}>{t.noMatches}</p>;
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <p style={{ fontFamily: "Inter, sans-serif", color: C.muted, marginBottom: 12 }}>{t.noMatches}</p>
      <button onClick={() => router.push("/browse")} style={{ background: "none", border: `1px solid ${C.line}`, padding: "8px 16px", fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer", color: C.char }}>{t.clearFilters}</button>
    </div>
  );
}
