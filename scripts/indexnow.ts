import { env } from "node:process";

const SITE_URL = (env.SITE_URL ?? "").replace(/\/+$/, "");
const KEY = env.INDEXNOW_KEY ?? "";
const SINCE = env.SINCE ? Date.parse(env.SINCE) : NaN;
const BATCH_SIZE = 10000;

if (!SITE_URL || !KEY)
  throw new Error("SITE_URL and INDEXNOW_KEY are required");

const response = await fetch(`${SITE_URL}/sitemap.xml`);
if (!response.ok)
  throw new Error(`sitemap.xml responded with ${response.status}`);
const xml = await response.text();

const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
  ([, body]) => ({
    loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
    lastmod: Date.parse(body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? ""),
  }),
);

const changed = entries
  .filter(
    ({ loc, lastmod }) => loc && (Number.isNaN(SINCE) || !(lastmod <= SINCE)),
  )
  .map(({ loc }) => loc.replace(/&amp;/g, "&"));

console.log(
  Number.isNaN(SINCE)
    ? `Submitting all ${changed.length} URLs`
    : `Submitting ${changed.length} of ${entries.length} URLs changed since ${new Date(SINCE).toISOString()}`,
);

const host = new URL(SITE_URL).host;
for (let i = 0; i < changed.length; i += BATCH_SIZE) {
  const result = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList: changed.slice(i, i + BATCH_SIZE),
    }),
  });
  console.log(`IndexNow responded with HTTP ${result.status}`);
  if (!result.ok && result.status !== 202) throw new Error(await result.text());
}
