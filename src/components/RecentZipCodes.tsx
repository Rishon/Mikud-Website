import React, { useEffect, useState } from "react";

// Toast
import toast from "react-hot-toast";

// Icons
import { MdOutlineContentCopy, MdDelete } from "react-icons/md";

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
    const interval = setInterval(() => {
      const storedJsonData = localStorage.getItem("mikudData");
      if (storedJsonData) setCacheData(JSON.parse(storedJsonData));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  async function copyToKeyboard(element: number) {
    const zipCode = cacheData[element].zipCode;
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success("המיקוד הועתק בהצלחה!");
  }

  async function deleteFromCache(element: number) {
    const zipCode = cacheData[element].zipCode;
    if (zipCode === "") return;
    const newCacheData = cacheData.filter((_, index) => index !== element);
    setCacheData(newCacheData);
    localStorage.setItem("mikudData", JSON.stringify(newCacheData));
    toast.success("המיקוד הוסר בהצלחה!");
  }

  return (
    <aside className="md:w-[450px] bg-transparent md:bg-mikud-footer flex items-start justify-center px-4 py-8 md:items-center">
      <div className="bg-white w-full md:w-[90%] rounded-lg border border-mikud-navy p-6 max-h-[60vh] overflow-y-auto">
        {/* Title */}
        <div className="text-mikud-navy text-2xl font-ibm-bold text-right mb-4">
          {"מיקודים אחרונים"}
        </div>
        {/* Separator line */}
        <hr className="border-mikud-navy mb-4" />
        {/* List */}
        <ul className="text-mikud-navy text-base font-ibm-regular text-right list-none space-y-2.5">
          {cacheData.slice(0, 5).map((item, index) =>
            item.city === "" ? null : (
              <li key={index} className="flex items-center justify-between">
                <MdOutlineContentCopy
                  className="cursor-pointer shrink-0"
                  onClick={() => copyToKeyboard(index)}
                />
                <span className="mx-2 text-right flex-1">
                  {item.city}, {item.streetAddress}, {item.entranceNumber}
                  {item.houseNumber} {"(" + item.zipCode + ")"}
                </span>
                <MdDelete
                  className="cursor-pointer shrink-0"
                  onClick={() => deleteFromCache(index)}
                />
              </li>
            ),
          )}
        </ul>
      </div>
    </aside>
  );
};

export default AddressLayout;
