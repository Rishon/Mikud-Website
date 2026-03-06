import React, { useRef, useState } from "react";

// Components
import {
  getCitySearchResults,
  getStreetSearchResults,
} from "../components/PostOfficeAPI";

// Icons
import { IoLocationSharp } from "react-icons/io5";
import { BsFillSignpost2Fill } from "react-icons/bs";
import { FaHouse } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa";

const inputCls =
  "w-full md:w-[171px] h-10 md:h-8 text-base md:text-sm rounded-full pl-2.5 pr-9 text-right border border-mikud-navy focus:outline-none focus:ring-2 focus:ring-mikud-purple bg-white";

const dropdownCls =
  "absolute top-full mt-1 bg-white p-1.5 w-full rounded-xl border border-mikud-navy z-10 shadow-md";

const AddressLayout = () => {
  // Selected city/street IDs for the zip lookup
  const [cityId, setCityId] = useState("");
  const [streetId, setStreetId] = useState("");

  // Debounce timers for autocomplete inputs
  const cityDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streetDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autocomplete result lists (full API objects)
  const [cityResults, setCityResults] = useState<any[]>([]);
  const [streetResults, setStreetResults] = useState<any[]>([]);
  const [entranceResults, setEntranceResults] = useState<string[]>([]);

  const [showCityDatalist, setShowCityDatalist] = useState(false);
  const [showStreetDatalist, setShowStreetDatalist] = useState(false);
  const [showEntranceDatalist, setShowEntranceDatalist] = useState(false);

  const handleCityBlur = () => {
    setShowCityDatalist(false);
    setCityResults([]);
  };

  const handleStreetBlur = () => {
    setShowStreetDatalist(false);
    setStreetResults([]);
  };

  const handleEntranceFocus = () => {
    setEntranceResults(["א", "ב", "ג", "ד", "ה"]);
    setShowEntranceDatalist(true);
  };

  const handleEntranceBlur = () => {
    setShowEntranceDatalist(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 w-full max-w-[720px] px-4 md:px-0">
      {/* Hidden inputs carry the IDs for index.tsx to read */}
      <input type="hidden" id="cityIdInput" value={cityId} readOnly />
      <input type="hidden" id="streetIdInput" value={streetId} readOnly />

      {/* City Input */}
      <div className="relative w-full md:w-auto">
        <input
          onBlur={handleCityBlur}
          type="text"
          placeholder="ישוב / עיר"
          maxLength={40}
          id="cityInput"
          className={inputCls}
          onChange={(e) => {
            // Reset IDs when user types manually
            setCityId("");
            setStreetId("");
            const val = e.target.value;
            if (cityDebounceRef.current) clearTimeout(cityDebounceRef.current);
            if (val.length < 2) {
              setShowCityDatalist(false);
              return;
            }
            cityDebounceRef.current = setTimeout(async () => {
              const results = await getCitySearchResults(val);
              setCityResults(results);
              setShowCityDatalist(true);
            }, 300);
          }}
        />
        {showCityDatalist && cityResults.length > 0 && (
          <div className={dropdownCls}>
            {cityResults.slice(0, 5).map((city: any, index) => (
              <div
                key={index}
                className="p-1.5 cursor-pointer hover:bg-gray-100 text-right text-mikud-navy rounded"
                onMouseDown={() => {
                  setCityId(city.id);
                  setStreetId("");
                  (
                    document.getElementById("cityInput") as HTMLInputElement
                  ).value = city.n;
                  // Clear street input when city changes
                  (
                    document.getElementById("streetInput") as HTMLInputElement
                  ).value = "";
                  setShowCityDatalist(false);
                  setCityResults([]);
                }}
              >
                {city.n}
              </div>
            ))}
          </div>
        )}
        {/* Icon */}
        <div className="absolute top-1/2 right-2.5 -translate-y-1/2 pointer-events-none text-mikud-navy">
          <IoLocationSharp />
        </div>
      </div>

      {/* Street Input */}
      <div className="relative w-full md:w-auto">
        <input
          onBlur={handleStreetBlur}
          type="text"
          placeholder="רחוב"
          maxLength={40}
          id="streetInput"
          className={inputCls}
          onChange={(e) => {
            setStreetId("");
            const val = e.target.value;
            if (streetDebounceRef.current)
              clearTimeout(streetDebounceRef.current);
            if (cityId === "" || val.length < 1) {
              setShowStreetDatalist(false);
              return;
            }
            streetDebounceRef.current = setTimeout(async () => {
              const results = await getStreetSearchResults(cityId, val);
              setStreetResults(results);
              setShowStreetDatalist(true);
            }, 300);
          }}
        />
        {showStreetDatalist && streetResults.length > 0 && (
          <div className={dropdownCls}>
            {streetResults.slice(0, 5).map((street: any, index) => (
              <div
                key={index}
                className="p-1.5 cursor-pointer hover:bg-gray-100 text-right text-mikud-navy rounded"
                onMouseDown={() => {
                  setStreetId(street.id);
                  (
                    document.getElementById("streetInput") as HTMLInputElement
                  ).value = street.n;
                  setShowStreetDatalist(false);
                  setStreetResults([]);
                }}
              >
                {street.n}
              </div>
            ))}
          </div>
        )}
        {/* Icon */}
        <div className="absolute top-1/2 right-2.5 -translate-y-1/2 pointer-events-none text-mikud-navy">
          <FaHouse />
        </div>
      </div>

      {/* House Number Input */}
      <div className="relative w-full md:w-auto">
        <input
          type="text"
          placeholder="מס' בית"
          maxLength={2}
          id="houseNumberInput"
          className={inputCls}
        />
        {/* Icon */}
        <div className="absolute top-1/2 right-2.5 -translate-y-1/2 pointer-events-none text-mikud-navy">
          <BsFillSignpost2Fill />
        </div>
      </div>

      {/* Entrance Input */}
      <div className="relative w-full md:w-auto">
        <input
          onFocus={handleEntranceFocus}
          onBlur={handleEntranceBlur}
          type="text"
          placeholder="כניסה (אם יש)"
          maxLength={2}
          id="entranceInput"
          className={inputCls}
        />
        {showEntranceDatalist && entranceResults.length > 0 && (
          <div className={dropdownCls}>
            {entranceResults.slice(0, 5).map((entrance, index) => (
              <div
                key={index}
                className="p-1.5 cursor-pointer hover:bg-gray-100 text-right text-mikud-navy rounded"
                onMouseDown={() => {
                  (
                    document.getElementById("entranceInput") as HTMLInputElement
                  ).value = entrance;
                  setShowEntranceDatalist(false);
                }}
              >
                {entrance}
              </div>
            ))}
          </div>
        )}
        {/* Icon */}
        <div className="absolute top-1/2 right-2.5 -translate-y-1/2 pointer-events-none text-mikud-navy">
          <FaLocationArrow />
        </div>
      </div>
    </div>
  );
};

export default AddressLayout;
