"use client";

import { useState } from "react";
import { C, api, money, inputStyle, API_BASE } from "../../lib/constants";
import { OrderStatusTimeline } from "../../components/OrderStatusTimeline";
import { useLang } from "../../lib/LangContext";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [contact, setContact] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const { t } = useLang();

  const lookup = async () => {
    setError(null);
    setOrder(null);
    if (!orderId.trim() || !contact.trim()) {
      setError(t.enterOrderAndContact);
      return;
    }
    setLoading(true);
    try {
      const result = await api(`/orders/${orderId.trim()}?contact=${encodeURIComponent(contact.trim())}`);
      setOrder(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const requestCancellation = async (itemId) => {
    setCancelingId(itemId);
    setCancelError("");
    try {
      await api(`/orders/${orderId.trim()}/items/${itemId}/request-cancellation`, { method: "POST", body: JSON.stringify({ contact: contact.trim() }) });
      await lookup();
    } catch (e) {
      setCancelError(e.message);
    } finally {
      setCancelingId(null);
    }
  };

  const [returnFormItemId, setReturnFormItemId] = useState(null);
  const [returnType, setReturnType] = useState("return");
  const [returnReason, setReturnReason] = useState("");
  const [exchangeVariantId, setExchangeVariantId] = useState("");
  const [exchangeVariants, setExchangeVariants] = useState([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const openReturnForm = async (item) => {
    setReturnFormItemId(item.id);
    setReturnType("return");
    setReturnReason("");
    setExchangeVariantId("");
    try {
      const product = await api(`/products/${item.product_id}`);
      setExchangeVariants(product.variants || []);
    } catch {
      setExchangeVariants([]);
    }
  };

  const submitReturn = async (itemId) => {
    setSubmittingReturn(true);
    setCancelError("");
    try {
      await api(`/orders/${orderId.trim()}/items/${itemId}/request-return`, {
        method: "POST",
        body: JSON.stringify({ contact: contact.trim(), returnType, reason: returnReason, exchangeVariantId: returnType === "exchange" ? Number(exchangeVariantId) : undefined }),
      });
      setReturnFormItemId(null);
      await lookup();
    } catch (e) {
      setCancelError(e.message);
    } finally {
      setSubmittingReturn(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 6 }}>{t.trackYourOrder}</h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 24 }}>{t.trackSubtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
        <input placeholder={t.orderNumberPlaceholder} value={orderId} onChange={(e) => setOrderId(e.target.value)} style={inputStyle} />
        <input placeholder={t.contactPlaceholder} value={contact} onChange={(e) => setContact(e.target.value)} style={inputStyle} />
      </div>
      {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 13, margin: "8px 0" }}>{error}</p>}
      <button onClick={lookup} disabled={loading} style={{ marginTop: 8, background: C.ink, color: C.warm, border: "none", padding: "13px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
        {loading ? t.lookingUp : t.trackOrderBtn}
      </button>

      {order && (
        <div style={{ marginTop: 32, borderTop: `1px solid ${C.line}`, paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <p style={{ fontFamily: "Fraunces, serif", fontSize: 18, color: C.ink, margin: 0 }}>Order #{order.id}</p>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: order.payment_status === "paid" ? "#2F5B3C" : C.muted }}>{order.payment_status}</span>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 8 }}>{order.shipping_city} · placed {new Date(order.created_at).toLocaleDateString()}</p>
          
          <a
            href={`${API_BASE}/orders/${order.id}/receipt?contact=${encodeURIComponent(contact.trim())}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginBottom: 20, background: "none", border: `1px solid ${C.line}`, padding: "6px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.char, textDecoration: "none" }}
          >
            Download receipt (PDF)
          </a>
          {cancelError && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 12, margin: "8px 0" }}>{cancelError}</p>}
          {order.items.map((i) => (
            <div key={i.id} style={{ padding: "12px 0", borderBottom: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted }}>{i.brand_name}</p>
                  <p style={{ margin: "2px 0 0", fontFamily: "Fraunces, serif", fontSize: 15, color: C.ink }}>{i.product_name} × {i.quantity}</p>
                  {i.tracking_number && <p style={{ margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted }}>{t.tracking}: {i.tracking_number}</p>}
                </div>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase",
                  padding: "3px 9px", borderRadius: 3,
                  background: i.fulfillment_status === "pending" ? "#F3E6D8" : "#DDE7DB",
                  color: i.fulfillment_status === "pending" ? "#8A5A1E" : "#2F5B3C",
                }}>{i.fulfillment_status}</span>
              </div>
              <OrderStatusTimeline paymentStatus={order.payment_status} fulfillmentStatus={i.fulfillment_status} />
              {i.cancellation_status === "none" && i.fulfillment_status === "pending" && order.payment_status === "paid" && (
                <button onClick={() => requestCancellation(i.id)} disabled={cancelingId === i.id} style={{ marginTop: 8, background: "none", border: `1px solid ${C.line}`, padding: "6px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer", color: C.char }}>
                  {cancelingId === i.id ? t.sending : t.requestCancellation}
                </button>
              )}
              {i.cancellation_status === "requested" && (
                <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A5A1E" }}>{t.cancellationRequested}</p>
              )}
              {i.cancellation_status === "denied" && (
                <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: C.danger }}>{t.cancellationDenied}</p>
              )}
              {i.cancellation_status === "refunded" && (
                <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#2F5B3C" }}>{t.cancellationRefunded}</p>
              )}

              {["shipped", "delivered"].includes(i.fulfillment_status) && i.return_status === "none" && (
                returnFormItemId === i.id ? (
                  <div style={{ marginTop: 10, border: `1px solid ${C.line}`, padding: 12, background: C.warm }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                        <input type="radio" checked={returnType === "return"} onChange={() => setReturnType("return")} /> {t.requestReturnLabel}
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: 13 }}>
                        <input type="radio" checked={returnType === "exchange"} onChange={() => setReturnType("exchange")} /> {t.requestExchangeLabel}
                      </label>
                    </div>
                    {returnType === "exchange" && (
                      <select value={exchangeVariantId} onChange={(e) => setExchangeVariantId(e.target.value)} style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }}>
                        <option value="">{t.chooseSize}</option>
                        {exchangeVariants.filter((v) => v.id !== i.variant_id).map((v) => (
                          <option key={v.id} value={v.id} disabled={v.stock_qty === 0}>{v.size}{v.stock_qty === 0 ? ` (${t.soldOut})` : ""}</option>
                        ))}
                      </select>
                    )}
                    <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} placeholder={t.returnReasonPlaceholder} rows={2} style={{ ...inputStyle, width: "100%", marginBottom: 10, fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => submitReturn(i.id)} disabled={submittingReturn || (returnType === "exchange" && !exchangeVariantId)} style={{ background: C.ink, color: C.warm, border: "none", padding: "8px 16px", fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer" }}>
                        {submittingReturn ? t.sending : t.submitRequest}
                      </button>
                      <button onClick={() => setReturnFormItemId(null)} style={{ background: "none", border: `1px solid ${C.line}`, padding: "8px 16px", fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer", color: C.char }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => openReturnForm(i)} style={{ marginTop: 8, background: "none", border: `1px solid ${C.line}`, padding: "6px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer", color: C.char }}>
                    {t.requestReturnOrExchange}
                  </button>
                )
              )}
              {i.return_status === "requested" && <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A5A1E" }}>{t.returnRequested}</p>}
              {i.return_status === "approved" && <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A5A1E" }}>{t.returnApproved}</p>}
              {i.return_status === "denied" && <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: C.danger }}>{t.returnDenied}</p>}
              {i.return_status === "received" && <p style={{ marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#2F5B3C" }}>{i.return_type === "exchange" ? t.exchangeComplete : t.returnComplete}</p>}
            </div>
          ))}
          <div style={{ paddingTop: 16, fontFamily: "Inter, sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{t.subtotal}</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{money(order.subtotal)}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{t.shipping}</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{Number(order.shipping_fee) === 0 ? t.free : money(order.shipping_fee)}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontSize: 14, color: C.char, margin: 0 }}>{t.total}</p>
              <p style={{ fontSize: 14, color: C.ink, fontWeight: 600, margin: 0 }}>{money(order.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
