import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRef } from "react";
import type { AddressInputHandle } from "@/components/AddressInput";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout, { type Breadcrumb } from "@/components/Layout";
import ZipLookup from "@/components/ZipLookup";
import { trackEvent } from "@/lib/analytics";
import { DEFAULT_LOCALE, LOCALES, format, isLocale, useT } from "@/i18n";
import {
  getLocalities,
  getLocalityBySlug,
  getStreetGroups,
  isIndexable,
  localityName,
  type LetterGroup,
} from "@/server/localities";

const PREBUILT_MIN_STREETS = 20;

type StreetItem = [id: string, name: string];

type Props = {
  city: {
    id: string;
    slug: string;
    name: string;
    streets: number;
    indexable: boolean;
  };
  groups: LetterGroup<StreetItem>[];
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getLocalities()
    .filter((locality) => locality.streets >= PREBUILT_MIN_STREETS)
    .flatMap((locality) =>
      LOCALES.map((locale) => ({ params: { slug: locality.slug }, locale })),
    ),
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<Props, { slug: string }> = async ({
  params,
  locale,
}) => {
  const locality = params && getLocalityBySlug(params.slug);
  if (!locality) return { notFound: true };
  const current = isLocale(locale) ? locale : DEFAULT_LOCALE;

  return {
    props: {
      city: {
        id: locality.id,
        slug: locality.slug,
        name: localityName(locality, current),
        streets: locality.streets,
        indexable: isIndexable(locality),
      },
      groups: getStreetGroups(locality.id),
    },
  };
};

export default function CityPage({ city, groups }: Props) {
  const { t, locale } = useT();
  const lookup = useRef<AddressInputHandle>(null);
  const place = { id: city.id, label: city.name };
  const values = { city: city.name, count: city.streets };
  const breadcrumbs: Breadcrumb[] = [
    { name: t.home, path: "/" },
    { name: t.citiesHeading, path: "/cities" },
    { name: city.name, path: `/city/${city.slug}` },
  ];

  function pickStreet([id, name]: StreetItem) {
    lookup.current?.selectStreet(place, { id, label: name });
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackEvent("street_pick", { source: "city_page" });
  }

  return (
    <Layout
      title={format(t.cityTitle, values)}
      description={format(t.cityDescription, values)}
      noindex={!city.indexable}
      breadcrumbs={breadcrumbs}
    >
      <main className="flex-1 flex flex-col">
        <ZipLookup
          key={city.id}
          ref={lookup}
          heading={format(t.cityHeading, values)}
          subheading={t.citySubheading}
          initialCity={place}
        />

        <div className="h-16 bg-mikud-purple w-full" />

        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl text-mikud-navy font-ibm-regular">
            <Breadcrumbs items={breadcrumbs} />

            <h2 className="text-2xl md:text-3xl font-ibm-bold mb-2">
              {format(t.cityStreetsTitle, values)}
            </h2>
            <p className="mb-8 leading-relaxed">{t.cityStreetsIntro}</p>

            <div lang={locale === "he" ? undefined : "he"} dir="rtl">
              {groups.map((group) => (
                <div key={group.letter} className="mb-6">
                  <h3 className="text-lg font-ibm-bold border-b border-mikud-navy/20 mb-2">
                    {group.letter}
                  </h3>
                  <ul className="columns-2 md:columns-4 gap-6 text-sm [&_button]:py-0.5 [&_button]:text-start [&_button:hover]:text-mikud-purple [&_button:hover]:underline">
                    {group.items.map((street) => (
                      <li key={street[0]}>
                        <button
                          type="button"
                          onClick={() => pickStreet(street)}
                        >
                          {street[1]}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Link
              href="/cities"
              className="inline-block mt-4 underline underline-offset-2 hover:text-mikud-purple"
            >
              {t.allCities}
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
