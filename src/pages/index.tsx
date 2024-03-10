import { SetStateAction, useEffect, useState } from "react";
import Layout from "../components/layout";
import PostOfficeAPI from "../components/PostOfficeAPI";

export default function Home() {
  // Local Storage
  const [cacheData, setCacheData] = useState([]);

  // City Info
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [entranceNumber, setEntranceNumber] = useState("");

  useEffect(() => {
    const storedJsonData = localStorage.getItem("mikudData");
    if (storedJsonData) {
      setCacheData(JSON.parse(storedJsonData));
    }
  }, []);

  async function clearForm() {
    setCity("");
    setStreetAddress("");
    setHouseNumber("");
    setEntranceNumber("");

    // Update inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });
  }

  async function submitForm() {
    console.log(city, streetAddress, houseNumber, entranceNumber);
    await PostOfficeAPI(city, streetAddress, houseNumber, entranceNumber);

    let json: any = {
      city: city,
      streetAddress: streetAddress,
      houseNumber: houseNumber,
      entranceNumber: entranceNumber,
    };

    const updatedCacheData = [...cacheData, json];

    localStorage.setItem("mikudData", JSON.stringify(updatedCacheData));
    setCacheData(updatedCacheData as any);
    clearForm();
  }

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="max-w-5xl w-full">
          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-white-700"
            >
              City | ישוב / עיר
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter city"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="street-address"
              className="block text-sm font-medium text-white-700"
            >
              Street Address | כתובת
            </label>
            <input
              type="text"
              id="street-address"
              name="street-address"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter street address"
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="house-number"
              className="block text-sm font-medium text-white-700"
            >
              House Number | מספר בית
            </label>
            <input
              type="number"
              id="house-number"
              name="house-number"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter house number"
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="entrance-number"
              className="block text-sm font-medium text-white-700"
            >
              Entrance Number | כניסה
            </label>
            <input
              type="number"
              id="entrance-number"
              name="entrance-number"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter entrance"
              onChange={(e) => setEntranceNumber(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              onClick={submitForm}
            >
              Find Zip Code
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={clearForm}
            >
              Clear Form
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
