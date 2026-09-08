import Link from "next/link";
import Layout from "@/components/Layout";
import { useT } from "@/i18n";

export default function NotFound() {
  const { t } = useT();

  return (
    <Layout title={t.notFoundTitle} noindex>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center text-mikud-navy">
        <p className="text-8xl md:text-9xl font-ibm-bold text-mikud-purple leading-none">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-ibm-bold mt-6 mb-3">
          {t.notFoundTitle}
        </h1>
        <p className="text-lg md:text-xl font-ibm-regular text-mikud-navy/70 max-w-md mb-8">
          {t.notFoundText}
        </p>
        <Link
          href="/"
          className="h-10 px-6 inline-flex items-center rounded-lg bg-mikud-purple text-white font-ibm-regular hover:opacity-90 transition-opacity"
        >
          {t.backHome}
        </Link>
      </main>
    </Layout>
  );
}
