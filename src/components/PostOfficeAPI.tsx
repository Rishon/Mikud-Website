import axios from "axios";

export async function getZipCode(
  city: string,
  street: string,
  house: string,
  entrance: string
) {
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

export async function getCitySearchResults(pattern: string) {
  const requestBody = {
    pattern: pattern,
    remote: true,
  };

  try {
    const response = await axios.post(
      "https://www.zipy.co.il/api/findzip/searchCity",
      requestBody
    );
    console.log("CITY: " + response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getStreetSearchResults(city: string, pattern: string) {
  const requestBody = {
    city: city,
    pattern: pattern,
    remote: true,
  };

  try {
    const response = await axios.post(
      "https://www.zipy.co.il/api/findzip/searchStreet",
      requestBody
    );
    console.log("STREET:" + response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
