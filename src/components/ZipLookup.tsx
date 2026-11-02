import Script from "next/script";
import { forwardRef, useState, type FormEvent, type Ref } from "react";
import toast, { Toaster } from "react-hot-toast";
import AddressInput, {
  type AddressInputHandle,
  type Place,
} from "@/components/AddressInput";
import RecentZipCodes from "@/components/RecentZipCodes";
import { getZipCode, type ZipLookup as LookupResult } from "@/services/zipApi";
import { trackEvent } from "@/lib/analytics";
import { saveRecentZipCode } from "@/lib/zipHistory";
import {
  TURNSTILE_SCRIPT_URL,
  TURNSTILE_SITE_KEY,
  getTurnstileToken,
} from "@/lib/turnstile";
import { useT } from "@/i18n";

const inputValue = (id: string) =>
  (document.getElementById(id) as HTMLInputElement | null)?.value ?? "";

const failureResult = (error: LookupResult["error"]) => {
  if (error === "rate_limited") return "rate_limited";
  if (error === "bot") return "blocked";
  return error ? "error" : "not_found";
};

type ZipLookupProps = {
  heading: string;
  subheading: string;
  initialCity?: Place;
};

function ZipLookup(
  { heading, subheading, initialCity }: ZipLookupProps,
  ref: Ref<AddressInputHandle>,
) {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");

  async function copyToKeyboard() {
    if (zipCode === "") return;
    await navigator.clipboard.writeText(zipCode);
    toast.success(t.toastCopied);
    trackEvent("zip_copy", { source: "result" });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
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
      trackEvent("zip_lookup_failed", { result: "incomplete" });
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
        trackEvent("zip_lookup_failed", {
          result: failureResult(result.error),
        });
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
      trackEvent("zip_found");
    } catch {
      toast.error(t.toastError);
      trackEvent("zip_lookup_failed", { result: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 md:min-h-[calc(100svh-4rem)]">
      {TURNSTILE_SITE_KEY && (
        <Script src={TURNSTILE_SCRIPT_URL} strategy="afterInteractive" />
      )}
      <Toaster />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-mikud-navy text-5xl md:text-6xl font-ibm-bold text-center mb-4">
          {heading}
        </h1>

        <p className="text-mikud-navy text-xl md:text-2xl font-ibm-regular text-center mb-8">
          {subheading}
        </p>

        <form
          onSubmit={submitForm}
          noValidate
          className="w-full flex flex-col items-center"
        >
          <AddressInput ref={ref} initialCity={initialCity} />

          <div className="flex flex-row-reverse flex-wrap gap-2.5 mt-6 font-ibm-regular justify-center md:justify-end w-full max-w-[720px] px-4 md:px-0">
            <button
              type="button"
              onClick={copyToKeyboard}
              aria-live="polite"
              data-clarity-mask="True"
              className="h-8 rounded-lg bg-mikud-navy-glass text-start px-2.5 text-mikud-navy text-base font-ibm-regular cursor-pointer"
            >
              {zipCode === ""
                ? t.resultPlaceholder
                : `${t.resultPrefix} ${zipCode}`}
            </button>
            <button
              type="submit"
              className={`w-32 h-8 rounded-lg bg-mikud-purple text-white text-base cursor-pointer transition-opacity ${
                loading ? "opacity-50" : "opacity-100"
              }`}
              disabled={loading}
            >
              {t.search}
            </button>
          </div>
        </form>
      </div>

      <RecentZipCodes />
    </div>
  );
}

export default forwardRef(ZipLookup);
