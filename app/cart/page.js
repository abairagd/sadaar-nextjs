"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { C, money, estimateShipping, SHIPPING_FEE_PER_BRAND, FREE_SHIPPING_THRESHOLD } from "../../lib/constants";
import { useLang } from "../../lib/LangContext";
import { useCart } from "../../lib/CartContext";
import { Swatch } from "../../components/Swatch";

export default function CartPage() {
  const { t } = useLang();
  const { cart: items, updateQty, removeItem } = useCart();
  const router = useRouter();
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = estimateShipping(items);

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <ShoppingBag size={32} color={C.line} style={{ marginBottom: 16 }} />
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 22, color: C.ink }}>{t.bagEmpty}</p>
        <button onClick={() => router.push("/browse")} style={{ marginTop: 16, background: C.ink, color: C.warm, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.shopTheEdit}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 24 }}>{t.yourBag}</h1>
      {items.map((item, idx) => (
        <div key={idx} className="sadaar-cart-row" style={{ display: "flex", gap: 18, padding: "18px 0", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ width: 100, flexShrink: 0 }}><Swatch product={item.product} height={120} /></div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted }}>{item.product.brand_name}</p>
            <p style={{ margin: "4px 0", fontFamily: "Fraunces, serif", fontSize: 16, color: C.ink }}>{item.product.name}</p>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>{t.size} {item.variant.size}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.line}` }}>
                <button onClick={() => updateQty(idx, -1)} style={{ background: "none", border: "none", padding: "4px 8px", cursor: "pointer" }}><Minus size={12} /></button>
                <span style={{ padding: "0 8px", fontSize: 13, fontFamily: "Inter, sans-serif" }}>{item.qty}</span>
                <button onClick={() => updateQty(idx, 1)} style={{ background: "none", border: "none", padding: "4px 8px", cursor: "pointer" }}><Plus size={12} /></button>
              </div>
              <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontFamily: "Inter, sans-serif", fontSize: 12, textDecoration: "underline" }}>{t.remove}</button>
            </div>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.ink, fontWeight: 500 }}>{money(item.product.price * item.qty)}</p>
        </div>
      ))}
      <div style={{ padding: "20px 0", fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 15, color: C.char, margin: 0 }}>{t.subtotal}</p>
          <p style={{ fontSize: 15, color: C.ink, margin: 0 }}>{money(subtotal)}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 15, color: C.char, margin: 0 }}>{t.shipping}</p>
          <p style={{ fontSize: 15, color: shipping === 0 ? "#2F5B3C" : C.ink, margin: 0 }}>{shipping === 0 ? t.free : money(shipping)}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${C.line}` }}>
          <p style={{ fontSize: 15, color: C.char, fontWeight: 600, margin: 0 }}>{t.estimatedTotal}</p>
          <p style={{ fontSize: 15, color: C.ink, fontWeight: 600, margin: 0 }}>{money(subtotal + shipping)}</p>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginTop: 10 }}>{t.shippingNote(SHIPPING_FEE_PER_BRAND, FREE_SHIPPING_THRESHOLD)}</p>
      </div>
      <button onClick={() => router.push("/checkout")} style={{ width: "100%", background: C.ink, color: C.warm, border: "none", padding: "15px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.checkout}</button>
    </div>
  );
}
