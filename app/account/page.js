"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { C, api, money, inputStyle, API_BASE } from "../../lib/constants";
import { useLang } from "../../lib/LangContext";
import { useCustomerAuth } from "../../lib/CustomerAuthContext";

function AccountAuth({ onLogin, initialResetToken }) {
  const { t } = useLang();
  const router = useRouter();
  const [mode, setMode] = useState(initialResetToken ? "reset" : "login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api("/customers/login", { method: "POST", body: JSON.stringify({ email, password }) });
      onLogin(result.token, result.customer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError(t.passwordsDontMatch);
    setLoading(true);
    try {
      const result = await api("/customers/signup", { method: "POST", body: JSON.stringify({ fullName, email, password }) });
      onLogin(result.token, result.customer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitResetRequest = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/customers/request-password-reset", { method: "POST", body: JSON.stringify({ email: resetEmail }) });
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/customers/reset-password", { method: "POST", body: JSON.stringify({ token: initialResetToken, password: newPassword }) });
      setResetDone(true);
      router.replace("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 20 }}>{mode === "signup" ? t.signUp : t.myAccount}</h1>

      {mode === "login" && (
        <>
          <form onSubmit={submitLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailField} style={inputStyle} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder={t.passwordField} style={inputStyle} />
            {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 12, margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: C.ink, color: C.warm, border: "none", padding: "13px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : t.logIn}
            </button>
          </form>
          <button onClick={() => { setMode("forgot"); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontFamily: "Inter, sans-serif", fontSize: 12, textDecoration: "underline", marginTop: 14, padding: 0, display: "block" }}>
            {t.forgotPassword}
          </button>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginTop: 20 }}>
            {t.noAccountYet} <button onClick={() => { setMode("signup"); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink, fontWeight: 600, padding: 0, fontFamily: "Inter, sans-serif", fontSize: 13, textDecoration: "underline" }}>{t.signUp}</button>
          </p>
        </>
      )}

      {mode === "signup" && (
        <>
          <form onSubmit={submitSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.fullNameField} style={inputStyle} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.emailField} style={inputStyle} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder={t.passwordField} style={inputStyle} />
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder={t.confirmPasswordField} style={inputStyle} />
            {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 12, margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ background: C.ink, color: C.warm, border: "none", padding: "13px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : t.signUp}
            </button>
          </form>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginTop: 20 }}>
            {t.haveAccount} <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink, fontWeight: 600, padding: 0, fontFamily: "Inter, sans-serif", fontSize: 13, textDecoration: "underline" }}>{t.logIn}</button>
          </p>
        </>
      )}

      {mode === "forgot" && !resetSent && (
        <form onSubmit={submitResetRequest} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder={t.emailField} style={inputStyle} />
          {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 12, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: C.ink, color: C.warm, border: "none", padding: "13px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "..." : t.forgotPassword}
          </button>
          <button type="button" onClick={() => setMode("login")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontFamily: "Inter, sans-serif", fontSize: 12, textDecoration: "underline", padding: 0 }}>{t.logIn}</button>
        </form>
      )}
      {mode === "forgot" && resetSent && (
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char }}>If that email has a SADAAR account, a reset link is on its way.</p>
        </div>
      )}

      {mode === "reset" && !resetDone && (
        <form onSubmit={submitNewPassword} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder={t.passwordField} style={inputStyle} />
          {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 12, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: C.ink, color: C.warm, border: "none", padding: "13px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "..." : "Save"}
          </button>
        </form>
      )}
      {mode === "reset" && resetDone && (
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char, marginBottom: 12 }}>Password updated.</p>
          <button onClick={() => setMode("login")} style={{ background: C.ink, color: C.warm, border: "none", padding: "10px 20px", fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer" }}>{t.logIn}</button>
        </div>
      )}
    </div>
  );
}

