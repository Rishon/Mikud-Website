import type { Locale } from "@/i18n";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mikud.rishon.systems"
).replace(/\/+$/, "");

export function localizedUrl(locale: Locale, path = "/") {
  const prefix = locale === "he" ? "" : `/${locale}`;
  const suffix = path === "/" ? "" : path;
  return `${SITE_URL}${prefix}${suffix}` || `${SITE_URL}/`;
}
