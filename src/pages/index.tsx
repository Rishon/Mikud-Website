import { useEffect, useState } from "react";

// Components
import {
  getZipCode,
  getCitySearchResults,
  getStreetSearchResults,
} from "../components/PostOfficeAPI";
import Layout from "../components/layout";
import Footer from "../components/footer";
import AddressInput from "../components/AddressInput";
import RecentZipCodes from "../components/RecentZipCodes";

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
    const zipCode = await getZipCode(
      city,
      streetAddress,
      houseNumber,
      entranceNumber
    );

    if (!zipCode.success || zipCode.result == undefined) {
      alert("No zip code found, please try again.");
      return;
    }

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

    const updatedCacheData = [...slicedCache, json];

    localStorage.setItem("mikudData", JSON.stringify(updatedCacheData));
    setCacheData(updatedCacheData as any);
  }

  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
              right: "0%",
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
              right: "20.4%",
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
        </div>

        <RecentZipCodes />
        <Footer />
      </main>
    </Layout>
  );
}
