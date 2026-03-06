import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const MAX_ENTRIES = 500;
const cache = new Map<string, { data: any[]; ts: number }>();

function getCached(key: string): any[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any[]) {
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value!);
  cache.set(key, { data, ts: Date.now() });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { prefix } = req.body as { prefix: string };
  if (!prefix || typeof prefix !== "string") {
    return res.status(400).json({ error: "Missing prefix" });
  }

  try {
    const cacheKey = prefix.toLowerCase();
    const cached = getCached(cacheKey);
    if (cached) return res.status(200).json(cached);

    const response = await axios.post(
      "https://apimftprd.israelpost.co.il/mypost-zip/GetCities",
      { CityStartsWith: prefix },
      // Public subscription key from Israel Post
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "5ccb5b137e7444d885be752eda7f767a",
        },
      },
    );
    const result = response.data?.Result ?? [];
    setCache(cacheKey, result);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(502).json([]);
  }
}
