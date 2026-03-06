import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { cityId, streetId, house, entrance } = req.body as {
    cityId: string;
    streetId: string;
    house: string;
    entrance: string;
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

  try {
    const response = await axios.post(
      "https://apimftprd.israelpost.co.il/mypost-zip/SearchZip",
      {
        CityID: cityId,
        StreetID: streetId,
        House: house.trim(),
        Entry: (entrance ?? "").trim(),
        ByMaanimID: true,
      },
      // Public subscription key from Israel Post
      {
        headers: {
          "Ocp-Apim-Subscription-Key": "5ccb5b137e7444d885be752eda7f767a",
        },
      },
    );
    const data = response.data;
    if (data.ReturnCode === 0 && data.Result?.zip) {
      return res.status(200).json({ success: true, zip: data.Result.zip });
    }
    return res.status(200).json({ success: false });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ success: false });
  }
}
