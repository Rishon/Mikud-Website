export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NKBEMQNZDM";
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "yf85jtlwc2";
export const ANALYTICS_ENABLED = process.env.NODE_ENV === "production";

const ANALYTICS_COOKIE = /^(_ga|_gid|_gat|_clck|_clsk)/;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export type AnalyticsParams = Record<string, string | number>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.clarity?.("event", [name, ...Object.values(params)].join("_"));
}

function expireAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => ANALYTICS_COOKIE.test(name));
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++)
    domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const name of names)
    for (const domain of domains)
      document.cookie = `${name}=; max-age=0; path=/${domain}`;
}

export function revokeAnalytics() {
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: "denied",
  });
  expireAnalyticsCookies();
  window.location.reload();
}
