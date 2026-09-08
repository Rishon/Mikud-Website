import Link from "next/link";
import { setConsent, useConsent } from "@/lib/consent";
import { useT } from "@/i18n";

const CookieBanner = () => {
  const { t } = useT();
  const consent = useConsent();

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t.cookieTitle}
      className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-3xl rounded-2xl border border-white/60 bg-white/65 backdrop-blur-xl shadow-[0_8px_32px_rgba(16,16,87,0.18)] p-4 md:p-5 font-ibm-regular text-mikud-navy"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-sm leading-relaxed">
          <p className="font-ibm-bold text-base mb-1">{t.cookieTitle}</p>
          <p>
            {t.cookieText}{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              {t.privacyLink}
            </Link>
            <span className="mx-1">·</span>
            <Link href="/terms" className="underline underline-offset-2">
              {t.termsLink}
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className="h-9 px-4 rounded-lg border border-mikud-navy/30 bg-white/60 hover:bg-white transition-colors text-sm"
          >
            {t.cookieReject}
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="h-9 px-4 rounded-lg bg-mikud-purple text-white hover:opacity-90 transition-opacity text-sm"
          >
            {t.cookieAccept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
