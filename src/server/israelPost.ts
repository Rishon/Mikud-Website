import { getCity, getStreet } from "./addressIndex";

const BASE_URL = "https://apimftprd.israelpost.co.il/mypost-zip";

// Public subscription key from Israel Post
const SUBSCRIPTION_KEY = "5ccb5b137e7444d885be752eda7f767a";

export async function postIsraelPost<T = any>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Israel Post ${path} responded with ${res.status}`);
  }
  return res.json();
}

export function createTtlCache<T>(ttlMs: number, maxEntries: number) {
  const store = new Map<string, { data: T; ts: number }>();
  return {
    get(key: string): T | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() - entry.ts > ttlMs) {
        store.delete(key);
        return null;
      }
      return entry.data;
    },
    set(key: string, data: T) {
      if (store.size >= maxEntries) store.delete(store.keys().next().value!);
      store.set(key, { data, ts: Date.now() });
    },
  };
}

const sameCode = (a: unknown, b: unknown) =>
  String(Number(a)) === String(Number(b));
const firstWord = (name: string) => name.split(/[\s\-(]/)[0];

type IsraelPostIds = { ipCityId: string; ipStreetId: string };

const cityIds = new Map<string, string>();
const streetIds = new Map<string, IsraelPostIds>();

async function findCity(startsWith: string, cityId: string, name: string) {
  const data = await postIsraelPost("GetCities", {
    CityStartsWith: startsWith,
  });
  const rows: any[] = data?.Result ?? [];
  return (
    rows.find((r) => sameCode(r.sym, cityId)) ?? rows.find((r) => r.n === name)
  );
}

async function findStreet(
  ipCityId: string,
  startsWith: string,
  streetId: string,
  name: string,
) {
  const data = await postIsraelPost("GetStreets", {
    CityID: ipCityId,
    CityName: "",
    SearchMode: "ID-StartsWith",
    StartsWith: startsWith,
  });
  const rows: any[] = data?.Result ?? [];
  return (
    rows.find((r) => sameCode(r.sym, streetId)) ??
    rows.find((r) => r.n === name)
  );
}

export async function resolveIsraelPostCityId(cityId: string) {
  const cached = cityIds.get(cityId);
  if (cached) return cached;
  const city = getCity(cityId);
  if (!city) return null;
  const match =
    (await findCity(city.n, cityId, city.n)) ??
    (await findCity(firstWord(city.n), cityId, city.n));
  if (!match) return null;
  cityIds.set(cityId, String(match.id));
  return String(match.id);
}

export async function resolveIsraelPostStreetId(
  cityId: string,
  streetId: string,
): Promise<IsraelPostIds | null> {
  const key = `${cityId}:${streetId}`;
  const cached = streetIds.get(key);
  if (cached) return cached;
  const street = getStreet(cityId, streetId);
  const ipCityId = await resolveIsraelPostCityId(cityId);
  if (!street || !ipCityId) return null;
  const match =
    (await findStreet(ipCityId, street.n, streetId, street.n)) ??
    (await findStreet(ipCityId, firstWord(street.n), streetId, street.n));
  if (!match) return null;
  const ids = { ipCityId, ipStreetId: String(match.id) };
  streetIds.set(key, ids);
  return ids;
}
