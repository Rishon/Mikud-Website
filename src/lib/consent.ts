import { useSyncExternalStore } from "react";

export type Consent = "accepted" | "rejected";

const STORAGE_KEY = "mikudCookieConsent";
const CHANGE_EVENT = "mikud:consent-changed";

export function getConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, consent);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function resetConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, getConsent, () => undefined);
}
