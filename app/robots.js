const BASE_URL = "https://sadaar.com";

// Next.js's built-in convention: this file automatically becomes the real
// /robots.txt route. Personal/transactional pages (cart, checkout, account)
// are excluded — there's no SEO value in indexing them, and it's more
// privacy-conscious not to.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/account", "/wishlist", "/track-order"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
