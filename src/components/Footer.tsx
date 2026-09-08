import Link from "next/link";
import { useRouter } from "next/router";
import { useT } from "@/i18n";
import { storeLocale } from "@/lib/localePreference";

const Footer = () => {
  const { t, locale } = useT();
  const router = useRouter();
  const path = router.asPath.split(/[?#]/)[0] || "/";
  const otherLocale = locale === "he" ? "en" : "he";

  return (
    <footer
      dir="ltr"
      className="bg-mikud-footer py-6 px-4 md:px-8 font-ibm-regular text-xs text-white/50 flex flex-col md:flex-row items-center justify-between gap-3"
    >
      <nav dir={t.dir} className="flex gap-3 md:min-w-40">
        <Link href="/privacy" className="hover:text-white/80 transition-colors">
          {t.privacyLink}
        </Link>
        <Link href="/terms" className="hover:text-white/80 transition-colors">
          {t.termsLink}
        </Link>
      </nav>
      <div dir={t.dir} className="text-center space-y-1">
        <p>
          {t.madeWithLove}{" "}
          <Link
            href="https://rishon.systems"
            target="_blank"
            rel="noopener"
            className="hover:text-white/80 transition-colors"
          >
            rishon.systems
          </Link>
        </p>
        <p className="text-white/35">
          {t.specialThanks}{" "}
          <Link
            href="https://israelpost.co.il"
            target="_blank"
            rel="noopener"
            className="hover:text-white/80 transition-colors"
          >
            {t.israelPost}
          </Link>
          <span className="mx-1.5">·</span>
          <Link
            href="https://data.gov.il"
            target="_blank"
            rel="noopener"
            className="hover:text-white/80 transition-colors"
          >
            {t.openData}
          </Link>
        </p>
      </div>
      <div className="md:min-w-40 flex justify-end">
        <Link
          href={path}
          locale={otherLocale}
          hrefLang={otherLocale}
          aria-label={t.switchLocaleAria}
          onClick={() => storeLocale(otherLocale)}
          className="hover:text-white/80 transition-colors"
        >
          {t.switchLocale}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
