const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY ?? "";

export const turnstileEnabled = SECRET_KEY.length > 0;

export async function verifyTurnstile(
  token: unknown,
  ip: string,
): Promise<boolean> {
  if (!turnstileEnabled) return true;
  if (typeof token !== "string" || !token) return false;

  const body = new URLSearchParams({ secret: SECRET_KEY, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.success === true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
