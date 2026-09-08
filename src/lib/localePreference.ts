import { isLocale, type Locale } from "@/i18n";

const STORAGE_KEY = "mikudLocale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function getStoredLocale(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {}
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}
