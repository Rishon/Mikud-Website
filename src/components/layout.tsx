import Head from "next/head";
import { Inter } from "next/font/google";
import Footer from "../components/footer";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Head>
        <title>Mikud</title>
        <meta name="description" content="Find a Zip code from an address" />
      </Head>
      <div className={inter.className}>{children}</div>
      <Footer />
    </>
  );
};

export default RootLayout;
