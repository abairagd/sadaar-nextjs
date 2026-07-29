import { C, catTone } from "../lib/constants";

export function Tag({ text }) {
  return (
    <div style={{ position: "absolute", top: 14, left: -6, transform: "rotate(-6deg)", background: C.warm, border: `1px solid ${C.line}`, padding: "4px 10px 4px 16px", fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: C.ink, boxShadow: "1px 2px 4px rgba(20,40,46,0.12)", zIndex: 2 }}>
      <span style={{ position: "absolute", left: 5, top: "50%", width: 5, height: 5, borderRadius: "50%", background: C.warm, border: `1px solid ${C.muted}`, transform: "translateY(-50%)" }} />
      {text}
    </div>
  );
}

export function Swatch({ product, height = 260, imageUrl }) {
  const tone = catTone[product.category] || catTone.Men;
  const brandName = product.brand_name || product.brandName || "SADAAR";
  const src = imageUrl || product.image_url || product.images?.[0]?.url;

  if (src) {
    return (
      <div style={{ position: "relative", height, background: tone.bg, overflow: "hidden" }}>
        {/* Plain <img>, not next/image — product photos are user-uploaded to
            Supabase Storage with arbitrary dimensions; next/image's strict
            remote-pattern + optimization pipeline adds complexity this
            migration doesn't need to take on right now. */}
        <img src={src} alt={product.name || brandName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <Tag text={brandName} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, background: tone.bg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontWeight: 500, fontSize: height * 0.62, color: tone.fg, opacity: 0.16, lineHeight: 1 }}>
        {brandName.charAt(0)}
      </span>
      <Tag text={brandName} />
    </div>
  );
}
