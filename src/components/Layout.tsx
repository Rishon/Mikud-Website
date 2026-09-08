import Head from "next/head";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { LOCALES, dictionaries, useT } from "@/i18n";
import { SITE_URL, localizedUrl } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

type LayoutProps = Readonly<{
  children: React.ReactNode;
  title?: string;
  description?: string;
  noindex?: boolean;
}>;

const RootLayout = ({ children, title, description, noindex }: LayoutProps) => {
  const { t, locale } = useT();
  const router = useRouter();
  const path = router.asPath.split(/[?#]/)[0] || "/";
  const canonical = localizedUrl(locale, path);
  const otherLocale = locale === "he" ? "en" : "he";
  const isHome = !title;
  const pageTitle = title ? `${title} | ${t.siteName}` : t.title;
  const pageDescription = description ?? t.description;
  const ogImage = `${SITE_URL}/og-${locale}.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${localizedUrl("he")}/#website`,
        url: localizedUrl("he"),
        name: t.siteName,
        description: t.description,
        inLanguage: LOCALES,
      },
      isHome
        ? {
            "@type": "WebApplication",
            "@id": `${canonical}#app`,
            url: canonical,
            name: t.title,
            description: t.description,
            inLanguage: locale,
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            browserRequirements: "Requires JavaScript",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
            areaServed: { "@type": "Country", name: "Israel" },
          }
        : {
            "@type": "WebPage",
            "@id": `${canonical}#page`,
            url: canonical,
            name: pageTitle,
            description: pageDescription,
            inLanguage: locale,
            isPartOf: { "@id": `${localizedUrl("he")}/#website` },
          },
    ],
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {isHome && <meta name="keywords" content={t.keywords} />}
        <meta
          name="robots"
          content={
            noindex
              ? "noindex, follow"
              : "index, follow, max-snippet:-1, max-image-preview:large"
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#05071a" />
        <meta name="application-name" content={t.siteName} />
        <meta name="apple-mobile-web-app-title" content={t.siteName} />

        <link rel="canonical" href={canonical} />
        {LOCALES.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={localizedUrl(l, path)}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={localizedUrl("he", path)}
        />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={t.siteName} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:locale" content={t.ogLocale} />
        <meta
          property="og:locale:alternate"
          content={dictionaries[otherLocale].ogLocale}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t.title} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={t.title} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div
        className={`${inter.className} min-h-screen flex flex-col bg-mikud-bg`}
      >
        {children}
        <Footer />
      </div>
      <CookieBanner />
    </>
  );
};

export default RootLayout;
