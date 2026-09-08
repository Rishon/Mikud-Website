import { AppProps } from "next/app";
import Script from "next/script";
import { ReactElement, useEffect } from "react";
import {
  CLARITY_PROJECT_ID,
  GA_MEASUREMENT_ID,
  trackPageView,
} from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { getStoredLocale } from "@/lib/localePreference";
import { TURNSTILE_SCRIPT_URL, TURNSTILE_SITE_KEY } from "@/lib/turnstile";
import { DEFAULT_LOCALE, dictionaries, isLocale } from "@/i18n";

// Styles
import "@/styles/globals.css";

export default function MyApp({
  Component,
  pageProps,
  router,
}: AppProps): ReactElement {
  const locale = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE;
  const consent = useConsent();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dictionaries[locale].dir;
  }, [locale]);

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored && stored !== locale) {
      router.replace(router.asPath, undefined, { locale: stored });
    }
  }, [locale, router]);

  useEffect(() => {
    router.events.on("routeChangeComplete", trackPageView);
    return () => router.events.off("routeChangeComplete", trackPageView);
  }, [router.events]);

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src={TURNSTILE_SCRIPT_URL} strategy="afterInteractive" />
      )}
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
          </Script>
        </>
      )}
      <Component {...pageProps} key={`${locale}:${router.route}`} />
    </>
  );
}
