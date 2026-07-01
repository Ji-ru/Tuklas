import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-on-primary mt-xl py-3 md:py-4 px-5 md:px-lg border-t border-white/20">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        {/* Brand */}
        <div>
          <Link to="/" className="font-headline-md text-headline-md text-white hover:text-white/80 transition-colors block">
            Tuklas
          </Link>
          <div className="font-label-sm text-label-sm text-white/70 mt-1 hidden md:block">
            © {new Date().getFullYear()} Tuklas Travel. Curated Serenity in the
            Archipelago.
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-md font-label-sm text-label-sm">
          <Link
            to="/souvenirs"
            className="text-white/70 hover:text-white hover:underline transition-all"
          >
            Souvenirs
          </Link>
          <Link
            to="/privacy"
            className="text-white/70 hover:text-white hover:underline transition-all"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-white/70 hover:text-white hover:underline transition-all"
          >
            Terms of Service
          </Link>
          <Link
            to="/insurance"
            className="text-white/70 hover:text-white hover:underline transition-all"
          >
            Travel Insurance
          </Link>
        </div>

        {/* Mobile copyright */}
        <div className="font-label-sm text-label-sm text-white/70 text-center md:hidden">
          © {new Date().getFullYear()} Tuklas Travel. Curated Serenity in the
          Archipelago.
        </div>
      </div>
    </footer>
  );
}
