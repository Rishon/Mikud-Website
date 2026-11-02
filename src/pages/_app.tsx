import { AppProps } from "next/app";
import Script from "next/script";
import { ReactElement, useEffect, useRef } from "react";
import {
  ANALYTICS_ENABLED,
  CLARITY_PROJECT_ID,
  GA_MEASUREMENT_ID,
  revokeAnalytics,
} from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { getStoredLocale } from "@/lib/localePreference";
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
  const analyticsLoaded = useRef(false);

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
    if (consent === "accepted") analyticsLoaded.current = ANALYTICS_ENABLED;
    else if (consent === "rejected" && analyticsLoaded.current)
      revokeAnalytics();
  }, [consent]);

  return (
    <>
      {ANALYTICS_ENABLED && consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {allow_google_signals: false});`}
          </Script>
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
window.clarity('consentv2', {ad_Storage: 'denied', analytics_Storage: 'granted'});`}
          </Script>
        </>
      )}
      <Component {...pageProps} key={`${locale}:${router.route}`} />
    </>
  );
}
