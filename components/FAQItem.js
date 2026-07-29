"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "../lib/constants";

const legalP = { fontFamily: "Inter, sans-serif", fontSize: 14, color: C.char, lineHeight: 1.7, marginBottom: 10 };

export function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.line}`, padding: "16px 0" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Fraunces, serif", fontSize: 16, color: C.ink, padding: 0 }}>
        {q}
        <Plus size={16} style={{ transform: open ? "rotate(45deg)" : "none", transition: "transform 0.15s ease", flexShrink: 0, marginLeft: 12 }} />
      </button>
      {open && <p style={{ ...legalP, marginTop: 10, marginBottom: 0 }}>{a}</p>}
    </div>
  );
}