function AccountDashboard({ customerInfo, customerToken, onLogout }) {
  const { t } = useLang();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addrForm, setAddrForm] = useState({ label: "", fullName: "", phone: "", city: "", address: "", isDefault: false });
  const [savingAddr, setSavingAddr] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([
      api("/customers/me/orders", {}, customerToken),
      api("/customers/me/addresses", {}, customerToken),
    ]).then(([o, a]) => { setOrders(o); setAddresses(a); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, [customerToken]);

  const addAddress = async (e) => {
    e.preventDefault();
    setSavingAddr(true);
    setError("");
    try {
      await api("/customers/me/addresses", { method: "POST", body: JSON.stringify(addrForm) }, customerToken);
      setAddrForm({ label: "", fullName: "", phone: "", city: "", address: "", isDefault: false });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingAddr(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api(`/customers/me/addresses/${id}`, { method: "DELETE" }, customerToken);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 64px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, margin: 0 }}>{t.myAccount}</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginTop: 4 }}>{customerInfo?.fullName} — {customerInfo?.email}</p>
        </div>
        <button onClick={onLogout} style={{ background: "none", border: `1px solid ${C.line}`, padding: "8px 16px", fontFamily: "Inter, sans-serif", fontSize: 13, cursor: "pointer", color: C.char }}>{t.logOut}</button>
      </div>

      <div style={{ display: "flex", gap: 20, borderBottom: `1px solid ${C.line}`, marginBottom: 24 }}>
        {[["orders", t.orderHistory], ["addresses", t.savedAddresses]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", borderBottom: tab === id ? `2px solid ${C.ink}` : "2px solid transparent", padding: "10px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: tab === id ? C.ink : C.muted }}>{label}</button>
        ))}
      </div>

      {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 13, marginBottom: 16 }}>{error}</p>}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 40, fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading...
        </div>
      )}

      {!loading && tab === "orders" && (
        orders.length === 0 ? <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted }}>{t.noOrdersYet}</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orders.map((o) => (
              <div key={o.id} style={{ border: `1px solid ${C.line}`, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: C.ink, margin: 0 }}>Order #{o.id}</p>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, textTransform: "uppercase", color: o.payment_status === "paid" ? "#2F5B3C" : C.muted }}>{o.payment_status}</span>
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, margin: "4px 0 10px" }}>{new Date(o.created_at).toLocaleDateString()} — {money(o.total)}</p>
                {o.items.map((i) => (
                  <p key={i.id} style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char, margin: "2px 0" }}>{i.product_name} × {i.quantity} — {i.brand_name}</p>
                ))}
                
                <a
                  href={`${API_BASE}/orders/${o.id}/receipt?contact=${encodeURIComponent(customerInfo?.email || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 10, background: "none", border: `1px solid ${C.line}`, padding: "6px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, color: C.char, textDecoration: "none" }}
                >
                  Download receipt (PDF)
                </a>
              </div>
            ))}
          </div>
        )
      )}

      {!loading && tab === "addresses" && (
        <div>
          {addresses.length === 0 ? (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 20 }}>{t.noAddressesYet}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {addresses.map((a) => (
                <div key={a.id} style={{ border: `1px solid ${C.line}`, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    {a.label && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: C.bronze, margin: 0 }}>{a.label}{a.is_default ? ` · ${t.defaultBadge}` : ""}</p>}
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.ink, margin: "4px 0 0" }}>{a.full_name}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, margin: "2px 0 0" }}>{a.address}, {a.city}</p>
                  </div>
                  <button onClick={() => deleteAddress(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted }}><X size={16} /></button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={addAddress} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
            <input value={addrForm.label} onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))} placeholder={t.addressLabel} style={inputStyle} />
            <input value={addrForm.fullName} onChange={(e) => setAddrForm((f) => ({ ...f, fullName: e.target.value }))} placeholder={t.fullNameField} style={inputStyle} />
            <input value={addrForm.phone} onChange={(e) => setAddrForm((f) => ({ ...f, phone: e.target.value }))} placeholder={t.phoneNumber} style={inputStyle} />
            <input value={addrForm.city} onChange={(e) => setAddrForm((f) => ({ ...f, city: e.target.value }))} placeholder={t.city} style={inputStyle} />
            <input value={addrForm.address} onChange={(e) => setAddrForm((f) => ({ ...f, address: e.target.value }))} placeholder={t.address} style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 13, color: C.char }}>
              <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm((f) => ({ ...f, isDefault: e.target.checked }))} />
              {t.setAsDefault}
            </label>
            <button type="submit" disabled={savingAddr} style={{ background: C.ink, color: C.warm, border: "none", padding: "11px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: "pointer", opacity: savingAddr ? 0.7 : 1 }}>
              {savingAddr ? "..." : t.addAddress}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function AccountInner() {
  const { customerToken, customerInfo, loginCustomer, logoutCustomer, hydrated } = useCustomerAuth();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  if (!hydrated) return null;

  if (customerToken) {
    return <AccountDashboard customerInfo={customerInfo} customerToken={customerToken} onLogout={logoutCustomer} />;
  }
  return <AccountAuth onLogin={loginCustomer} initialResetToken={resetToken} />;
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountInner />
    </Suspense>
  );
}
