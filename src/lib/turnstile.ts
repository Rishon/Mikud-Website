export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  execute: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TOKEN_TIMEOUT_MS = 15000;
const SCRIPT_WAIT_MS = 8000;

let widgetId: string | null = null;
let waiters: ((token: string | null) => void)[] = [];

function settle(token: string | null) {
  const pending = waiters;
  waiters = [];
  for (const resolve of pending) resolve(token);
}

function waitForScript(): Promise<Turnstile | null> {
  return new Promise((resolve) => {
    const started = Date.now();
    const check = () => {
      if (window.turnstile) return resolve(window.turnstile);
      if (Date.now() - started > SCRIPT_WAIT_MS) return resolve(null);
      setTimeout(check, 100);
    };
    check();
  });
}

async function ensureWidget(): Promise<string | null> {
  if (widgetId) return widgetId;
  const turnstile = await waitForScript();
  if (!turnstile) return null;
  if (widgetId) return widgetId;
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.insetInlineEnd = "0";
  container.style.zIndex = "40";
  document.body.appendChild(container);
  widgetId = turnstile.render(container, {
    sitekey: TURNSTILE_SITE_KEY,
    execution: "execute",
    appearance: "interaction-only",
    callback: (token: string) => settle(token),
    "error-callback": () => settle(null),
    "expired-callback": () => settle(null),
    "timeout-callback": () => settle(null),
  });
  return widgetId;
}

export async function getTurnstileToken(): Promise<string | null> {
  if (!TURNSTILE_SITE_KEY || typeof window === "undefined") return null;
  const id = await ensureWidget();
  const turnstile = window.turnstile;
  if (!id || !turnstile) return null;

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      waiters = waiters.filter((w) => w !== onToken);
      resolve(null);
    }, TOKEN_TIMEOUT_MS);
    const onToken = (token: string | null) => {
      clearTimeout(timer);
      resolve(token);
    };
    waiters.push(onToken);
    if (waiters.length === 1) {
      turnstile.reset(id);
      turnstile.execute(id);
    }
  });
}
