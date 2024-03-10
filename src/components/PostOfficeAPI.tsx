import axios from "axios";

const apiUrl = "https://www.zipy.co.il/api/findzip/getZip";

export default async function getZipCode(
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
    const response = await axios.post(apiUrl, requestBody);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
