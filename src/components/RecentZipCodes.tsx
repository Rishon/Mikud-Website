import React, { useEffect, useState } from "react";

// Toast
import toast, { Toaster } from "react-hot-toast";

// Icons
import { MdOutlineContentCopy } from "react-icons/md";

const AddressLayout = () => {
  const [cacheData, setCacheData] = useState<
    {
      city: string;
      streetAddress: string;
      houseNumber: string;
      entranceNumber: string;
      zipCode: string;
    }[]
  >([]);

  useEffect(() => {
    setInterval(() => {
      const storedJsonData = localStorage.getItem("mikudData");
      if (storedJsonData) setCacheData(JSON.parse(storedJsonData));
    }, 2000);
  }, []);

  async function copyToKeyboard(element: any) {
    let zipCode = cacheData[element].zipCode;
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success("!המיקוד הועתק בהצלחה");
  }

  return (
    <>
      {/* Last ZipCodes Background */}
      <div
        className="h-1440 flex items-center justify-center"
        style={{
          backgroundColor: "var(--footer-black)",
          width: "450px",
          height: "100%",
          position: "absolute",
          bottom: 0,
          right: "60%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        {/* Last ZipCodes content */}
        <div
          style={{
            backgroundColor: "#fff",
            width: "90%",
            borderRadius: "8px",
            border: "1px solid #101057",
            padding: "24px",
            position: "absolute",
            top: "10%",
            maxHeight: "35%",
            minHeight: "20%",
            overflowY: "auto",
          }}
        >
          {/* Title */}
          <div
            style={{
              color: "#101057",
              fontSize: "24px",
              marginBottom: "16px",
              fontFamily: "IBMPlexSans-Bold",
              textAlign: "right",
            }}
          >
            {"מיקודים אחרונים"}
          </div>
          {/* Separator line */}
          <hr
            style={{
              borderColor: "#101057",
              borderWidth: "1px",
              marginBottom: "16px",
            }}
          />
          {/* Description */}
          <div
            style={{
              color: "#101057",
              fontSize: "16px",
              fontFamily: "IBMPlexSans-Regular",
              textAlign: "right",
              listStyle: "none",
            }}
          >
            {cacheData.slice(0, 5).map((item, index) =>
              item.city === "" ? null : (
                <li
                  key={index}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <MdOutlineContentCopy
                    onClick={() => {
                      copyToKeyboard(index);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  {item.city}, {item.streetAddress}, {item.entranceNumber}
                  {item.houseNumber} {"(" + item.zipCode + ")"} ▪
                </li>
              )
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-16"
        style={{
          backgroundColor: "var(--divider-blue)",
          width: "100vw",
          position: "absolute",
          bottom: "30%",
          left: 0,
        }}
      ></div>
    </>
  );
};

export default AddressLayout;
