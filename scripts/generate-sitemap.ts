import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCALES } from "../src/i18n";
import { SITE_URL, localizedUrl } from "../src/config/site";

const PUBLIC = join(import.meta.dirname, "..", "public");
const PATHS = [
  { path: "/", priority: "1", changefreq: "weekly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];
const lastmod = new Date().toISOString();

const urls = PATHS.flatMap(({ path, priority, changefreq }) =>
  LOCALES.map(
    (l) =>
      `<url><loc>${localizedUrl(l, path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`,
  ),
).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;

const robots = `# *
User-agent: *
Allow: /
Disallow: /api/

# Host
Host: ${SITE_URL}

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
`;

await writeFile(join(PUBLIC, "sitemap.xml"), sitemap);
await writeFile(join(PUBLIC, "robots.txt"), robots);
console.log(`wrote public/sitemap.xml and public/robots.txt for ${SITE_URL}`);
