import Head from "next/head";
import { Inter } from "next/font/google";
import Footer from "../components/footer";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Head>
        <title>👋 Mikud </title>
        <link rel="icon" href="/logo.ico" />
        <meta
          name="description"
          content="Find your local Israeli zip code fast and easy."
        />
        <meta name="keywords" content="Rishon, Zip Code, Mikud, Israel" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="theme-color" content="#05071a" />
      </Head>
      <div className={inter.className}>{children}</div>
      <Footer />
    </>
  );
};

export default RootLayout;
