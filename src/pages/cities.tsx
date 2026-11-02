import type { GetStaticProps } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout, { type Breadcrumb } from "@/components/Layout";
import { DEFAULT_LOCALE, isLocale, useT } from "@/i18n";
import {
  getLocalities,
  groupByInitial,
  localityName,
  type LetterGroup,
} from "@/server/localities";

type CityItem = [slug: string, name: string];
type Props = { groups: LetterGroup<CityItem>[] };

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const current = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const items = getLocalities().map(
    (locality): CityItem => [locality.slug, localityName(locality, current)],
  );
  return {
    props: { groups: groupByInitial(items, ([, name]) => name, current) },
  };
};

export default function Cities({ groups }: Props) {
  const { t } = useT();
  const breadcrumbs: Breadcrumb[] = [
    { name: t.home, path: "/" },
    { name: t.citiesHeading, path: "/cities" },
  ];

  return (
    <Layout
      title={t.citiesTitle}
      description={t.citiesDescription}
      breadcrumbs={breadcrumbs}
    >
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-5xl text-mikud-navy font-ibm-regular">
          <Breadcrumbs items={breadcrumbs} />

          <h1 className="text-4xl md:text-5xl font-ibm-bold mb-3">
            {t.citiesHeading}
          </h1>
          <p className="text-lg mb-8 leading-relaxed">{t.citiesIntro}</p>

          <nav
            aria-label={t.citiesHeading}
            className="flex flex-wrap gap-2 mb-8"
          >
            {groups.map((group) => (
              <a
                key={group.letter}
                href={`#letter-${group.letter}`}
                className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white border border-mikud-navy/20 hover:border-mikud-purple hover:text-mikud-purple"
              >
                {group.letter}
              </a>
            ))}
          </nav>

          {groups.map((group) => (
            <section
              key={group.letter}
              id={`letter-${group.letter}`}
              className="mb-8 scroll-mt-4"
            >
              <h2 className="text-xl font-ibm-bold border-b border-mikud-navy/20 mb-3">
                {group.letter}
              </h2>
              <ul className="columns-2 md:columns-4 gap-6 [&_a]:inline-block [&_a]:py-0.5 [&_a:hover]:text-mikud-purple [&_a:hover]:underline">
                {group.items.map(([slug, name]) => (
                  <li key={slug}>
                    <Link href={`/city/${slug}`} prefetch={false}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
