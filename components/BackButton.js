"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { C } from "../lib/constants";

export function BackButton({ label }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>
      <ChevronLeft size={16} /> {label}
    </button>
  );
}
