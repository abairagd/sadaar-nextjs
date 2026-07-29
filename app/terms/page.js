import { C } from "../../lib/constants";

export const metadata = {
  title: "Terms of Service — SADAAR",
  description: "SADAAR's terms of service covering orders, payment, shipping, cancellations, and brand responsibilities.",
};

const legalH1 = { fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 8 };
const legalH2 = { fontFamily: "Fraunces, serif", fontSize: 17, color: C.ink, marginTop: 28, marginBottom: 8 };
const legalP = { fontFamily: "Inter, sans-serif", fontSize: 14, color: C.char, lineHeight: 1.7, marginBottom: 10 };
const legalMeta = { fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 24 };

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={legalH1}>Terms of Service</h1>
      <p style={legalMeta}>Last updated: July 2026. This is a starting draft prepared for SADAAR and has not yet been reviewed by a licensed attorney — it should be reviewed before being relied on as SADAAR's final, binding terms.</p>

      <h2 style={legalH2}>1. About SADAAR</h2>
      <p style={legalP}>SADAAR ("we," "us," "the platform") operates an online marketplace connecting customers with independent Saudi fashion brands ("brands," "sellers"). Each brand listed on SADAAR is an independent business that owns, lists, and fulfills its own products. SADAAR facilitates the storefront, checkout, and payment processing, and provides customer support, but is not the manufacturer or seller of record for products sold by brands on the platform.</p>

      <h2 style={legalH2}>2. Accounts</h2>
      <p style={legalP}>You may browse and purchase as a guest, or create a free account. If you create an account, you're responsible for keeping your login credentials secure and for all activity under your account. You must provide accurate information when creating an account or placing an order.</p>

      <h2 style={legalH2}>3. Orders and Payment</h2>
      <p style={legalP}>All prices are listed in Saudi Riyals (SAR) and are set independently by each brand. Placing an order is an offer to purchase, which SADAAR (on behalf of the relevant brand) may accept or decline — for example if an item is out of stock or pricing was listed in error. Payment is processed securely through Moyasar at the time of order. SADAAR does not store your full card details.</p>

      <h2 style={legalH2}>4. Shipping and Delivery</h2>
      <p style={legalP}>Each brand is responsible for fulfilling and shipping its own items. Shipping fees are calculated per brand and shown at checkout. Estimated delivery times are provided for guidance and are not guaranteed. If your order includes items from multiple brands, they may be shipped and delivered separately.</p>

      <h2 style={legalH2}>5. Cancellations and Refunds</h2>
      <p style={legalP}>You may request cancellation of any order item that has not yet shipped, through the Track Order page or your account's order history. The relevant brand reviews each request. If approved, the item's value is refunded to your original payment method; shipping charges are non-refundable for partial cancellations. Once an item has shipped, it can no longer be cancelled through the site — contact SADAAR support for help with returns or issues after delivery.</p>

      <h2 style={legalH2}>6. Discount Codes</h2>
      <p style={legalP}>Discount codes have no cash value, cannot be combined unless stated otherwise, and may be limited by minimum order value, expiry date, or number of uses. SADAAR reserves the right to deactivate a code or refuse its use in cases of suspected misuse.</p>

      <h2 style={legalH2}>7. Brands Selling on SADAAR</h2>
      <p style={legalP}>Brands approved to sell on SADAAR are independent businesses responsible for the accuracy of their product listings, the quality and legality of their products, and timely fulfillment of orders. SADAAR charges brands a commission on completed sales, as agreed at the time of onboarding. SADAAR reserves the right to suspend or remove a brand that violates these terms, misrepresents products, or fails to fulfill orders.</p>

      <h2 style={legalH2}>8. Acceptable Use</h2>
      <p style={legalP}>You agree not to use SADAAR for any unlawful purpose, to provide false information, to attempt to circumvent security measures, or to interfere with the platform's normal operation.</p>

      <h2 style={legalH2}>9. Limitation of Liability</h2>
      <p style={legalP}>SADAAR provides the marketplace platform "as is." To the fullest extent permitted by law, SADAAR is not liable for indirect, incidental, or consequential damages arising from your use of the platform, or from the acts or omissions of independent brands selling through it. Nothing in these terms limits liability that cannot be limited under applicable Saudi law.</p>

      <h2 style={legalH2}>10. Changes to These Terms</h2>
      <p style={legalP}>SADAAR may update these terms from time to time. Continued use of the platform after changes take effect constitutes acceptance of the updated terms.</p>

      <h2 style={legalH2}>11. Governing Law</h2>
      <p style={legalP}>These terms are governed by the laws of the Kingdom of Saudi Arabia.</p>

      <h2 style={legalH2}>12. Contact</h2>
      <p style={legalP}>Questions about these terms can be sent through the Contact page.</p>
    </div>
  );
}
