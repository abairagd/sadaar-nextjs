import { cookies } from "next/headers";
import { Suspense } from "react";
import { LangProvider } from "../lib/LangContext";
import { CustomerAuthProvider } from "../lib/CustomerAuthContext";
import { WishlistProvider } from "../lib/WishlistContext";
import { CartProvider } from "../lib/CartContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FONTS, C } from "../lib/constants";

export const metadata = {
  title: "SADAAR — Home of Saudi Fashion",
  description: "A curated marketplace for independent Saudi fashion brands. Every piece shipped and stood behind by the brand that made it.",
  metadataBase: new URL("https://sadaar.com"),
  openGraph: {
    title: "SADAAR — Home of Saudi Fashion",
    description: "A curated marketplace for independent Saudi fashion brands.",
    url: "https://sadaar.com",
    siteName: "SADAAR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const initialLang = cookieStore.get("sadaar_lang")?.value === "ar" ? "ar" : "en";

  return (
    <html lang={initialLang} dir={initialLang === "ar" ? "rtl" : "ltr"}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: FONTS }} />
      </head>
      <body style={{ margin: 0, background: C.sand }}>
        <LangProvider initialLang={initialLang}>
          <CustomerAuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Suspense fallback={null}>
                  <Header />
                </Suspense>
                {children}
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </CustomerAuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
