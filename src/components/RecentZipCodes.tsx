import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

// Toast
import toast from "react-hot-toast";

// Icons
import { MdOutlineContentCopy, MdDelete } from "react-icons/md";

const AddressLayout = () => {
  // IsMobile
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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

  async function deleteFromCache(element: any) {
    let zipCode = cacheData[element].zipCode;
    if (zipCode === "") return;
    let newCacheData = cacheData.filter((item, index) => index !== element);
    setCacheData(newCacheData);
    localStorage.setItem("mikudData", JSON.stringify(newCacheData));
    toast.success("!המיקוד הוסר בהצלחה");
  }

  return (
    <>
      {/* Last ZipCodes Background */}
      <div
        className="h-1440 flex items-center justify-center"
        style={{
          backgroundColor: isMobile ? "" : "var(--footer-black)",
          width: "450px",
          height: "100%",
          position: "absolute",
          bottom: 0,
          right: isMobile ? "0%" : "60%",
          transform: isMobile ? "" : "translateX(-50%)",
          zIndex: 1,
        }}
      >
        {/* Last ZipCodes content */}
        <div
          style={{
            backgroundColor: "#fff",
            width: isMobile ? "70%" : "90%",
            right: isMobile ? "7%" : "",
            borderRadius: "8px",
            border: "1px solid #101057",
            padding: "24px",
            position: "absolute",
            top: isMobile ? "65%" : "10%",
            maxHeight: "35%",
            minHeight: isMobile ? "25%" : "20%",
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MdOutlineContentCopy
                      onClick={async () => {
                        copyToKeyboard(index);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <div style={{ marginLeft: "auto", marginRight: "5px" }}>
                    <span>
                      {item.city}, {item.streetAddress}, {item.entranceNumber}
                      {item.houseNumber} {"(" + item.zipCode + ")"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <MdDelete
                      onClick={async () => {
                        deleteFromCache(index);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
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
          bottom: isMobile ? "-18%" : "30%",
          left: 0,
        }}
      ></div>
    </>
  );
};

export default AddressLayout;
