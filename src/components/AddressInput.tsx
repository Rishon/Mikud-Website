import React, { useState } from "react";

// Components
import {
  getCitySearchResults,
  getStreetSearchResults,
  loadDataStore,
} from "../components/PostOfficeAPI";

// Icons
import { IoLocationSharp, IoReader } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";

const AddressLayout = () => {
  const [cityResult, setCityResult] = useState("" as string);
  const [cityResults, setCityResults] = useState([] as string[]);
  const [streetResults, setStreetResults] = useState([] as string[]);
  const [entranceResults, setEntranceResults] = useState([] as string[]);

  // City Datalist
  const [showCityDatalist, setShowCityDatalist] = useState(false);
  const handleCityFocus = () => {
    setShowCityDatalist(true);
  };
  const handleCityBlur = () => {
    setShowCityDatalist(false);
    setCityResults([]);
  };

  // Street Datalist
  const [showStreetDatalist, setShowStreetDatalist] = useState(false);
  const handleStreetFocus = () => {
    setShowStreetDatalist(true);
  };
  const handleStreetBlur = () => {
    setShowStreetDatalist(false);
    setStreetResults([]);
  };

  // Entrance Datalist
  const [showEntranceDatalist, setShowEntranceDatalist] = useState(false);
  const handleEntranceFocus = () => {
    setEntranceResults(["א", "ב", "ג", "ד", "ה"]);
    setShowEntranceDatalist(true);
  };
  const handleEntranceBlur = () => {
    setShowEntranceDatalist(false);
  };

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
          zIndex: 3,
        }}
      >
        {/* City Input */}
        <div style={{ paddingRight: "10px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              onFocus={async (e) => {
                if (e.target.value.length < 2) return;
                handleCityFocus;
              }}
              onBlur={handleCityBlur}
              type="text"
              placeholder="ישוב / עיר"
              maxLength={15}
              id="cityInput"
              onChange={async (e) => {
                if (e.target.value.length < 2) return;
                const city = e.target.value;
                const results = await getCitySearchResults(city);
                let cityResults: string[] = results.map(
                  (result: any) => result.שם_ישוב
                );
                setCityResults(cityResults);
                setCityResult(city);
                handleCityFocus();
              }}
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

            {/* City Datalist */}
            <datalist
              id="cities"
              style={{
                display: showCityDatalist ? "block" : "none",
                backgroundColor: "#fff",
                padding: "5px",
                width: "171px",
                position: "absolute",
                borderRadius: "10px",
                border: "1px solid #101057",
              }}
            >
              {cityResults.slice(0, 5).map((city, index) => (
                <option
                  key={index}
                  value={city}
                  style={{ color: "#000", cursor: "pointer" }}
                  onMouseDown={() => {
                    setCityResult(city);
                    let cityInput = document.getElementById(
                      "cityInput"
                    ) as HTMLInputElement;
                    cityInput.value = city;
                    handleCityBlur();
                  }}
                >
                  {city}
                </option>
              ))}
            </datalist>

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
              onFocus={async (e) => {
                if (cityResult === "") return;
                loadDataStore(cityResult);
                if (e.target.value.length < 1) return;
                handleStreetFocus;
              }}
              onBlur={handleStreetBlur}
              type="text"
              placeholder="רחוב"
              maxLength={15}
              id="streetInput"
              onChange={async (e) => {
                if (e.target.value.length < 1) return;
                const street = e.target.value;
                const results = await getStreetSearchResults(
                  cityResult,
                  street
                );

                let streetResults: string[] = results.map(
                  (result: any) => result.שם_רחוב
                );
                setStreetResults(streetResults);
                handleStreetFocus();
              }}
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

            {/* Street Datalist */}
            <datalist
              id="streets"
              style={{
                display: showStreetDatalist ? "block" : "none",
                backgroundColor: "#fff",
                padding: "5px",
                width: "171px",
                position: "absolute",
                borderRadius: "10px",
                border: "1px solid #101057",
              }}
            >
              {streetResults.slice(0, 5).map((street, index) => (
                <option
                  key={index}
                  value={street}
                  style={{ color: "#000", cursor: "pointer" }}
                  onMouseDown={() => {
                    let streetInput = document.getElementById(
                      "streetInput"
                    ) as HTMLInputElement;
                    streetInput.value = street;
                    handleStreetBlur();
                  }}
                >
                  {street}
                </option>
              ))}
            </datalist>

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
              id="houseNumberInput"
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
              onFocus={handleEntranceFocus}
              onBlur={handleEntranceBlur}
              type="text"
              placeholder="כניסה (אם יש)"
              maxLength={2}
              id="entranceInput"
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

            {/* Entrance Datalist */}
            <datalist
              id="entrance"
              style={{
                display: showEntranceDatalist ? "block" : "none",
                backgroundColor: "#fff",
                padding: "5px",
                width: "171px",
                position: "absolute",
                borderRadius: "10px",
                border: "1px solid #101057",
              }}
            >
              {entranceResults.slice(0, 5).map((entrance, index) => (
                <option
                  key={index}
                  value={entrance}
                  style={{ color: "#000", cursor: "pointer" }}
                  onMouseDown={() => {
                    let entranceInput = document.getElementById(
                      "entranceInput"
                    ) as HTMLInputElement;
                    entranceInput.value = entrance;
                    handleEntranceBlur();
                  }}
                >
                  {entrance}
                </option>
              ))}
            </datalist>

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
