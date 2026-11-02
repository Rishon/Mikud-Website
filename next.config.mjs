/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  i18n: {
    locales: ["he", "en"],
    defaultLocale: "he",
    localeDetection: false,
  },
};

export default nextConfig;
