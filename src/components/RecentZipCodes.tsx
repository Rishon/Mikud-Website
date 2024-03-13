import React from "react";

// Icons
import { IoLocationSharp, IoReader } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";

const AddressLayout = () => {
  return (
    <>
      {/* Last ZipCodes Background */}
      <div
        className="h-1440 flex items-center justify-center"
        style={{
          backgroundColor: "var(--footer-black)",
          width: "400px",
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
            width: "352px",
            height: "264px",
            borderRadius: "8px",
            border: "1px solid #101057",
            padding: "24px",
            position: "absolute",
            top: "10%",
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
            }}
          >
            {"עיר, רחוב מס' בית, כניסה, מיקוד"}
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
