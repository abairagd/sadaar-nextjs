import { C } from "../../lib/constants";

export const metadata = {
  title: "Privacy Policy — SADAAR",
  description: "How SADAAR collects, uses, and protects your personal information.",
};

const legalH1 = { fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 8 };
const legalH2 = { fontFamily: "Fraunces, serif", fontSize: 17, color: C.ink, marginTop: 28, marginBottom: 8 };
const legalP = { fontFamily: "Inter, sans-serif", fontSize: 14, color: C.char, lineHeight: 1.7, marginBottom: 10 };
const legalMeta = { fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 24 };

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={legalH1}>Privacy Policy</h1>
      <p style={legalMeta}>Last updated: November 2026. This policy has not yet been reviewed by a licensed attorney specializing in Saudi data protection law — see the flagged note below.</p>

      <div style={{ background: "#F3E6D8", border: "1px solid #E5CBA3", padding: 16, marginBottom: 24 }}>
        <p style={{ ...legalP, marginBottom: 0, color: "#8A5A1E" }}>
          <strong>Open legal question — data residency:</strong> Saudi Arabia's Personal Data Protection Law (PDPL) generally requires personal data of Saudi residents to be stored within the Kingdom unless a specific exemption is obtained. SADAAR's current database provider does not offer an in-Kingdom hosting region. This needs review by a qualified Saudi data protection lawyer before this policy — or the underlying infrastructure — can be considered compliant.
        </p>
      </div>

      <h2 style={legalH2}>1. What We Collect</h2>
      <p style={legalP}>When you place an order or create an account, we collect information you provide directly: your name, email address, phone number, and shipping address. If you create an account, we also store your order history, saved addresses, and wishlist. We do not collect or store your full payment card details — payments are processed directly by Moyasar, our payment provider. We also collect basic technical and usage information automatically as you browse (such as pages viewed, device and browser type, and approximate location), as described in section 6.</p>

      <h2 style={legalH2}>2. How We Use It</h2>
      <p style={legalP}>We use your information to process and fulfill orders, communicate with you about your orders (confirmations, shipping updates, support requests), operate your account if you create one, and improve the platform. We process your information to carry out the purchase you requested, to meet our legal obligations, and, for analytics, based on our legitimate interest in understanding how the platform is used. We do not sell your personal information to third parties.</p>

      <h2 style={legalH2}>3. Who We Share It With</h2>
      <p style={legalP}>We share the minimum information needed with: the brand fulfilling your order (name, shipping address, and order details for items they're shipping); Moyasar, to process payment; Resend, to deliver transactional emails (order confirmations, password resets); Google, which provides the analytics service described in section 6; and Sentry, which helps us detect and fix technical errors. We do not share your information with advertisers or data brokers.</p>

      <h2 style={legalH2}>4. Data Storage and Security</h2>
      <p style={legalP}>Your information is stored on infrastructure provided by our technology partners: Supabase (database), Railway (application server), and Vercel (website hosting). It is protected with industry-standard security practices, including encrypted connections and access controls. See the flagged note above regarding the location of that storage relative to PDPL requirements. If a security incident affects your personal data, we will notify the affected users and the relevant authorities as required by Saudi law.</p>

      <h2 style={legalH2}>5. How Long We Keep It</h2>
      <p style={legalP}>We keep order records for as long as needed to handle returns, resolve disputes, and meet our accounting and legal obligations. Account information is kept until you ask us to delete your account. When information is no longer needed, we delete it or anonymize it.</p>

      <h2 style={legalH2}>6. Your Rights</h2>
      <p style={legalP}>You may request access to, correction of, or deletion of your personal information by contacting us through the Contact page. We may need to keep certain order records where the law requires it. We will respond in accordance with applicable Saudi law.</p>

      <h2 style={legalH2}>7. Cookies, Local Storage, and Analytics</h2>
      <p style={legalP}>SADAAR uses your browser's local storage to remember your cart, wishlist (if not logged in), and language preference, so they are still there when you return. We use Google Analytics, which sets cookies, to understand how visitors use the site (for example which pages are viewed). This data is aggregated and is not used to identify you by name. You can block or delete cookies in your browser settings, though some parts of the site may then work less well. We do not use third-party advertising trackers.</p>

      <h2 style={legalH2}>8. Children's Privacy</h2>
      <p style={legalP}>SADAAR is not directed at children and is not knowingly used to collect information from children.</p>

      <h2 style={legalH2}>9. Changes to This Policy</h2>
      <p style={legalP}>We may update this policy from time to time. Material changes will be reflected by an updated "last updated" date above.</p>

      <h2 style={legalH2}>10. Contact</h2>
      <p style={legalP}>Questions about this policy, or requests regarding your personal information, can be sent through the Contact page or on WhatsApp at +966 55 522 6474.</p>
    </div>
  );
}
