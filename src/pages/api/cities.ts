import type { NextApiRequest, NextApiResponse } from "next";
import { searchCities } from "@/server/addressIndex";
import { rateLimit } from "@/server/rateLimit";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  if (!rateLimit(req, res, "search", 120, 60 * 1000)) return;

  const q = typeof req.query.q === "string" ? req.query.q : "";
  if (!q.trim()) return res.status(400).json({ error: "Missing q" });

  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return res.status(200).json(searchCities(q));
}
