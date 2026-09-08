import type { NextApiRequest, NextApiResponse } from "next";
import { searchStreets } from "@/server/addressIndex";
import { rateLimit } from "@/server/rateLimit";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  if (!rateLimit(req, res, "search", 120, 60 * 1000)) return;

  const city = typeof req.query.city === "string" ? req.query.city : "";
  const q = typeof req.query.q === "string" ? req.query.q : "";
  if (!city || !q.trim()) {
    return res.status(400).json({ error: "Missing city or q" });
  }

  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return res.status(200).json(searchStreets(city, q));
}
