"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { C, money } from "../lib/constants";
import { Swatch } from "./Swatch";
import { useWishlist } from "../lib/WishlistContext";

export function ProductCard({ product }) {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const wishlisted = wishlistIds.includes(product.id);

  return (
    <div style={{ position: "relative" }}>
      <Link href={`/product/${product.id}`} className="sadaar-card-hover" style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Inter, sans-serif", width: "100%", display: "block", textDecoration: "none" }}>
        <Swatch product={product} />
        <div style={{ paddingTop: 10 }}>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted }}>{product.brand_name}</p>
          <p style={{ margin: "2px 0 0", fontSize: 15, color: C.char, fontFamily: "Fraunces, serif" }}>{product.name}</p>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.ink, fontWeight: 500 }}>{money(product.price)}</p>
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
        aria-label="Toggle wishlist"
        style={{ position: "absolute", top: 10, right: 10, background: "rgba(251,248,241,0.9)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <Heart size={15} color={C.ink} fill={wishlisted ? C.ink : "none"} />
      </button>
    </div>
  );
}
