import Link from "next/link";
import { useMediaQuery } from "react-responsive";

const Footer = () => {
  // IsMobile
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <>
      {/* Footer */}
      <div
        className="h-1440"
        style={{
          backgroundColor: "var(--footer-black)",
          width: "100vw",
          height: "30%",
          position: isMobile ? "fixed" : "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Made with <3 */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: 0,
            left: 0,
            color: "white",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          <code>
            Made with ❤️ by{" "}
            <Link href="https://rishon.systems" target="_blank">
              rishon.systems
            </Link>{" "}
          </code>
        </div>

        {/* Credits */}
        <div
          style={{
            position: "absolute",
            left: isMobile ? "30%" : "30%",
            top: "10%",
            color: "white",
            fontSize: "16px",
            textAlign: "left",
            zIndex: 1,
          }}
        >
          <code>
            Special Thanks:
            <br /> ▪ {""}
            <Link
              href="https://www.npmjs.com/package/react-hot-toast"
              target="_blank"
            >
              react-hot-toast
            </Link>
            <br /> ▪ {""}
            <Link
              href="https://www.npmjs.com/package/react-icons"
              target="_blank"
            >
              react-icons
            </Link>
            <br /> ▪ {""}
            <Link href="https://www.zipy.co.il/" target="_blank">
              Zipy API
            </Link>
            <br /> ▪ {""}
            <Link href="https://info.data.gov.il/home/" target="_blank">
              Data Gov
            </Link>
          </code>
        </div>

        <div
          style={{
            position: "absolute",
            left: isMobile ? "30%" : "60%",
            top: isMobile ? "50%" : "10%",
            color: "white",
            fontSize: "16px",
            textAlign: "left",
            zIndex: 1,
          }}
        >
          <code>
            More Projects:
            <br /> ▪ {""}
            <Link href="https://track.rishon.systems" target="_blank">
              track.rishon.systems
            </Link>
            <br /> ▪ {""}
            <Link href="https://verart.org" target="_blank">
              verart.org
            </Link>
            <br /> ▪ {""}
            <Link href="https://pokesmp.net" target="_blank">
              pokesmp.net
            </Link>
          </code>
        </div>
      </div>
    </>
  );
};

export default Footer;
