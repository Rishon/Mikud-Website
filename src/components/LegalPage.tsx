import Link from "next/link";
import type { ReactNode } from "react";
import Layout from "@/components/Layout";
import type { Block, Document, Inline } from "@/server/markdown";
import { useT } from "@/i18n";

const renderInlines = (inlines: Inline[]) =>
  inlines.map((inline, index) => {
    if (inline.type === "strong")
      return <strong key={index}>{inline.text}</strong>;
    if (inline.type === "link") {
      const external = /^(https?:|mailto:)/.test(inline.href);
      return (
        <Link
          key={index}
          href={inline.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener" : undefined}
          className="underline underline-offset-2 hover:text-mikud-purple"
        >
          {inline.text}
        </Link>
      );
    }
    return inline.text;
  });

const renderBlock = (block: Block, index: number) => {
  if (block.type === "heading") {
    return (
      <h2 key={index} className="text-xl font-ibm-bold mt-6 mb-2">
        {block.text}
      </h2>
    );
  }
  if (block.type === "list") {
    return (
      <ul key={index} className="list-disc ps-6 mb-3 space-y-1 leading-relaxed">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInlines(item)}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={index} className="mb-3 leading-relaxed">
      {renderInlines(block.inlines)}
    </p>
  );
};

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
          {doc.blocks.map(renderBlock)}
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
