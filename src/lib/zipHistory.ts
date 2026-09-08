import { useSyncExternalStore } from "react";

export type RecentZipCode = {
  city: string;
  streetAddress: string;
  houseNumber: string;
  entranceNumber: string;
  zipCode: string;
};

const STORAGE_KEY = "mikudData";
const CHANGE_EVENT = "mikud:recent-changed";
export const MAX_RECENT = 5;

const EMPTY: RecentZipCode[] = [];
let cachedRaw: string | null = null;
let cachedList: RecentZipCode[] = EMPTY;

function parse(raw: string | null): RecentZipCode[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.zipCode === "string")
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function readRecentZipCodes(): RecentZipCode[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw);
  }
  return cachedList;
}

function writeRecentZipCodes(list: RecentZipCode[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveRecentZipCode(entry: RecentZipCode) {
  const entryJson = JSON.stringify(entry);
  const current = readRecentZipCodes();
  if (current.some((item) => JSON.stringify(item) === entryJson)) return;
  writeRecentZipCodes([...current.slice(-(MAX_RECENT - 1)), entry]);
}

export function removeRecentZipCode(index: number) {
  writeRecentZipCodes(readRecentZipCodes().filter((_, i) => i !== index));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useRecentZipCodes(): RecentZipCode[] {
  return useSyncExternalStore(subscribe, readRecentZipCodes, () => EMPTY);
}
