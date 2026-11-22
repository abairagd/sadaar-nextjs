import { C } from "../../lib/constants";

export const metadata = {
  title: "Terms of Service — SADAAR",
  description: "SADAAR's terms of service covering orders, payment, shipping, cancellations, returns, refunds, and brand responsibilities.",
};

const legalH1 = { fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 8 };
const legalH2 = { fontFamily: "Fraunces, serif", fontSize: 17, color: C.ink, marginTop: 28, marginBottom: 8 };
const legalP = { fontFamily: "Inter, sans-serif", fontSize: 14, color: C.char, lineHeight: 1.7, marginBottom: 10 };
const legalMeta = { fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 24 };

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={legalH1}>Terms of Service</h1>
      <p style={legalMeta}>Last updated: November 2026. This document has not yet been reviewed by a licensed attorney and may be updated before SADAAR's formal launch.</p>

      <h2 style={legalH2}>1. About SADAAR</h2>
      <p style={legalP}>SADAAR ("we," "us," "the platform") operates an online marketplace connecting customers with independent Saudi fashion brands ("brands," "sellers"). Each brand listed on SADAAR is an independent business that owns, lists, and fulfills its own products. SADAAR provides the storefront, checkout, payment processing, and customer support, but is not the manufacturer of products sold by brands on the platform.</p>

      <h2 style={legalH2}>2. Accounts</h2>
      <p style={legalP}>You may browse and purchase as a guest, or create a free account. If you create an account, you're responsible for keeping your login credentials secure and for all activity under your account. You must provide accurate information when creating an account or placing an order.</p>

      <h2 style={legalH2}>3. Products and Pricing</h2>
      <p style={legalP}>Brands are responsible for the descriptions, sizes, photos, and prices of their products. Colours may appear slightly different on your screen than in person. All prices are in Saudi Riyals (SAR) and are set independently by each brand.</p>

      <h2 style={legalH2}>4. Orders and Payment</h2>
      <p style={legalP}>Placing an order is an offer to purchase, which SADAAR (on behalf of the relevant brand) may accept or decline — for example if an item is out of stock or a price was listed in error. If we decline an order after payment, you will be refunded in full to your original payment method. Payment is processed securely through Moyasar at the time of order. SADAAR does not store your full card details.</p>

      <h2 style={legalH2}>5. Shipping and Delivery</h2>
      <p style={legalP}>Each brand is responsible for fulfilling and shipping its own items. Shipping is charged per brand: SAR 25 per brand shipment, free when that brand's items in your order total SAR 300 or more. The fee is shown at checkout before you pay. SADAAR currently delivers within Saudi Arabia only.</p>
      <p style={legalP}>Estimated delivery is 3–5 business days from when a brand ships your order. This is an estimate, not a guarantee. If your order includes items from multiple brands, they may be shipped and delivered separately. If delivery of your order is delayed by more than 15 days, you may cancel the order and receive a full refund of the amount paid for the undelivered items.</p>

      <h2 style={legalH2}>6. Cancellations Before Shipping</h2>
      <p style={legalP}>You may request cancellation of any order item that has not yet shipped, through the Track Order page or your account's order history. The relevant brand reviews each request. If approved, the item's value is refunded to your original payment method. Shipping charges are not refunded when only part of an order is cancelled. Once an item has shipped, it can no longer be cancelled through the site; you may instead return it under section 7.</p>

      <h2 style={legalH2}>7. Returns and Refunds</h2>
      <p style={legalP}>In line with Saudi e-commerce regulations, you may return an item within 7 days of receiving it, for any reason, provided it is unused, undamaged, and in its original condition and packaging, with any tags attached. To start a return, contact SADAAR support (section 12) and tell us your order number and the item you wish to return.</p>
      <p style={legalP}>Items made or customised to your specific request, and any other category that Saudi law excludes from the right of return, cannot be returned unless they arrive defective or not as described.</p>
      <p style={legalP}>You are responsible for the cost of returning an item, unless it arrived defective, damaged, or different from what you ordered. In those cases SADAAR and the brand will cover the return, or arrange a replacement or refund, at your choice where available.</p>
      <p style={legalP}>Once the brand has received and checked the returned item, your refund is issued to your original payment method within 7 business days. Your bank may take additional time to show the refund. The original shipping fee is refunded only if the return is due to a defect, damage, or an error by the brand or SADAAR.</p>

      <h2 style={legalH2}>8. Discount Codes</h2>
      <p style={legalP}>Discount codes have no cash value, cannot be combined unless stated otherwise, and may be limited by minimum order value, expiry date, or number of uses. SADAAR reserves the right to deactivate a code or refuse its use in cases of suspected misuse. If you return an item bought with a code, the refund is the amount you actually paid for it.</p>

      <h2 style={legalH2}>9. Brands Selling on SADAAR</h2>
      <p style={legalP}>Brands approved to sell on SADAAR are independent businesses responsible for the accuracy of their product listings, the quality and legality of their products, timely fulfillment of orders, and honouring the cancellation, return, and refund rights in these terms. SADAAR charges brands a commission on completed sales, as agreed at the time of onboarding. SADAAR reserves the right to suspend or remove a brand that violates these terms, misrepresents products, or fails to fulfill orders.</p>

      <h2 style={legalH2}>10. Acceptable Use</h2>
      <p style={legalP}>You agree not to use SADAAR for any unlawful purpose, to provide false information, to attempt to circumvent security measures, or to interfere with the platform's normal operation. The SADAAR name, logo, and site design belong to SADAAR, and brands retain the rights to their own product names, photos, and designs. You may not copy or reuse them without permission.</p>

      <h2 style={legalH2}>11. Limitation of Liability</h2>
      <p style={legalP}>To the fullest extent permitted by law, SADAAR is not liable for indirect, incidental, or consequential damages arising from your use of the platform, or from the acts or omissions of independent brands selling through it. Nothing in these terms limits any right you have under Saudi consumer law, including your rights in respect of defective or misdescribed products, or any liability that cannot be limited under applicable Saudi law.</p>

      <h2 style={legalH2}>12. Contact, Complaints, and Disputes</h2>
      <p style={legalP}>For questions, returns, or complaints, contact SADAAR through the Contact page or on WhatsApp at +966 55 522 6474. We aim to respond within 2 business days. If you have a complaint, please contact us first so we can try to resolve it with you and the brand. This does not limit your right to raise a complaint with the Saudi Ministry of Commerce or to bring a claim before the competent courts of the Kingdom of Saudi Arabia.</p>

      <h2 style={legalH2}>13. Privacy</h2>
      <p style={legalP}>How we collect and use your personal data is described in our Privacy Policy.</p>

      <h2 style={legalH2}>14. Changes to These Terms</h2>
      <p style={legalP}>SADAAR may update these terms from time to time. The version in force when you place an order applies to that order. Continued use of the platform after changes take effect constitutes acceptance of the updated terms.</p>

      <h2 style={legalH2}>15. Governing Law</h2>
      <p style={legalP}>These terms are governed by the laws of the Kingdom of Saudi Arabia.</p>
    </div>
  );
}
