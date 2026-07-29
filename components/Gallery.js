"use client";

import { useState } from "react";
import { C } from "../lib/constants";
import { Swatch } from "./Swatch";

export function Gallery({ product }) {
  const images = product.images || [];
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return <Swatch product={product} height={460} />;
  }

  return (
    <div>
      <Swatch product={product} height={460} imageUrl={images[activeIdx].url} />
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              style={{ padding: 0, border: `2px solid ${idx === activeIdx ? C.ink : "transparent"}`, background: "none", cursor: "pointer", flexShrink: 0 }}
            >
              <img src={img.url} alt="" style={{ width: 60, height: 60, objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
