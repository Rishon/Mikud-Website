import Head from "next/head";
import { Inter } from "next/font/google";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Head>
        <title>מיקוד | חיפוש מיקוד בישראל</title>
        <meta
          name="description"
          content="חיפוש מיקוד בישראל לפי כתובת. הזינו עיר, רחוב ומספר בית וקבלו מיקוד מיידית. Israeli zip code lookup by address."
        />
        <meta
          name="keywords"
          content="מיקוד, חיפוש מיקוד, מיקוד ישראל, zip code Israel, mikud, דואר ישראל, postal code, איתור מיקוד"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#05071a" />
        <meta charSet="utf-8" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="מיקוד | חיפוש מיקוד בישראל" />
        <meta
          property="og:description"
          content="חיפוש מיקוד בישראל לפי כתובת. הזינו עיר, רחוב ומספר בית וקבלו מיקוד מיידית."
        />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:locale:alternate" content="en_US" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="מיקוד | חיפוש מיקוד בישראל" />
        <meta
          name="twitter:description"
          content="חיפוש מיקוד בישראל לפי כתובת."
        />
      </Head>
      <div
        className={`${inter.className} min-h-screen flex flex-col bg-mikud-bg`}
      >
        {children}
        <Footer />
      </div>
    </>
  );
};

export default RootLayout;
