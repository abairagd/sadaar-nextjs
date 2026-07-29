"use client";

import { useState } from "react";
import { C } from "../lib/constants";

export function TabToggle({ tabALabel, tabBLabel, tabAContent, tabBContent, defaultTab = "a" }) {
  const [tab, setTab] = useState(defaultTab);
  return (
    <>
      <div style={{ borderBottom: `1px solid ${C.line}`, background: C.warm }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", gap: 24 }}>
          <button onClick={() => setTab("a")} style={{ background: "none", border: "none", borderBottom: tab === "a" ? `2px solid ${C.ink}` : "2px solid transparent", padding: "14px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: tab === "a" ? C.ink : C.muted }}>{tabALabel}</button>
          <button onClick={() => setTab("b")} style={{ background: "none", border: "none", borderBottom: tab === "b" ? `2px solid ${C.ink}` : "2px solid transparent", padding: "14px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: tab === "b" ? C.ink : C.muted }}>{tabBLabel}</button>
        </div>
      </div>
      {tab === "a" ? tabAContent : tabBContent}
    </>
  );
}
