import { useRouter } from "next/router";
import he from "./he.json";
import en from "./en.json";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./locales";

export type Dictionary = typeof he;
export const dictionaries: Record<Locale, Dictionary> = { he, en };

export function format(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function useT() {
  const { locale } = useRouter();
  const current = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { t: dictionaries[current], locale: current };
}
