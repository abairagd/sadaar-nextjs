"use client";

import { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = "G-RZ5HVB6SRS";

function trackPageview(url) {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
  }
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    trackPageview(url);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}
