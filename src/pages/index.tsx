import Layout from "../components/layout";

export default function Home() {
  
  async function clearForm() {
    let city = document.getElementById("city") as HTMLInputElement;
    let streetAddress = document.getElementById(
      "street-address"
    ) as HTMLInputElement;
    let houseNumber = document.getElementById(
      "house-number"
    ) as HTMLInputElement;
    let entranceNumber = document.getElementById(
      "entrance-number"
    ) as HTMLInputElement;

    city.value = "";
    streetAddress.value = "";
    houseNumber.value = "";
    entranceNumber.value = "";
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
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="entrance-number"
              className="block text-sm font-medium text-white-700"
            >
              Entrance Number | מספר כניסה
            </label>
            <input
              type="number"
              id="entrance-number"
              name="entrance-number"
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="Enter entrance number"
            />
          </div>
          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
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
