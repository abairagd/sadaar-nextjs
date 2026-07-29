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
      <p style={legalMeta}>Last updated: July 2026. This is a starting draft prepared for SADAAR and has not yet been reviewed by a licensed attorney specializing in Saudi data protection law — see the flagged note below before relying on this as SADAAR's final policy.</p>

      <div style={{ background: "#F3E6D8", border: "1px solid #E5CBA3", padding: 16, marginBottom: 24 }}>
        <p style={{ ...legalP, marginBottom: 0, color: "#8A5A1E" }}>
          <strong>Open legal question — data residency:</strong> Saudi Arabia's Personal Data Protection Law (PDPL) generally requires personal data of Saudi residents to be stored within the Kingdom unless a specific exemption is obtained. SADAAR's current database provider does not offer an in-Kingdom hosting region. This needs review by a qualified Saudi data protection lawyer before this policy — or the underlying infrastructure — can be considered compliant.
        </p>
      </div>

      <h2 style={legalH2}>1. What We Collect</h2>
      <p style={legalP}>When you place an order or create an account, we collect information you provide directly: your name, email address, phone number, and shipping address. If you create an account, we also store your order history, saved addresses, and wishlist. We do not collect or store your full payment card details — payments are processed directly by Moyasar, our payment provider.</p>

      <h2 style={legalH2}>2. How We Use It</h2>
      <p style={legalP}>We use your information to process and fulfill orders, communicate with you about your orders (confirmations, shipping updates, support requests), operate your account if you create one, and improve the platform. We do not sell your personal information to third parties.</p>

      <h2 style={legalH2}>3. Who We Share It With</h2>
      <p style={legalP}>We share the minimum information needed with: the brand fulfilling your order (name, shipping address, and order details for items they're shipping); Moyasar, to process payment; and Resend, to deliver transactional emails (order confirmations, password resets). We do not share your information with advertisers or data brokers.</p>

      <h2 style={legalH2}>4. Data Storage and Security</h2>
      <p style={legalP}>Your information is stored on infrastructure provided by our technology partners and protected with industry-standard security practices, including encrypted connections and access controls. See the flagged note above regarding the location of that storage relative to PDPL requirements.</p>

      <h2 style={legalH2}>5. Your Rights</h2>
      <p style={legalP}>You may request access to, correction of, or deletion of your personal information by contacting us through the Contact page. We will respond in accordance with applicable Saudi law.</p>

      <h2 style={legalH2}>6. Cookies and Local Storage</h2>
      <p style={legalP}>SADAAR uses your browser's local storage to remember your cart, wishlist (if not logged in), and language preference. We do not use third-party advertising trackers.</p>

      <h2 style={legalH2}>7. Children's Privacy</h2>
      <p style={legalP}>SADAAR is not directed at children and is not knowingly used to collect information from children.</p>

      <h2 style={legalH2}>8. Changes to This Policy</h2>
      <p style={legalP}>We may update this policy from time to time. Material changes will be reflected by an updated "last updated" date above.</p>

      <h2 style={legalH2}>9. Contact</h2>
      <p style={legalP}>Questions about this policy, or requests regarding your personal information, can be sent through the Contact page.</p>
    </div>
  );
}
