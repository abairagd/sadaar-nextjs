import { api } from "../lib/constants";

const BASE_URL = "https://sadaar.com";

// Next.js's built-in convention: this file automatically becomes the real
// /sitemap.xml route. Fetches every real product and brand so search engines
// can discover each individual page, not just the handful of static ones —
// this is genuinely the payoff of the SSR migration paying off for SEO.
export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/browse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  let productPages = [];
  try {
    const products = await api("/products");
    productPages = products.map((p) => ({
      url: `${BASE_URL}/product/${p.id}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // If the backend is briefly unreachable at build/request time, still
    // serve the static pages rather than failing the whole sitemap.
  }

  let brandPages = [];
  try {
    const brands = await api("/brands");
    brandPages = brands.map((b) => ({
      url: `${BASE_URL}/brand/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...productPages, ...brandPages];
}
