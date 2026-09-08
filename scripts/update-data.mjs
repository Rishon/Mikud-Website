import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
);
const API = "https://data.gov.il/api/3/action/datastore_search";
const RESOURCES = {
  cities: "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba",
  streets: "9ad3862c-8391-4b2f-84a4-2d4c68625f4b",
  synonyms: "bf185c7f-1a4e-4662-88c5-fa118a244bda",
};
const PAGE = 32000;

async function fetchAll(resourceId) {
  const records = [];
  for (let offset = 0; ; offset += PAGE) {
    const url = `${API}?resource_id=${resourceId}&limit=${PAGE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mikud/1.0 (+https://github.com/Rishon/Mikud-Website)",
      },
    });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    const page = (await res.json()).result.records;
    records.push(...page);
    if (page.length < PAGE) return records;
  }
}

const clean = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
const code = (value) => String(Number(value));

function titleCase(name) {
  return name
    .toLowerCase()
    .replace(/(^|[\s\-(])\p{L}/gu, (m) => m.toUpperCase());
}

const [cityRows, streetRows, synonymRows] = await Promise.all([
  fetchAll(RESOURCES.cities),
  fetchAll(RESOURCES.streets),
  fetchAll(RESOURCES.synonyms),
]);

const cities = cityRows
  .map((r) => [
    code(r["סמל_ישוב"]),
    clean(r["שם_ישוב"]),
    titleCase(clean(r["שם_ישוב_לועזי"])),
  ])
  .filter(([, he]) => he)
  .sort((a, b) => a[1].localeCompare(b[1], "he"));
const citySyms = new Set(cities.map(([sym]) => sym));

const streets = new Map();
for (const r of streetRows) {
  const city = code(r["סמל_ישוב"]);
  const street = code(r["סמל_רחוב"]);
  const name = clean(r["שם_רחוב"]);
  if (!citySyms.has(city) || !name) continue;
  streets.set(`${city}:${street}`, { city, street, name, synonyms: new Set() });
}

let synonymsAdded = 0;
for (const r of synonymRows) {
  const entry = streets.get(
    `${code(r.city_code)}:${code(r.official_code ?? r.street_code)}`,
  );
  const name = clean(r.street_name);
  if (!entry || !name || name === entry.name || /^רח\s*\d+$/.test(name))
    continue;
  entry.synonyms.add(name);
  synonymsAdded += 1;
}

const streetList = [...streets.values()]
  .sort(
    (a, b) =>
      a.city.localeCompare(b.city) || a.name.localeCompare(b.name, "he"),
  )
  .map(({ city, street, name, synonyms }) => [city, street, name, ...synonyms]);

const meta = {
  source: "data.gov.il",
  updated: new Date().toISOString().slice(0, 10),
  datasets: [
    { name: "רשימת ישובים", id: RESOURCES.cities },
    { name: "רשימת רחובות בישראל", id: RESOURCES.streets },
    {
      name: "רשימת רחובות בישראל - קובץ עם סינונימיים",
      id: RESOURCES.synonyms,
    },
  ],
};

await mkdir(OUT_DIR, { recursive: true });
await writeFile(join(OUT_DIR, "cities.json"), JSON.stringify(cities));
await writeFile(join(OUT_DIR, "streets.json"), JSON.stringify(streetList));
await writeFile(
  join(OUT_DIR, "meta.json"),
  JSON.stringify(meta, null, 2) + "\n",
);

console.log(`cities: ${cities.length}`);
console.log(`streets: ${streetList.length} (synonyms: ${synonymsAdded})`);
console.log(`written to ${OUT_DIR}`);
