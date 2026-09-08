import { Html, Head, Main, NextScript, DocumentProps } from "next/document";
import { dictionaries, isLocale, DEFAULT_LOCALE } from "@/i18n";

export default function Document(props: DocumentProps) {
  const locale = isLocale(props.locale) ? props.locale : DEFAULT_LOCALE;

  return (
    <Html lang={locale} dir={dictionaries[locale].dir}>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link
          rel="preload"
          href="/fonts/IBMPlexSansHebrew-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/IBMPlexSansHebrew-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
