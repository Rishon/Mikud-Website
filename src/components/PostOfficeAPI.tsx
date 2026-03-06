// Client-side in-memory caches — persist for the duration of the browser session
const cityCache = new Map<string, any[]>();
const streetCache = new Map<string, any[]>();

export async function getZipCode(
  cityId: string,
  streetId: string,
  house: string,
  entrance: string,
): Promise<{ success: boolean; result?: { zip: string } }> {
  try {
    const res = await fetch("/api/zipcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityId, streetId, house, entrance }),
    });
    const data = await res.json();
    if (data.success && data.zip) {
      return { success: true, result: { zip: data.zip as string } };
    }
    return { success: false };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function loadDataStore(_city: string | null) {}

export async function getCitySearchResults(prefix: string) {
  const key = prefix.toLowerCase();
  if (cityCache.has(key)) return cityCache.get(key)!;
  try {
    const res = await fetch("/api/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix }),
    });
    const data = await res.json();
    cityCache.set(key, data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getStreetSearchResults(cityId: string, prefix: string) {
  const key = `${cityId}:${prefix.toLowerCase()}`;
  if (streetCache.has(key)) return streetCache.get(key)!;
  try {
    const res = await fetch("/api/streets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityId, prefix }),
    });
    const data = await res.json();
    streetCache.set(key, data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
