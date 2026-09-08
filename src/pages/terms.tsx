import type { GetStaticProps } from "next";
import LegalPage from "@/components/LegalPage";
import dataMeta from "@/data/meta.json";
import { DEFAULT_LOCALE, isLocale } from "@/i18n";
import { loadDocument, type Document } from "@/server/markdown";

type Props = { doc: Document };

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => ({
  props: {
    doc: loadDocument(
      "legal",
      "terms",
      isLocale(locale) ? locale : DEFAULT_LOCALE,
      {
        dataUpdated: dataMeta.updated,
        dataSource: dataMeta.source,
        datasetNames: dataMeta.datasets.map((d) => d.name).join(", "),
      },
    ),
  },
});

export default function Terms({ doc }: Props) {
  return <LegalPage doc={doc} />;
}
