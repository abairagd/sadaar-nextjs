"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { C, api, money, estimateShipping, inputStyle } from "../../lib/constants";
import { useLang } from "../../lib/LangContext";
import { useCart } from "../../lib/CartContext";
import { useCustomerAuth } from "../../lib/CustomerAuthContext";

// Handles the return trip from Moyasar's 3D Secure redirect. Moyasar appends
// ?id=<payment_id> to callback_url (which is always this exact page's URL,
// since that's what window.location.pathname was when the form mounted) and
// does a full page reload, wiping normal React state — so we recover the
// pending order from localStorage and finish confirming payment here.
function ReturningFromPayment({ paymentId }) {
  const { t } = useLang();
  const { clearCart } = useCart();
  const router = useRouter();
  const [state, setState] = useState({ status: "checking" });

  useEffect(() => {
    router.replace("/checkout"); // clean the ?id= out of the URL

    const pendingRaw = localStorage.getItem("sadaar_pending_order");
    if (!pendingRaw) {
      setState({ status: "error", message: "Payment returned, but we lost track of which order it belongs to. Please check your order status or contact support." });
      return;
    }
    const pending = JSON.parse(pendingRaw);
    setState({ status: "checking", orderId: pending.orderId, total: pending.total });

    api(`/orders/${pending.orderId}/confirm-payment`, {
      method: "POST",
      body: JSON.stringify({ paymentId }),
    })
      .then(() => {
        localStorage.removeItem("sadaar_pending_order");
        clearCart();
        setState({ status: "paid", orderId: pending.orderId, total: pending.total });
      })
      .catch((e) => {
        setState({ status: "error", orderId: pending.orderId, message: e.message });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      {state.status === "checking" && (
        <>
          <Loader2 size={28} color={C.ink} style={{ animation: "spin 1s linear infinite", marginBottom: 16 }} />
          <p style={{ fontFamily: "Fraunces, serif", fontSize: 20, color: C.ink }}>{t.confirmingPayment}</p>
        </>
      )}
      {state.status === "paid" && (
        <>
          <Check size={30} color={C.ink} style={{ marginBottom: 16 }} />
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 8 }}>{t.paymentReceived}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.muted, marginBottom: 24 }}>{t.confirmationEmailNote(state.orderId, money(state.total))}</p>
          <button onClick={() => router.push("/")} style={{ background: C.ink, color: C.warm, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.backToSadaar}</button>
        </>
      )}
      {state.status === "error" && (
        <>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: C.ink, marginBottom: 8 }}>{t.couldNotConfirmPayment}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#A3402F", marginBottom: 24 }}>{state.message}</p>
          <button onClick={() => router.push("/")} style={{ background: C.ink, color: C.warm, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.backToSadaar}</button>
        </>
      )}
    </div>
  );
}

