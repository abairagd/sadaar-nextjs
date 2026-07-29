"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { C, api, inputStyle } from "../../lib/constants";
import { useLang } from "../../lib/LangContext";

export default function ContactPage() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t.fillAllFields);
      return;
    }
    setSending(true);
    try {
      await api("/support", { method: "POST", body: JSON.stringify({ name, email, subject, message }) });
      setSent(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <Check size={30} color={C.ink} style={{ marginBottom: 16 }} />
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 24, color: C.ink, marginBottom: 8 }}>{t.messageSent}</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: C.muted }}>{t.messageSentNote}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={{ fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 6 }}>{t.contactUs}</h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: C.muted, marginBottom: 24 }}>{t.contactSubtitle}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder={t.yourName} value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        <input placeholder={t.emailOptional.replace(/\s*\(.*\)/, "")} value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder={t.subjectOptional} value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} />
        <textarea placeholder={t.yourMessage} value={message} onChange={(e) => setMessage(e.target.value)} rows={5} style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }} />
      </div>
      {error && <p style={{ color: "#A3402F", fontFamily: "Inter, sans-serif", fontSize: 13, marginTop: 12 }}>{error}</p>}
      <button onClick={submit} disabled={sending} style={{ marginTop: 16, width: "100%", background: C.ink, color: C.warm, border: "none", padding: "14px 0", fontFamily: "Inter, sans-serif", fontSize: 14, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1 }}>
        {sending ? t.sending : t.sendMessage}
      </button>
    </div>
  );
}
