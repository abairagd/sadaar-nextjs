"use client";

import Link from "next/link";
import { FaInstagram, FaTiktok, FaSnapchat, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { C, CATEGORIES, SOCIAL } from "../lib/constants";
import { useLang } from "../lib/LangContext";

const footerLink = { display: "block", background: "none", border: "none", padding: 0, cursor: "pointer", color: "#C5CDCE", fontFamily: "Inter, sans-serif", fontSize: 13, textAlign: "left", textDecoration: "none" };
const bottomLink = { background: "none", border: "none", padding: 0, cursor: "pointer", color: "#8A9598", fontFamily: "Inter, sans-serif", fontSize: 12, textDecoration: "none" };

export function Footer() {
  const { t, categoryLabel } = useLang();
  return (
    <footer style={{ background: C.ink, color: C.sand, marginTop: 64 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, marginBottom: 8 }}>SADAAR</div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.6, color: "#C5CDCE" }}>{t.footerTagline}</p>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            {SOCIAL.instagram && <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: "#C5CDCE", display: "flex" }}><FaInstagram size={19} /></a>}
            {SOCIAL.tiktok && <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: "#C5CDCE", display: "flex" }}><FaTiktok size={19} /></a>}
            {SOCIAL.snapchat && <a href={SOCIAL.snapchat} target="_blank" rel="noopener noreferrer" aria-label="Snapchat" style={{ color: "#C5CDCE", display: "flex" }}><FaSnapchat size={19} /></a>}
            {SOCIAL.x && <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" aria-label="X" style={{ color: "#C5CDCE", display: "flex" }}><FaXTwitter size={19} /></a>}
            {SOCIAL.whatsapp && <a href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ color: "#C5CDCE", display: "flex" }}><FaWhatsapp size={19} /></a>}
          </div>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 2, color: "#C5CDCE" }}>
          <div style={{ color: C.sand, marginBottom: 6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.footerShop}</div>
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/browse?cat=${c}`} style={footerLink}>{categoryLabel(c)}</Link>
          ))}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 2, color: "#C5CDCE" }}>
          <div style={{ color: C.sand, marginBottom: 6, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.footerSadaar}</div>
          <Link href="/browse" style={footerLink}>{t.shopAll}</Link>
          <Link href="/wishlist" style={footerLink}>{t.wishlistNav}</Link>
          <Link href="/track-order" style={footerLink}>{t.trackOrderNav}</Link>
          <Link href="/contact" style={footerLink}>{t.contactNav}</Link>
          <Link href="/account" style={footerLink}>{t.myAccount}</Link>
          <a href="https://sadaar-brand-dashboard.vercel.app/" target="_blank" rel="noopener noreferrer" style={footerLink}>{t.brandSignIn}</a>
          <a href="https://sadaar-apply-brand.vercel.app/" target="_blank" rel="noopener noreferrer" style={footerLink}>{t.footerJoin}</a>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #253B3E", padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/faq" style={bottomLink}>FAQ</Link>
          <Link href="/terms" style={bottomLink}>Terms of Service</Link>
          <Link href="/privacy" style={bottomLink}>Privacy Policy</Link>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A9598", textAlign: "center" }}>{t.footerCopyright}</div>
      </div>
    </footer>
  );
}
