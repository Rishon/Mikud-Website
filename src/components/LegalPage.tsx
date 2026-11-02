import Link from "next/link";
import type { ReactNode } from "react";
import Layout from "@/components/Layout";
import Markdown from "@/components/Markdown";
import type { Document } from "@/server/markdown";
import { useT } from "@/i18n";

const LegalPage = ({
  doc,
  children,
}: {
  doc: Document;
  children?: ReactNode;
}) => {
  const { t } = useT();

  return (
    <Layout title={doc.title} description={doc.description}>
      <main className="flex-1 px-4 py-12">
        <article className="mx-auto max-w-3xl bg-white rounded-lg border border-mikud-navy p-6 md:p-10 text-mikud-navy font-ibm-regular">
          <h1 className="text-3xl md:text-4xl font-ibm-bold mb-2">
            {doc.title}
          </h1>
          {doc.updated && (
            <p className="text-sm text-mikud-navy/60 mb-6">
              {t.lastUpdated} {doc.updated}
            </p>
          )}
          <Markdown blocks={doc.blocks} />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {children}
            <Link href="/" className="underline underline-offset-2">
              {t.backHome}
            </Link>
          </div>
        </article>
      </main>
    </Layout>
  );
};

export default LegalPage;
