import citiesData from "../data/cities.json";
import streetsData from "../data/streets.json";

export type Locality = {
  id: string;
  slug: string;
  he: string;
  en: string;
  streets: number;
};

export type LetterGroup<T> = { letter: string; items: T[] };

export const MIN_INDEXED_STREETS = 2;

const ENGLISH_NAMES: Record<string, string> = {
  "5000": "Tel Aviv-Yafo",
  "8300": "Rishon LeZion",
  "7900": "Petah Tikva",
  "7100": "Ashkelon",
  "2600": "Eilat",
  "6400": "Herzliya",
  "6900": "Kfar Saba",
  "1200": "Modi'in-Maccabim-Re'ut",
  "31": "Ofakim",
  "2610": "Beit Shemesh",
  "2640": "Rosh HaAyin",
  "6100": "Bnei Brak",
  "2720": "Tira",
  "2630": "Kiryat Gat",
  "2650": "Ramat HaSharon",
  "9700": "Hod HaSharon",
  "654": "Kafr Qara",
  "1031": "Sderot",
  "531": "Arraba",
  "6800": "Kiryat Ata",
  "7200": "Ness Ziona",
  "542": "Reineh",
  "9100": "Nahariya",
  "8000": "Safed",
  "534": "Isfiya",
  "1139": "Karmiel",
  "9200": "Beit She'an",
  "9300": "Zikhron Ya'akov",
  "195": "Kadima-Tzoran",
  "874": "Migdal HaEmek",
  "2800": "Kiryat Shmona",
  "9500": "Kiryat Bialik",
  "8200": "Kiryat Motzkin",
  "9600": "Kiryat Yam",
  "2620": "Kiryat Ono",
  "1034": "Kiryat Malakhi",
  "6300": "Givatayim",
  "3616": "Ma'ale Adumim",
  "240": "Yokneam Illit",
  "2100": "Tirat Carmel",
  "1020": "Or Akiva",
  "1309": "Elad",
  "3780": "Beitar Illit",
  "3797": "Modi'in Illit",
  "168": "Kfar Yona",
  "229": "Ganei Tikva",
  "1015": "Mevaseret Zion",
  "9400": "Yehud-Monosson",
  "3570": "Ariel",
  "2530": "Be'er Ya'akov",
  "4100": "Katzrin",
  "681": "Giv'at Shmuel",
  "3611": "Kiryat Arba",
  "26": "Rosh Pina",
  "99": "Mitzpe Ramon",
  "469": "Kiryat Ekron",
  "1263": "Kfar Vradim",
  "634": "Kafr Qasim",
  "3640": "Karnei Shomron",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cleanEnglish = (value: string) =>
  value
    .replace(/\s*\($/, "")
    .replace(/\s*-\s*/g, "-")
    .trim();

const streetsByCity = new Map<string, [string, string][]>();
for (const [cityId, id, name] of streetsData as string[][]) {
  let list = streetsByCity.get(cityId);
  if (!list) streetsByCity.set(cityId, (list = []));
  list.push([id, name]);
}

const draft = (citiesData as string[][])
  .filter(([id]) => streetsByCity.has(id))
  .map(([id, he, en]) => {
    const english = ENGLISH_NAMES[id] ?? (en ? cleanEnglish(en) : "");
    return {
      id,
      he,
      en: english || he,
      base: slugify(english),
      streets: streetsByCity.get(id)!.length,
    };
  });

const slugCounts = new Map<string, number>();
for (const { base } of draft)
  slugCounts.set(base, (slugCounts.get(base) ?? 0) + 1);

const all: Locality[] = draft
  .map(({ base, ...rest }) => ({
    ...rest,
    slug: !base
      ? rest.id
      : slugCounts.get(base)! > 1
        ? `${base}-${rest.id}`
        : base,
  }))
  .sort((a, b) => a.he.localeCompare(b.he, "he"));

const bySlug = new Map(all.map((locality) => [locality.slug, locality]));

export function getLocalities(): Locality[] {
  return all;
}

export function getLocalityBySlug(slug: string): Locality | undefined {
  return bySlug.get(slug);
}

export function isIndexable(locality: Locality) {
  return locality.streets >= MIN_INDEXED_STREETS;
}

export function getPopularLocalities(limit: number): Locality[] {
  return [...all].sort((a, b) => b.streets - a.streets).slice(0, limit);
}

export function localityName(locality: Locality, locale: string) {
  return locale === "en" ? locality.en : locality.he;
}

const OTHER = "#";

function initial(value: string) {
  const first = value.trim().charAt(0).toUpperCase();
  return /[A-Zא-ת]/.test(first) ? first : OTHER;
}

export function groupByInitial<T>(
  items: T[],
  label: (item: T) => string,
  locale: string,
): LetterGroup<T>[] {
  const groups = new Map<string, T[]>();
  const sorted = [...items].sort((a, b) =>
    label(a).localeCompare(label(b), locale),
  );
  for (const item of sorted) {
    const letter = initial(label(item));
    let group = groups.get(letter);
    if (!group) groups.set(letter, (group = []));
    group.push(item);
  }
  return [...groups]
    .sort(([a], [b]) => Number(a === OTHER) - Number(b === OTHER))
    .map(([letter, groupItems]) => ({ letter, items: groupItems }));
}

export function getStreetGroups(cityId: string) {
  return groupByInitial(
    streetsByCity.get(cityId) ?? [],
    ([, name]) => name,
    "he",
  );
}
