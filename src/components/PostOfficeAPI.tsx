import axios from "axios";

// Data
let CITY_DATASTORE = {};
let STREET_DATASTORE = {};

export async function getZipCode(
  city: string,
  street: string,
  house: string,
  entrance: string
) {
  city = city.trim();
  street = street.trim();

  const requestBody = {
    city: city,
    house: house + entrance,
    remote: true,
    street: street,
  };

  try {
    const response = await axios.post(
      "https://www.zipy.co.il/api/findzip/getZip",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function loadDataStore(city: any) {
  let query = "";
  let resourceID =
    city != null
      ? "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3"
      : "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";

  if (city != null) query = `{"שם_ישוב":"${city}"}`;

  const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${resourceID}&q=${query}&limit=32000`;

  try {
    const response = await axios.get(url);

    if (city != null) {
      STREET_DATASTORE = response.data.result.records;
    } else {
      CITY_DATASTORE = response.data.result.records;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getCitySearchResults(pattern: string) {
  const results = (CITY_DATASTORE as any[]).filter((record: any) => {
    return record["שם_ישוב"].includes(pattern);
  });
  return results;
}

export async function getStreetSearchResults(city: string, pattern: string) {
  const results = (STREET_DATASTORE as any[]).filter((record: any) => {
    return record["שם_רחוב"].includes(pattern);
  });
  return results;
}
