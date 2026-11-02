import type { GetStaticProps } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import Markdown from "@/components/Markdown";
import ZipLookup from "@/components/ZipLookup";
import { DEFAULT_LOCALE, format, isLocale, useT } from "@/i18n";
import { loadDocument, type Document } from "@/server/markdown";
import { getPopularLocalities, localityName } from "@/server/localities";

type CityLink = { slug: string; name: string };
type Props = { about: Document; popular: CityLink[] };

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const current = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return {
    props: {
      about: loadDocument("home", "about", current),
      popular: getPopularLocalities(16).map((locality) => ({
        slug: locality.slug,
        name: localityName(locality, current),
      })),
    },
  };
};

export default function Home({ about, popular }: Props) {
  const { t } = useT();

  return (
    <Layout>
      <main className="flex-1 flex flex-col">
        <ZipLookup heading={t.heading} subheading={t.subheading} />

        <div className="h-16 bg-mikud-purple w-full" />

        <section className="px-4 py-12">
          <div className="mx-auto max-w-3xl text-mikud-navy font-ibm-regular">
            <h2 className="text-2xl md:text-3xl font-ibm-bold mb-2">
              {about.title}
            </h2>
            <Markdown blocks={about.blocks} />

            <h2 className="text-2xl md:text-3xl font-ibm-bold mt-10 mb-4">
              {t.popularCitiesTitle}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {popular.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/city/${city.slug}`}
                    className="block rounded-lg bg-white border border-mikud-navy/20 px-3 py-2 hover:border-mikud-purple hover:text-mikud-purple transition-colors"
                  >
                    {format(t.cityHeading, { city: city.name })}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/cities"
              className="underline underline-offset-2 hover:text-mikud-purple"
            >
              {t.allCities}
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
