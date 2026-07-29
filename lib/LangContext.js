"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { T, CATEGORY_LABELS, SUBCATEGORY_LABELS, PRODUCT_TYPE_LABELS } from "./translations";

const LANG_COOKIE = "sadaar_lang";

function readLangCookie() {
  if (typeof document === "undefined") return "en"; // SSR pass — falls back, then client corrects on mount
  const match = document.cookie.match(/(?:^|; )sadaar_lang=(en|ar)/);
  return match ? match[1] : "en";
}

function writeLangCookie(lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000`; // 1 year
}

const LangContext = createContext({
  lang: "en", t: T.en, dir: "ltr",
  categoryLabel: (c) => c, subcategoryLabel: (s) => s, productTypeLabel: (p) => p,
  toggleLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

// initialLang comes from the server (read from the cookie during SSR) so the
// very first paint is already in the right language — no flash of English
// before a client-side effect kicks in, which is the whole point of doing
// this via a cookie instead of localStorage like the old SPA did.
export function LangProvider({ initialLang, children }) {
  const [lang, setLang] = useState(initialLang || "en");
  const router = useRouter();

  // If a client navigates directly (no server round-trip), reconcile with
  // the cookie once mounted — covers the rare mismatch case.
  useEffect(() => {
    const cookieLang = readLangCookie();
    if (cookieLang !== lang) setLang(cookieLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "ar" : "en";
      writeLangCookie(next);
      return next;
    });
    // Server Components (Home, Browse, Product, Brand pages) render their
    // text using the cookie at request time — updating the cookie alone
    // doesn't make Next.js re-render already-rendered server content.
    // router.refresh() re-runs those Server Components with the fresh
    // cookie value, without losing client-side state like the cart.
    router.refresh();
  }, [router]);

  const value = useMemo(() => ({
    lang,
    t: T[lang],
    dir: lang === "ar" ? "rtl" : "ltr",
    categoryLabel: (c) => CATEGORY_LABELS[lang][c] || c,
    subcategoryLabel: (s) => SUBCATEGORY_LABELS[lang][s] || s,
    productTypeLabel: (p) => PRODUCT_TYPE_LABELS[lang][p] || p,
    toggleLang,
  }), [lang, toggleLang]);

  return (
    <LangContext.Provider value={value}>
      <div dir={value.dir} className={lang === "ar" ? "sadaar-rtl" : ""}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export { readLangCookie, LANG_COOKIE };