import toast from "react-hot-toast";

// Icons
import { CopyIcon, DeleteIcon } from "@/components/Icons";
import { removeRecentZipCode, useRecentZipCodes } from "@/lib/zipHistory";
import { useT } from "@/i18n";

const RecentZipCodes = () => {
  const { t } = useT();
  const recent = useRecentZipCodes();

  async function copyToKeyboard(zipCode: string) {
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success(t.toastCopied);
  }

  function deleteFromCache(index: number) {
    removeRecentZipCode(index);
    toast.success(t.toastRemoved);
  }

  return (
    <aside className="md:w-[450px] bg-transparent md:bg-mikud-footer flex items-start justify-center px-4 py-8 md:items-center">
      <div className="bg-white w-full md:w-[90%] rounded-lg border border-mikud-navy p-6 max-h-[60vh] overflow-y-auto">
        {/* Title */}
        <h2 className="text-mikud-navy text-2xl font-ibm-bold text-start mb-4">
          {t.recentTitle}
        </h2>
        {/* Separator line */}
        <hr className="border-mikud-navy mb-4" />
        {/* List */}
        {recent.length === 0 ? (
          <p className="text-mikud-navy/60 text-base font-ibm-regular text-start">
            {t.recentEmpty}
          </p>
        ) : (
          <ul className="text-mikud-navy text-base font-ibm-regular text-start list-none space-y-2.5">
            {recent.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <button
                  type="button"
                  aria-label={t.copy}
                  title={t.copy}
                  className="cursor-pointer shrink-0"
                  onClick={() => copyToKeyboard(item.zipCode)}
                >
                  <CopyIcon />
                </button>
                <span className="mx-2 text-start flex-1">
                  {item.city}, {item.streetAddress} {item.houseNumber}
                  {item.entranceNumber} ({item.zipCode})
                </span>
                <button
                  type="button"
                  aria-label={t.remove}
                  title={t.remove}
                  className="cursor-pointer shrink-0"
                  onClick={() => deleteFromCache(index)}
                >
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default RecentZipCodes;
