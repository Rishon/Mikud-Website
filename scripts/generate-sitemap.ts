import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCALES } from "../src/i18n";
import { SITE_URL, localizedUrl } from "../src/config/site";
import { getLocalities, isIndexable } from "../src/server/localities";

const ROOT = join(import.meta.dirname, "..");
const PUBLIC = join(ROOT, "public");

function lastModified(paths: string[]) {
  try {
    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", ...paths],
      {
        cwd: ROOT,
        encoding: "utf8",
      },
    ).trim();
    return date ? new Date(date).toISOString() : undefined;
  } catch {
    return undefined;
  }
}

const LOCALITY_SOURCES = [
  "src/pages/city",
  "src/server/localities.ts",
  "src/data/cities.json",
  "src/data/streets.json",
];

const pages = [
  {
    path: "/",
    lastmod: lastModified([
      "src/pages/index.tsx",
      "src/components/ZipLookup.tsx",
      "src/content/home",
    ]),
  },
  {
    path: "/cities",
    lastmod: lastModified(["src/pages/cities.tsx", "src/data/cities.json"]),
  },
  {
    path: "/privacy",
    lastmod: lastModified([
      "src/content/legal/privacy.he.md",
      "src/content/legal/privacy.en.md",
    ]),
  },
  {
    path: "/terms",
    lastmod: lastModified([
      "src/content/legal/terms.he.md",
      "src/content/legal/terms.en.md",
      "src/data/meta.json",
    ]),
  },
];

const localityLastmod = lastModified(LOCALITY_SOURCES);
for (const locality of getLocalities().filter(isIndexable))
  pages.push({ path: `/city/${locality.slug}`, lastmod: localityLastmod });

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const urls = pages.flatMap(({ path, lastmod }) => {
  const alternates = [
    ...LOCALES.map((l) => [l, localizedUrl(l, path)]),
    ["x-default", localizedUrl("he", path)],
  ]
    .map(
      ([hreflang, href]) =>
        `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
    )
    .join("");
  return LOCALES.map(
    (l) =>
      `<url><loc>${escapeXml(localizedUrl(l, path))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${alternates}</url>`,
  );
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

await writeFile(join(PUBLIC, "sitemap.xml"), sitemap);
await writeFile(join(PUBLIC, "robots.txt"), robots);
console.log(
  `wrote public/sitemap.xml (${urls.length} URLs) and public/robots.txt for ${SITE_URL}`,
);
