import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Components
import { getZipCode } from "@/services/zipApi";
import Layout from "@/components/Layout";
import AddressInput from "@/components/AddressInput";
import RecentZipCodes from "@/components/RecentZipCodes";
import { saveRecentZipCode } from "@/lib/zipHistory";
import { getTurnstileToken } from "@/lib/turnstile";
import { useT } from "@/i18n";

const inputValue = (id: string) =>
  (document.getElementById(id) as HTMLInputElement | null)?.value ?? "";

export default function Home() {
  const { t } = useT();

  // Loading
  const [loading, setLoading] = useState(false);

  // Result
  const [zipCode, setZipCode] = useState("");

  async function copyToKeyboard() {
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success(t.toastCopied);
  }

  async function submitForm() {
    setLoading(true);
    setZipCode("");

    const city = inputValue("cityInput");
    const streetAddress = inputValue("streetInput");
    const houseNumber = inputValue("houseNumberInput");
    const entranceNumber = inputValue("entranceInput");
    const cityId = inputValue("cityIdInput");
    const streetId = inputValue("streetIdInput");

    if (!city || !streetAddress || !houseNumber || !cityId || !streetId) {
      toast.error(t.toastMissingFields);
      setLoading(false);
      return;
    }

    try {
      const result = await getZipCode(
        cityId,
        streetId,
        houseNumber,
        entranceNumber,
        await getTurnstileToken(),
      );

      if (!result.success || result.result == undefined) {
        if (result.error === "rate_limited") toast.error(t.toastRateLimited);
        else if (result.error) toast.error(t.toastError);
        else toast.error(t.toastNotFound);
        return;
      }

      const zip = result.result.zip;
      setZipCode(zip);
      saveRecentZipCode({
        city,
        streetAddress,
        houseNumber,
        entranceNumber,
        zipCode: zip,
      });
    } catch {
      toast.error(t.toastError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Toaster />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row flex-1">
          {/* Form Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            {/* Title */}
            <h1 className="text-mikud-navy text-5xl md:text-6xl font-ibm-bold text-center mb-4">
              {t.heading}
            </h1>

            {/* Description */}
            <p className="text-mikud-navy text-xl md:text-2xl font-ibm-regular text-center mb-8">
              {t.subheading}
            </p>

            {/* Address Input */}
            <AddressInput />

            {/* Buttons */}
            <div className="flex flex-row-reverse flex-wrap gap-2.5 mt-6 font-ibm-regular justify-center md:justify-end w-full max-w-[720px] px-4 md:px-0">
              <button
                onClick={copyToKeyboard}
                aria-live="polite"
                className="h-8 rounded-lg bg-mikud-navy-glass text-start px-2.5 text-mikud-navy text-base font-ibm-regular cursor-pointer"
              >
                {zipCode === ""
                  ? t.resultPlaceholder
                  : `${t.resultPrefix} ${zipCode}`}
              </button>
              <button
                className={`w-32 h-8 rounded-lg bg-mikud-purple text-white text-base cursor-pointer transition-opacity ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
                onClick={submitForm}
                disabled={loading}
              >
                {t.search}
              </button>
            </div>
          </div>

          {/* Recent Zip Codes */}
          <RecentZipCodes />
        </div>

        <div className="h-16 bg-mikud-purple w-full" />
      </main>
    </Layout>
  );
}
