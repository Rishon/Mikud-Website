import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-mikud-footer py-8 px-8 font-ibm-regular">
      <div className="flex flex-col md:flex-row justify-around gap-6 mb-6">
        {/* Credits */}
        <div className="text-white text-sm text-right space-y-1.5">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2 font-ibm-bold">
            תודות מיוחדות
          </p>
          <p>
            ▪{" "}
            <Link
              href="https://israelpost.co.il"
              target="_blank"
              className="hover:text-white/70 transition-colors"
            >
              דואר ישראל
            </Link>
          </p>
        </div>

        {/* More Projects */}
        <div className="text-white text-sm text-right space-y-1.5">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2 font-ibm-bold">
            עוד פרויקטים
          </p>
          <p>
            ▪{" "}
            <Link
              href="https://rishon.systems/projects"
              target="_blank"
              className="hover:text-white/70 transition-colors"
            >
              rishon.systems
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        {/* Made with love */}
        <p className="text-center text-white/50 text-xs">
          נבנה באהבה ❤️ על ידי{" "}
          <Link
            href="https://rishon.systems"
            target="_blank"
            className="hover:text-white/70 transition-colors"
          >
            rishon.systems
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
