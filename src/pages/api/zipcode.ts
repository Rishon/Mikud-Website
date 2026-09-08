import type { NextApiRequest, NextApiResponse } from "next";
import {
  createTtlCache,
  postIsraelPost,
  resolveIsraelPostStreetId,
} from "@/server/israelPost";
import { getClientIp, rateLimit } from "@/server/rateLimit";
import { verifyTurnstile } from "@/server/turnstile";

const zipCache = createTtlCache<string | null>(6 * 60 * 60 * 1000, 5000); // 6 hours

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  if (!rateLimit(req, res, "zipcode", 20, 60 * 1000)) return;

  const { cityId, streetId, house, entrance, turnstileToken } = req.body as {
    cityId: string;
    streetId: string;
    house: string;
    entrance: string;
    turnstileToken?: string;
  };

  if (
    !cityId ||
    !streetId ||
    !house ||
    typeof cityId !== "string" ||
    typeof streetId !== "string" ||
    typeof house !== "string"
  ) {
    return res.status(400).json({ success: false });
  }

  if (!(await verifyTurnstile(turnstileToken, getClientIp(req)))) {
    return res.status(403).json({ success: false, error: "bot" });
  }

  const houseNumber = house.trim();
  const entry = typeof entrance === "string" ? entrance.trim() : "";
  const cacheKey = `${cityId}:${streetId}:${houseNumber}:${entry}`;

  try {
    const cached = zipCache.get(cacheKey);
    if (cached !== null)
      return res.status(200).json({ success: true, zip: cached });

    const ids = await resolveIsraelPostStreetId(cityId, streetId);
    if (!ids) return res.status(200).json({ success: false });

    const data = await postIsraelPost("SearchZip", {
      CityID: ids.ipCityId,
      StreetID: ids.ipStreetId,
      House: houseNumber,
      Entry: entry,
      ByMaanimID: true,
    });
    if (data.ReturnCode === 0 && data.Result?.zip) {
      zipCache.set(cacheKey, data.Result.zip);
      return res.status(200).json({ success: true, zip: data.Result.zip });
    }
    return res.status(200).json({ success: false });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ success: false });
  }
}
