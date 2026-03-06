import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mikud-navy": "#101057",
        "mikud-purple": "#3300EE",
        "mikud-footer": "#05071a",
        "mikud-bg": "#f2fcfd",
        "mikud-navy-glass": "rgba(16,16,87,0.15)",
      },
      fontFamily: {
        "ibm-bold": ["IBMPlexSans-Bold", "sans-serif"],
        "ibm-regular": ["IBMPlexSans-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
