"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "../common/Button";

const navLinks = [
  { name: "About Us", href: "/about" },
  { name: "Templates", href: "/templates" },
  { name: "Request logo", href: "/request-logo" },
  { name: "Pricing", href: "/pricing" },
];

/** How far (px) the page must scroll before the glass style kicks in */
const SCROLL_THRESHOLD = 12;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position. Runs once on mount too, so a reload
  // mid-page starts in the right state.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleGetStarted = () => {
    setIsMenuOpen(false);
    router.push("/get-started");
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Glass when scrolled, or when the mobile menu is open over content
  const isGlass = isScrolled || isMenuOpen;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow,padding] duration-300 ease-out ${
        isGlass
          ? "border-black/5 bg-white/85 py-3 shadow-[0_4px_24px_rgba(6,13,24,0.06)] supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150 md:py-4"
          : "border-transparent bg-white py-5 md:py-6"
      }`}
    >
      <div className="maxContainer px-5 sm:px-[5%] w-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center tracking-tight"
        >
          <Image
            src="/logo.svg"
            alt="Canto"
            width={100}
            height={30}
            priority
            className="h-auto w-[90px] md:w-[100px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium lg:gap-10 text-[var(--text-muted,#6B7280)]">
            {navLinks.map((link) => (
              <motion.li
                key={link.name}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`transition-colors hover:text-[#0F0F0F] ${
                    pathname === link.href ? "text-[#0F0F0F]" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Desktop Get Started */}
        <div className="hidden md:block">
          <Button
            variant="outline"
            onClick={handleGetStarted}
            className="px-5 py-2.5 border-2 text-[#0F0F0F]"
          >
            Get started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0F0F0F] hover:bg-black/5 md:hidden"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
         <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[5%] right-[5%] top-full mt-2 overflow-hidden rounded-2xl border border-black/5 bg-[#C99532] p-4 shadow-xl md:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={handleNavClick}
                        aria-current={isActive ? "page" : undefined}
                       className={`block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-black/10 text-[#0F0F0F]"
                              : "text-[#0F0F0F] hover:bg-black/10"
                          }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Get Started */}
              <div className="mt-3 border-t border-black/5 pt-4">
                <Button
                  variant="outline"
                  onClick={handleGetStarted}
                  className="w-full rounded-xl py-3 border-[#0F0F0F] text-[#0F0F0F] hover:bg-gray-50"
                >
                  Get started
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}