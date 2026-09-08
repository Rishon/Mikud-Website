import citiesData from "@/data/cities.json";
import streetsData from "@/data/streets.json";
import {
  KIND_PRIMARY,
  KIND_WORD,
  buildKeys,
  hebrewSkeletons,
  latinSkeletons,
  matchRank,
  normalizeText,
  parseQuery,
  rankKeys,
  wordStarts,
  type Key,
  type Query,
  type SearchKeys,
} from "./textSearch";
import { englishLabel, romanize } from "./romanize";

export type City = { id: string; n: string; en: string };
export type Street = { id: string; n: string; en?: string };

type CityEntry = City & { keys: SearchKeys; english: Key[]; size: number };
type StreetEntry = Street & { names: string[]; keys?: SearchKeys };

const englishKeys = (en: string): Key[] => {
  const normalized = en
    .toLowerCase()
    .replace(/-+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return wordStarts(normalized).map((text, index) => ({
    text,
    kind: index === 0 ? KIND_PRIMARY : KIND_WORD,
  }));
};

const streetsByCity = new Map<string, StreetEntry[]>();
for (const [cityId, id, ...names] of streetsData as string[][]) {
  let list = streetsByCity.get(cityId);
  if (!list) streetsByCity.set(cityId, (list = []));
  list.push({ id, n: names[0], names });
}

const cities: CityEntry[] = (citiesData as string[][]).map(([id, n, en]) => ({
  id,
  n,
  en,
  keys: buildKeys([n]),
  english: en ? englishKeys(en) : [],
  size: streetsByCity.get(id)?.length ?? 0,
}));
const cityById = new Map(cities.map((city) => [city.id, city]));

function streetKeys(street: StreetEntry): SearchKeys {
  return (street.keys ??= buildKeys(street.names));
}

export function getCity(id: string) {
  return cityById.get(id);
}

export function getStreet(cityId: string, id: string) {
  return streetsByCity.get(cityId)?.find((street) => street.id === id);
}

export function searchCities(rawQuery: string, limit = 8): City[] {
  const query = parseQuery(rawQuery);
  if (!query || query.text.length < 2) return [];

  const ranked: { rank: number; city: CityEntry }[] = [];
  for (const city of cities) {
    let rank = query.hebrew ? -1 : rankKeys(city.english, [query.text]);
    if (rank < 0) {
      const skeletonRank = matchRank(city.keys, query);
      if (skeletonRank >= 0) rank = skeletonRank + 10;
    }
    if (rank >= 0) ranked.push({ rank, city });
  }

  return ranked
    .sort((a, b) => a.rank - b.rank || b.city.size - a.city.size)
    .slice(0, limit)
    .map(({ city }) => ({ id: city.id, n: city.n, en: city.en }));
}

function labelFor(street: StreetEntry, query: Query): string {
  const words = normalizeText(street.n).split(" ");
  const typed = query.text.split(" ");
  let start = -1;
  for (let i = 0; i < words.length && start < 0; i++) {
    const keys = hebrewSkeletons(words.slice(i).join(" "));
    if (keys.some((k) => query.skeletons.some((q) => k.startsWith(q))))
      start = i;
  }
  if (start < 0) return romanize(street.n);
  let matched = 0;
  for (let i = 0; i < typed.length && start + i < words.length; i++) {
    const wordKeys = hebrewSkeletons(words[start + i]);
    const typedKeys = latinSkeletons(typed[i], 0);
    if (typedKeys.some((t) => wordKeys.includes(t))) matched += 1;
    else break;
  }
  return englishLabel(street.n, typed, start, matched);
}

export function searchStreets(
  cityId: string,
  rawQuery: string,
  limit = 8,
): Street[] {
  const list = streetsByCity.get(cityId);
  const query = parseQuery(rawQuery);
  if (!list || !query || (!query.hebrew && query.skeletons.length === 0)) {
    return [];
  }

  const ranked: { rank: number; street: StreetEntry }[] = [];
  for (const street of list) {
    const rank = matchRank(streetKeys(street), query);
    if (rank >= 0) ranked.push({ rank, street });
  }

  return ranked
    .sort((a, b) => a.rank - b.rank || a.street.n.length - b.street.n.length)
    .slice(0, limit)
    .map(({ street }) =>
      query.hebrew
        ? { id: street.id, n: street.n }
        : { id: street.id, n: street.n, en: labelFor(street, query) },
    );
}
