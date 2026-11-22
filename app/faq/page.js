import Link from "next/link";
import { C } from "../../lib/constants";
import { FAQItem } from "../../components/FAQItem";

export const metadata = {
  title: "FAQ — SADAAR",
  description: "Answers to common questions about shopping, shipping, returns, and selling on SADAAR.",
};

const legalH1 = { fontFamily: "Fraunces, serif", fontSize: 26, color: C.ink, marginBottom: 8 };
const legalMeta = { fontFamily: "Inter, sans-serif", fontSize: 12, color: C.muted, marginBottom: 24 };

const faqs = [
  { q: "How does SADAAR work?", a: "SADAAR is a marketplace for independent Saudi fashion brands. Each brand keeps full ownership of their inventory and ships orders themselves — SADAAR provides the storefront, checkout, and customer support so you can shop many brands in one place." },
  { q: "How is shipping calculated?", a: "Shipping is charged per brand — SAR 25 per brand shipment, free once that brand's items in your order total SAR 300 or more. If your order includes items from two brands, you'll see two shipping charges (unless one or both qualify for free shipping)." },
  { q: "How long does delivery take?", a: "Estimated delivery is 3–5 business days from when a brand ships your order. Each brand fulfills independently, so items from different brands in the same order may arrive separately." },
  { q: "Can I cancel or return an order?", a: "Before shipping: you can request a cancellation for any item that hasn't shipped yet, from the Track Order page. Once the brand approves it, you'll be refunded to your original payment method. After delivery: you can return an unused item in its original condition and packaging within 7 days of receiving it. Contact us with your order number to start a return. Refunds are issued to your original payment method within 7 business days of the brand receiving the item. See our Terms of Service for full details." },
  { q: "What payment methods are accepted?", a: "Payments are processed securely through Moyasar, supporting major credit and debit cards. SADAAR never sees or stores your full card details." },
  { q: "Do I need an account to order?", a: "No — guest checkout is always available. Creating a free account lets you save addresses, sync your wishlist across devices, and see your full order history in one place." },
  { q: "How do I track my order?", a: "Use the Track Order page with your order number and the email or phone number you used at checkout — or, if you have an account, your full order history is available under My Account." },
  { q: "How do discount codes work?", a: "Enter a valid code at checkout to see the discount applied to your order total before payment. Codes may have a minimum order amount, an expiry date, or a limited number of uses." },
  { q: "I'm a designer — how do I sell on SADAAR?", a: "Use the \"Apply to sell\" link in the footer to submit your brand for review. Our team reviews every application personally, usually within a few business days." },
  { q: "Does SADAAR ship outside Saudi Arabia?", a: "Not at this time — SADAAR currently serves customers within Saudi Arabia only." },
];

export default function FAQPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 64px" }}>
      <h1 style={legalH1}>Frequently Asked Questions</h1>
      <p style={legalMeta}>Can't find what you're looking for? <Link href="/contact" style={{ color: C.bronze, textDecoration: "underline" }}>Contact us</Link> and we'll help directly.</p>
      <div>
        {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
      </div>
    </div>
  );
}
