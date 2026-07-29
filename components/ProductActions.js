"use client";

import { useState } from "react";
import { Heart, Minus, Plus, Check } from "lucide-react";
import { C } from "../lib/constants";
import { useLang } from "../lib/LangContext";
import { useCart } from "../lib/CartContext";
import { useWishlist } from "../lib/WishlistContext";

export function WishlistHeartButton({ productId }) {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const wishlisted = wishlistIds.includes(productId);
  return (
    <button onClick={() => toggleWishlist(productId)} aria-label="Toggle wishlist" style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <Heart size={16} color={C.ink} fill={wishlisted ? C.ink : "none"} />
    </button>
  );
}

export function ProductActions({ product }) {
  const { t } = useLang();
  const { addToCart } = useCart();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId);

  return (
    <>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{t.size}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        {product.variants.map((v) => (
          <button key={v.id} disabled={v.stock_qty === 0} onClick={() => setVariantId(v.id)} style={{ padding: "8px 14px", border: `1px solid ${variantId === v.id ? C.ink : C.line}`, background: variantId === v.id ? C.ink : "none", color: v.stock_qty === 0 ? C.line : variantId === v.id ? C.warm : C.char, fontFamily: "Inter, sans-serif", fontSize: 13, cursor: v.stock_qty === 0 ? "not-allowed" : "pointer" }}>
            {v.size}{v.stock_qty === 0 ? ` (${t.soldOut})` : ""}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, margin: 0 }}>{t.qty}</p>
        <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.line}` }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer" }}><Minus size={14} /></button>
          <span style={{ padding: "0 10px", fontFamily: "Inter, sans-serif", fontSize: 14 }}>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer" }}><Plus size={14} /></button>
        </div>
      </div>

      <button
        disabled={!variant || variant.stock_qty === 0}
        onClick={() => { addToCart(product, variant, qty); setAdded(true); setTimeout(() => setAdded(false), 1600); }}
        style={{ width: "100%", background: !variant || variant.stock_qty === 0 ? C.line : C.ink, color: C.warm, border: "none", padding: "14px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: !variant || variant.stock_qty === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        {added ? <><Check size={16} /> {t.addedToCart}</> : variant?.stock_qty === 0 ? t.soldOut : t.addToCart}
      </button>
    </>
  );
}
