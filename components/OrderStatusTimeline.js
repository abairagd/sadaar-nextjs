"use client";

import { Check } from "lucide-react";
import { C } from "../lib/constants";

export function OrderStatusTimeline({ paymentStatus, fulfillmentStatus }) {
  const steps = [
    { key: "placed", label: "Placed", done: true },
    { key: "paid", label: "Paid", done: paymentStatus === "paid" },
    { key: "shipped", label: "Shipped", done: ["shipped", "delivered"].includes(fulfillmentStatus) },
    { key: "delivered", label: "Delivered", done: fulfillmentStatus === "delivered" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
      {steps.map((step, i) => (
        <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "0 0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: step.done ? C.ink : "none",
                border: `2px solid ${step.done ? C.ink : C.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {step.done && <Check size={12} color={C.warm} />}
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: step.done ? C.ink : C.muted, whiteSpace: "nowrap" }}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: steps[i + 1].done ? C.ink : C.line, margin: "0 4px 16px" }} />
          )}
        </div>
      ))}
    </div>
  );
}
