import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TuklasLogo from "../../assets/Tuklas_Logo_Rounded.png";

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const headerBase =
    "fixed top-0 left-0 w-full z-50 transition-all duration-300";
  const headerStyle = isHome
    ? `${headerBase} backdrop-blur-md`
    : `${headerBase} bg-surface/90 backdrop-blur-md shadow-[0_8px_20px_rgba(0,51,102,0.08)]`;

  const logoStyle = isHome && !isMenuOpen ? "text-white" : "text-primary";

  const navLinkBase =
    "text-label-md font-label-md px-3 py-2 rounded-md transition-all duration-200";

  const getNavStyle = (path: string) => {
    const active = pathname === path;
    if (isHome) {
      return active
        ? `${navLinkBase} text-white font-bold border-b-2 border-white pb-1`
        : `${navLinkBase} text-white/80 hover:text-white hover:bg-white/10`;
    }
    return active
      ? `${navLinkBase} text-primary font-bold border-b-2 border-secondary pb-1`
      : `${navLinkBase} text-on-surface-variant hover:text-primary hover:bg-surface-container-low`;
  };

  return (
    <>
      <header className={headerStyle}>
        {/* Adjust vertical padding here (e.g., py-2 md:py-3) to change the navigation bar's thickness/height */}
        <div className="max-w-[1200px] mx-auto w-full px-5 md:px-lg py-2 md:py-3 flex items-center justify-between relative">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-2 font-headline-lg text-headline-lg font-bold tracking-tight z-50 ${logoStyle}`}
          >
            <img
              src={TuklasLogo}
              alt="Tuklas Logo"
              className="w-10 h-10 object-contain rounded-full bg-white/10"
            />
            Tuklas
          </Link>

          {/* Center Nav — Desktop */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-lg">
            <Link to="/" className={getNavStyle("/")}>
              Home
            </Link>
            <Link to="/explore" className={getNavStyle("/explore")}>
              Explore
            </Link>
            <Link to="/chat" className={getNavStyle("/chat")}>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: pathname === '/chat' ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
                AI Chat
              </span>
            </Link>
            <Link to="/sample-trip" className={getNavStyle("/sample-trip")}>
              Trips
            </Link>
            <Link to="/about" className={getNavStyle("/about")}>
              About
            </Link>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-base md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center z-50"
              style={{ color: (isHome && !isMenuOpen) ? "white" : "var(--color-primary)" }}
              aria-label="Toggle Dark Mode"
            >
              <span className="material-symbols-outlined">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <Link
              to="/plan"
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:bg-primary-container transition-colors shadow-sm active:scale-95 hidden md:inline-block"
            >
              Create Itinerary
            </Link>
            {/* Mobile hamburger button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors z-50"
              aria-label="Toggle navigation menu"
            >
              <span
                className="material-symbols-outlined"
                style={{ color: (isHome && !isMenuOpen) ? "white" : "var(--color-primary)" }}
              >
                {isMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-surface/98 backdrop-blur-lg z-45 flex flex-col justify-center items-center gap-md">
          <nav className="flex flex-col items-center gap-md text-center">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`font-headline-md text-headline-md text-primary ${pathname === '/' ? 'font-bold text-secondary' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setIsMenuOpen(false)}
              className={`font-headline-md text-headline-md text-primary ${pathname === '/explore' ? 'font-bold text-secondary' : ''}`}
            >
              Explore
            </Link>
            <Link
              to="/chat"
              onClick={() => setIsMenuOpen(false)}
              className={`font-headline-md text-headline-md text-primary flex items-center gap-2 ${pathname === '/chat' ? 'font-bold text-secondary' : ''}`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: pathname === '/chat' ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
              AI Chat
            </Link>
            <Link
              to="/sample-trip"
              onClick={() => setIsMenuOpen(false)}
              className={`font-headline-md text-headline-md text-primary ${pathname === '/sample-trip' ? 'font-bold text-secondary' : ''}`}
            >
              Trips
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`font-headline-md text-headline-md text-primary ${pathname === '/about' ? 'font-bold text-secondary' : ''}`}
            >
              About
            </Link>
            <Link
              to="/plan"
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3.5 rounded-full hover:bg-primary-container transition-colors shadow-md mt-4 inline-block active:scale-95"
            >
              Create Itinerary
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
