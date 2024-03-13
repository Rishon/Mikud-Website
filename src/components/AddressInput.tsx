import React from "react";

// Icons
import { IoLocationSharp, IoReader } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";

const AddressLayout = () => {
  return (
    <>
      {/* Input Box */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "51%",
          transform: "translate(50%, -50%)",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          textAlign: "right",
        }}
      >
        {/* City Input */}
        <div style={{ paddingRight: "10px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              placeholder="ישוב / עיר"
              maxLength={8}
              style={{
                width: "171px",
                height: "32px",
                borderRadius: "53px",
                paddingLeft: "10px",
                paddingRight: "35px",
                textAlign: "right",
                border: "1px solid #101057",
                marginRight: "10px",
              }}
            />
            {/* Location Icon */}
            <div
              style={{
                width: "32px",
                height: "32px",
                position: "absolute",
                top: "75%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              <IoLocationSharp />
            </div>
          </div>
        </div>

        {/* Street Input */}
        <div style={{ paddingRight: "10px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              placeholder="רחוב"
              maxLength={8}
              style={{
                width: "171px",
                height: "32px",
                borderRadius: "53px",
                paddingLeft: "10px",
                paddingRight: "35px",
                textAlign: "right",
                border: "1px solid #101057",
                marginRight: "10px",
              }}
            />
            {/* Location Icon */}
            <div
              style={{
                width: "32px",
                height: "32px",
                position: "absolute",
                top: "75%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              <FaHouse />
            </div>
          </div>
        </div>

        {/* House Number Input */}
        <div style={{ paddingRight: "10px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              placeholder="מס' בית"
              maxLength={2}
              style={{
                width: "171px",
                height: "32px",
                borderRadius: "53px",
                paddingLeft: "10px",
                paddingRight: "35px",
                textAlign: "right",
                border: "1px solid #101057",
                marginRight: "10px",
              }}
            />
            {/* Location Icon */}
            <div
              style={{
                width: "32px",
                height: "32px",
                position: "absolute",
                top: "75%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              <IoReader />
            </div>
          </div>
        </div>

        {/* Entrance Input */}
        <div style={{ paddingRight: "10px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              placeholder="כניסה (אם יש)"
              maxLength={2}
              style={{
                width: "171px",
                height: "32px",
                borderRadius: "53px",
                paddingLeft: "10px",
                paddingRight: "35px",
                textAlign: "right",
                border: "1px solid #101057",
                marginRight: "10px",
              }}
            />
            {/* Location Icon */}
            <div
              style={{
                width: "32px",
                height: "32px",
                position: "absolute",
                top: "75%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              <FaLocationArrow />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressLayout;
