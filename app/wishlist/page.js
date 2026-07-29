"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { C, api } from "../../lib/constants";
import { useLang } from "../../lib/LangContext";
import { useWishlist } from "../../lib/WishlistContext";
import { ProductCard } from "../../components/ProductCard";

export default function WishlistPage() {
  const { t } = useLang();
  const { wishlistIds } = useWishlist();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(wishlistIds.map((id) => api(`/products/${id}`).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [wishlistIds]);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 24 }}>{t.yourWishlist}</h1>
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 40, fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
          Loading...
        </div>
      )}
      {!loading && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <Heart size={28} color={C.line} style={{ marginBottom: 14 }} />
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 18, color: C.ink }}>{t.nothingSaved}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginTop: 6, marginBottom: 16 }}>{t.nothingSavedSubtext}</p>
          <button onClick={() => router.push("/browse")} style={{ background: C.ink, color: C.warm, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.shopTheEdit}</button>
        </div>
      )}
      {!loading && products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "28px 20px" }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