function CheckoutForm() {
  const { t } = useLang();
  const { cart: items, clearCart } = useCart();
  const { customerToken, customerInfo } = useCustomerAuth();
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = estimateShipping(items);

  const [form, setForm] = useState({ fullName: customerInfo?.fullName || "", email: customerInfo?.email || "", phone: "", city: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [paid, setPaid] = useState(false);
  const [publishableKey, setPublishableKey] = useState(null);
  const formRef = useRef(null);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  useEffect(() => {
    if (customerToken) {
      api("/customers/me/addresses", {}, customerToken)
        .then((addrs) => {
          setSavedAddresses(addrs);
          const def = addrs.find((a) => a.is_default) || addrs[0];
          if (def) applySavedAddress(def);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerToken]);

  const applySavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setForm((f) => ({ ...f, fullName: addr.full_name, phone: addr.phone || "", city: addr.city, address: addr.address }));
  };

  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setCheckingPromo(true);
    setPromoError("");
    try {
      const result = await api("/discounts/validate", { method: "POST", body: JSON.stringify({ code: promoInput.trim(), subtotal }) });
      setPromo(result);
    } catch (e) {
      setPromo(null);
      setPromoError(e.message);
    } finally {
      setCheckingPromo(false);
    }
  };

  const removePromo = () => { setPromo(null); setPromoInput(""); setPromoError(""); };

  const discountAmount = promo?.discountAmount || 0;
  const total = subtotal + shipping - discountAmount;

  useEffect(() => {
    api("/config/moyasar").then((c) => setPublishableKey(c.publishableKey)).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async () => {
    if (!form.fullName || !form.phone || !form.city || !form.address) {
      setError(t.fillAllFields);
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      const result = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ variantId: i.variant.id, quantity: i.qty })),
          discountCode: promo?.code || undefined,
        }),
      }, customerToken);
      setOrder(result);
      if (customerToken && saveNewAddress && !selectedAddressId) {
        api("/customers/me/addresses", {
          method: "POST",
          body: JSON.stringify({ fullName: form.fullName, phone: form.phone, city: form.city, address: form.address, isDefault: savedAddresses.length === 0 }),
        }, customerToken).catch(() => {});
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  const [debugMsg, setDebugMsg] = useState("");

  useEffect(() => {
    if (!order || !publishableKey || paid) return;
    setDebugMsg("Loading payment form script...");

    localStorage.setItem("sadaar_pending_order", JSON.stringify({ orderId: order.orderId, total: order.total }));

    const existing = document.querySelector('script[src*="moyasar.js"]');
    const mount = () => {
      try {
        if (!document.querySelector(".mysr-form")) {
          setDebugMsg("Error: .mysr-form element not found in page yet.");
          return;
        }
        if (!window.Moyasar) {
          setDebugMsg("Error: Moyasar script loaded but window.Moyasar is undefined.");
          return;
        }
        window.Moyasar.init({
          element: ".mysr-form",
          amount: Math.round(order.total * 100),
          currency: "SAR",
          description: `SADAAR order #${order.orderId}`,
          publishable_api_key: publishableKey,
          callback_url: window.location.origin + window.location.pathname,
          methods: ["creditcard"],
          metadata: { orderId: String(order.orderId) },
          on_completed: async (payment) => {
            try {
              await api(`/orders/${order.orderId}/confirm-payment`, {
                method: "POST",
                body: JSON.stringify({ paymentId: payment.id }),
              });
              setPaid(true);
              clearCart();
            } catch (e) {
              setError(e.message);
            }
          },
        });
        setDebugMsg("");
      } catch (err) {
        setDebugMsg(`Error initializing payment form: ${err.name}: ${err.message}`);
      }
    };

    if (existing && window.Moyasar) {
      mount();
      return;
    }

    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = "https://cdn.moyasar.com/mpf/1.7.3/moyasar.css";
    document.head.appendChild(linkEl);

    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.7.3/moyasar.js";
    script.onload = () => { setDebugMsg("Script loaded, initializing form..."); mount(); };
    script.onerror = () => setDebugMsg("Error: failed to load moyasar.js from CDN (network/blocked?).");
    document.body.appendChild(script);
  }, [order, publishableKey, paid]);

  if (paid) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <Check size={30} color={C.ink} style={{ marginBottom: 16 }} />
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 8 }}>{t.paymentReceived}</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.muted, marginBottom: 4 }}>Order #{order.orderId} — {money(order.total)}</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 24 }}>{t.paymentReceivedNote}</p>
        <button onClick={() => router.push("/")} style={{ background: C.ink, color: C.warm, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.backToSadaar}</button>
      </div>
    );
  }

  if (order) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 24px 64px" }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: C.ink, marginBottom: 6 }}>{t.payment}</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 20 }}>Order #{order.orderId} — {money(order.total)}</p>
        {!publishableKey && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 13 }}>{t.paymentGatewayMissing}</p>}
        {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        {debugMsg && <p style={{ color: C.muted, fontFamily: "monospace", fontSize: 11, marginBottom: 12, whiteSpace: "pre-wrap" }}>{debugMsg}</p>}
        <div className="mysr-form" ref={formRef} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "Fraunces, serif", fontSize: 20, color: C.ink }}>{t.bagEmpty}</p>
        <button onClick={() => router.push("/browse")} style={{ marginTop: 16, background: C.ink, color: C.warm, border: "none", padding: "12px 24px", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer" }}>{t.shopTheEdit}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: C.ink, marginBottom: 6 }}>{t.checkout}</h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 24 }}>{t.checkoutSubtitle}</p>

      {customerToken && savedAddresses.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{t.useSavedAddress}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {savedAddresses.map((a) => (
              <button key={a.id} onClick={() => applySavedAddress(a)} style={{ textAlign: "left", background: selectedAddressId === a.id ? C.sand : "none", border: `1px solid ${selectedAddressId === a.id ? C.ink : C.line}`, padding: "10px 12px", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char }}>
                {a.label ? `${a.label} — ` : ""}{a.full_name}, {a.address}, {a.city}
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginTop: 10 }}>{t.orNewAddress}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <input placeholder={t.fullName} value={form.fullName} onChange={set("fullName")} style={inputStyle} />
        <input placeholder={t.emailOptional} value={form.email} onChange={set("email")} style={inputStyle} />
        <input placeholder={t.phoneNumber} value={form.phone} onChange={set("phone")} style={inputStyle} />
        <input placeholder={t.city} value={form.city} onChange={set("city")} style={inputStyle} />
        <input placeholder={t.address} value={form.address} onChange={set("address")} style={inputStyle} />
        {customerToken && !selectedAddressId && (
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char }}>
            <input type="checkbox" checked={saveNewAddress} onChange={(e) => setSaveNewAddress(e.target.checked)} />
            {t.saveThisAddress}
          </label>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {promo ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid #2F5B3C`, padding: "10px 12px", fontFamily: "Inter, sans-serif", fontSize: 13, color: "#2F5B3C" }}>
            <span>{t.codeApplied(promo.code)}</span>
            <button onClick={removePromo} style={{ background: "none", border: "none", cursor: "pointer", color: "#2F5B3C", textDecoration: "underline", fontSize: 12 }}>{t.remove}</button>
          </div>
        ) : (
          <>
            <input placeholder={t.promoCode} value={promoInput} onChange={(e) => setPromoInput(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={applyPromo} disabled={checkingPromo} style={{ background: "none", border: `1px solid ${C.ink}`, padding: "0 18px", fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer", color: C.char }}>
              {checkingPromo ? t.checking : t.apply}
            </button>
          </>
        )}
      </div>
      {promoError && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 12, marginBottom: 12 }}>{promoError}</p>}

      {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{t.subtotal}</p>
          <p style={{ fontSize: 14, color: C.char, margin: 0 }}>{money(subtotal)}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{t.shipping}</p>
          <p style={{ fontSize: 14, color: shipping === 0 ? "#2F5B3C" : C.char, margin: 0 }}>{shipping === 0 ? t.free : money(shipping)}</p>
        </div>
        {discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: "#2F5B3C", margin: 0 }}>{t.discount}</p>
            <p style={{ fontSize: 14, color: "#2F5B3C", margin: 0 }}>-{money(discountAmount)}</p>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p style={{ fontSize: 15 }}>{t.totalDue}</p>
          <p style={{ fontSize: 15, fontWeight: 600 }}>{money(total)}</p>
        </div>
      </div>
      <button onClick={placeOrder} disabled={placing} style={{ width: "100%", background: C.ink, color: C.warm, border: "none", padding: "15px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: placing ? "default" : "pointer", opacity: placing ? 0.7 : 1, marginTop: 16 }}>
        {placing ? t.placingOrder : t.continueToPayment}
      </button>
    </div>
  );
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  // Captured once, on mount, via the lazy initializer — not read fresh on
  // every render. This matters: once we start confirming payment, we clean
  // the ?id= out of the URL, which would otherwise cause this component to
  // re-evaluate searchParams.get("id") as null and switch back to the plain
  // checkout form mid-confirmation (with an already-emptied cart, showing
  // a confusing "Your basket is empty" instead of the success screen).
  const [paymentId] = useState(() => searchParams.get("id"));

  if (paymentId) {
    return <ReturningFromPayment paymentId={paymentId} />;
  }
  return <CheckoutForm />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}