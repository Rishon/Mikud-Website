import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// Components
import { loadDataStore, getZipCode } from "../components/PostOfficeAPI";
import Layout from "../components/layout";
import AddressInput from "../components/AddressInput";
import RecentZipCodes from "../components/RecentZipCodes";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  // IsMobile
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // Local Storage
  const [cacheData, setCacheData] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // Result
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    const storedJsonData = localStorage.getItem("mikudData");
    if (storedJsonData) setCacheData(JSON.parse(storedJsonData));

    loadDataStore(null);
    setLoading(false);
  }, []);

  async function copyToKeyboard() {
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success("!המיקוד הועתק בהצלחה");
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

    if (city === "" || streetAddress === "" || houseNumber === "") {
      toast.error(".אנא מלאו את כל השדות");
      setLoading(false);
      return;
    }

    try {
      const zipCode = await getZipCode(
        city,
        streetAddress,
        houseNumber,
        entranceNumber
      );

      if (!zipCode.success || zipCode.result == undefined) {
        toast.error(".לא נמצא מיקוד, אנא נסו שנית");
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
        while (cacheData.length > 5) cacheData.pop(); // In case of more than 5 items
        slicedCache = cacheData.slice(1, 5); // Remove the first item
      }

      // If the item is already in the cache, return
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
      toast.error(".התרחש שגיאה במהלך הבקשה, אנא נסו שנית");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <main className="md:flex md:justify-between md:items-center">
        {/* Main Content */}
        <div
          style={{
            width: "708px",
            height: "274px",
            position: "absolute",
            top: "30%",
            right: "30%",
            transform: "translate(50%, -50%)",
          }}
        >
          {/* Text title */}
          <div
            style={{
              color: "#101057",
              position: "absolute",
              top: "5%",
              right: isMobile ? "37%" : "0%",
              transform: "translateY(-50%)",
              textAlign: "center",
              fontSize: "64px",
              fontFamily: "IBMPlexSans-Bold",
            }}
          >
            {"איתור מיקוד"}
          </div>

          {/* Description */}
          <div
            style={{
              color: "#101057",
              position: "absolute",
              top: "25%",
              right: isMobile ? "58%" : "20.4%",
              transform: "translate(50%, -50%)",
              textAlign: "center",
              fontSize: "24px",
              fontFamily: "IBMPlexSans-Regular",
            }}
          >
            {".הזינו כתובת בכדי לקבל מיקוד"}
          </div>

          {/* Address Input */}
          <AddressInput />

          <div
            style={{
              right: isMobile ? "35%" : "0%",
              top: isMobile ? "130%" : "70%",
              position: "absolute",
              fontFamily: "IBMPlexSans-Regular",
              display: "flex",
              flexDirection: "row-reverse",
              gap: "10px",
            }}
          >
            <button
              style={{
                width: "128px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#3300EE",
                color: "#fff",
                fontSize: "16px",
                opacity: loading ? 0.5 : 1,
                transition: "background-color 0.3s",
                cursor: "pointer",
              }}
              onClick={submitForm}
              disabled={loading}
            >
              {"חפש מיקוד"}
            </button>

            <button
              onClick={copyToKeyboard}
              style={{
                width: isMobile ? "220px" : "240px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "#10105726",
                textAlign: "right",
                padding: "0 10px",
                color: "#101057",
                fontSize: "16px",
                fontFamily: "IBMPlexSans-Regular",
              }}
            >
              {zipCode + " :המיקוד שלך הוא"}
            </button>
          </div>
        </div>
        <RecentZipCodes />
        <Toaster />
      </main>
    </Layout>
  );
}
