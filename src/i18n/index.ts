import { useRouter } from "next/router";
import he from "./he.json";
import en from "./en.json";

export const LOCALES = ["he", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "he";

export type Dictionary = typeof he;
export const dictionaries: Record<Locale, Dictionary> = { he, en };

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

export function useT() {
  const { locale } = useRouter();
  const current = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return { t: dictionaries[current], locale: current };
}
