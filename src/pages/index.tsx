import { useEffect, useState } from "react";

// Components
import { getZipCode } from "../components/PostOfficeAPI";
import Layout from "../components/Layout";
import AddressInput from "../components/AddressInput";
import RecentZipCodes from "../components/RecentZipCodes";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  // Local Storage
  const [cacheData, setCacheData] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // Result
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const storedJsonData = localStorage.getItem("mikudData");
    if (storedJsonData) setCacheData(JSON.parse(storedJsonData));

    setLoading(false);
  }, []);

  async function copyToKeyboard() {
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success("המיקוד הועתק בהצלחה!");
  }

  async function submitForm() {
    setLoading(true);

    const storedJsonData = localStorage.getItem("mikudData");
    if (storedJsonData) setCacheData(JSON.parse(storedJsonData));

    setZipCode("");

    const city = (document.getElementById("cityInput") as HTMLInputElement)
      .value;
    const streetAddress = (
      document.getElementById("streetInput") as HTMLInputElement
    ).value;
    const houseNumber = (
      document.getElementById("houseNumberInput") as HTMLInputElement
    ).value;
    const entranceNumber = (
      document.getElementById("entranceInput") as HTMLInputElement
    ).value;
    const cityId = (document.getElementById("cityIdInput") as HTMLInputElement)
      .value;
    const streetId = (
      document.getElementById("streetIdInput") as HTMLInputElement
    ).value;

    if (
      city === "" ||
      streetAddress === "" ||
      houseNumber === "" ||
      cityId === "" ||
      streetId === ""
    ) {
      toast.error("אנא מלאו את כל השדות ובחרו מהרשימה.");
      setLoading(false);
      return;
    }

    try {
      const zipCode = await getZipCode(
        cityId,
        streetId,
        houseNumber,
        entranceNumber,
      );

      if (!zipCode.success || zipCode.result == undefined) {
        toast.error("לא נמצא מיקוד, אנא נסו שנית.");
        return;
      }

      setZipCode(zipCode.result.zip);

      let json: any = {
        city: city,
        streetAddress: streetAddress,
        houseNumber: houseNumber,
        entranceNumber: entranceNumber,
        zipCode: zipCode.result.zip,
      };

      let slicedCache: any[] = cacheData;

      if (cacheData.length >= 5) {
        while (cacheData.length > 5) cacheData.pop();
        slicedCache = cacheData.slice(1, 5);
      }

      if (cacheData.length > 0) {
        for (let i = 0; i < cacheData.length; i++) {
          if (
            JSON.stringify(cacheData[i]) ===
            JSON.stringify({
              city: city,
              streetAddress: streetAddress,
              houseNumber: houseNumber,
              entranceNumber: entranceNumber,
              zipCode: zipCode.result.zip,
            })
          ) {
            return;
          }
        }
      }

      const updatedCacheData = [...slicedCache, json];

      localStorage.setItem("mikudData", JSON.stringify(updatedCacheData));
      setCacheData(updatedCacheData as any);
    } catch (error) {
      toast.error("התרחשה שגיאה במהלך הבקשה, אנא נסו שנית.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Toaster />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          {/* Form Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            {/* Title */}
            <h1 className="text-mikud-navy text-5xl md:text-6xl font-ibm-bold text-center mb-4">
              {"איתור מיקוד"}
            </h1>

            {/* Description */}
            <p className="text-mikud-navy text-xl md:text-2xl font-ibm-regular text-center mb-8">
              {"הזינו כתובת בכדי לקבל מיקוד"}
            </p>

            {/* Address Input */}
            <AddressInput />

            {/* Buttons */}
            <div className="flex flex-row-reverse flex-wrap gap-2.5 mt-6 font-ibm-regular justify-center md:justify-end w-full max-w-[720px] px-4 md:px-0">
              <button
                onClick={copyToKeyboard}
                className="h-8 rounded-lg bg-mikud-navy-glass text-right px-2.5 text-mikud-navy text-base font-ibm-regular cursor-pointer"
              >
                {zipCode === "" ? "המיקוד יופיע כאן" : `המיקוד הוא: ${zipCode}`}
              </button>
              <button
                className={`w-32 h-8 rounded-lg bg-mikud-purple text-white text-base cursor-pointer transition-opacity ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
                onClick={submitForm}
                disabled={loading}
              >
                {"חפש מיקוד"}
              </button>
            </div>
          </div>

          {/* Recent Zip Codes */}
          <RecentZipCodes />
        </div>

        <div className="h-16 bg-mikud-purple w-full" />
      </main>
    </Layout>
  );
}
