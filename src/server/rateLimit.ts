import type { NextApiRequest, NextApiResponse } from "next";

const MAX_TRACKED_IPS = 10000;
const buckets = new Map<string, number[]>();

export function getClientIp(req: NextApiRequest): string {
  const cf = req.headers["cf-connecting-ip"];
  if (typeof cf === "string" && cf) return cf;
  const forwarded = req.headers["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
    ?.split(",")[0]
    .trim();
  return first || req.socket.remoteAddress || "unknown";
}

function prune(now: number, windowMs: number) {
  if (buckets.size < MAX_TRACKED_IPS) return;
  for (const [key, hits] of buckets) {
    if (hits.length === 0 || now - hits[hits.length - 1] > windowMs) {
      buckets.delete(key);
    }
  }
}

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  scope: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const key = `${scope}:${getClientIp(req)}`;
  const hits = (buckets.get(key) ?? []).filter((ts) => now - ts < windowMs);

  res.setHeader("X-RateLimit-Limit", String(limit));
  if (hits.length >= limit) {
    const retryAfter = Math.ceil((hits[0] + windowMs - now) / 1000);
    res.setHeader("X-RateLimit-Remaining", "0");
    res.setHeader("Retry-After", String(Math.max(retryAfter, 1)));
    buckets.set(key, hits);
    res.status(429).json({ error: "Too many requests" });
    return false;
  }

  hits.push(now);
  buckets.set(key, hits);
  prune(now, windowMs);
  res.setHeader("X-RateLimit-Remaining", String(limit - hits.length));
  return true;
}
