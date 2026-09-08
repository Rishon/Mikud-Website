import type { GetStaticProps } from "next";
import LegalPage from "@/components/LegalPage";
import { resetConsent } from "@/lib/consent";
import { DEFAULT_LOCALE, isLocale, useT } from "@/i18n";
import { loadDocument, type Document } from "@/server/markdown";

type Props = { doc: Document };

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    doc: loadDocument(
      "legal",
      "privacy",
      isLocale(locale) ? locale : DEFAULT_LOCALE,
    ),
  },
});

export default function Privacy({ doc }: Props) {
  const { t } = useT();

  return (
    <LegalPage doc={doc}>
      <button
        type="button"
        onClick={resetConsent}
        className="h-9 px-4 rounded-lg bg-mikud-navy-glass text-mikud-navy text-sm hover:opacity-80 transition-opacity"
      >
        {t.cookieSettings}
      </button>
    </LegalPage>
  );
}
