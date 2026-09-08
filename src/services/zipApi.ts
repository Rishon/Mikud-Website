const cityCache = new Map<string, any[]>();
const streetCache = new Map<string, any[]>();

async function getJson(path: string, params: Record<string, string>) {
  const res = await fetch(`${path}?${new URLSearchParams(params)}`);
  if (!res.ok) throw new Error(`${path} responded with ${res.status}`);
  return res.json();
}

export type ZipLookup = {
  success: boolean;
  result?: { zip: string };
  error?: "rate_limited" | "bot" | "failed";
};

export async function getZipCode(
  cityId: string,
  streetId: string,
  house: string,
  entrance: string,
  turnstileToken: string | null,
): Promise<ZipLookup> {
  try {
    const res = await fetch("/api/zipcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cityId,
        streetId,
        house,
        entrance,
        turnstileToken,
      }),
    });
    if (res.status === 429) return { success: false, error: "rate_limited" };
    if (res.status === 403) return { success: false, error: "bot" };
    if (!res.ok) return { success: false, error: "failed" };
    const data = await res.json();
    if (data.success && data.zip) {
      return { success: true, result: { zip: data.zip as string } };
    }
    return { success: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: "failed" };
  }
}

export async function getCitySearchResults(prefix: string) {
  const key = prefix.trim().toLowerCase();
  if (cityCache.has(key)) return cityCache.get(key)!;
  try {
    const data = await getJson("/api/cities", { q: prefix });
    cityCache.set(key, data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getStreetSearchResults(cityId: string, prefix: string) {
  const key = `${cityId}:${prefix.trim().toLowerCase()}`;
  if (streetCache.has(key)) return streetCache.get(key)!;
  try {
    const data = await getJson("/api/streets", { city: cityId, q: prefix });
    streetCache.set(key, data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
