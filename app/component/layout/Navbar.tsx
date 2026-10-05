"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "../common/Button";

interface NavbarProps {
  variant?: "light" | "dark";
}

const navLinks = [
  { name: "About Us", href: "/about" },
  { name: "Templates", href: "/templates" },
  { name: "Request logo", href: "/request-logo" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar({ variant = "light" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Home page uses the normal logo.
  // Other pages use the white logo.
  const isHomePage = pathname === "/";
  const isDark = variant === "dark";

  const useWhiteLogo = !isHomePage || isDark;

  const isDarkNavbar = isDark || !isHomePage;

  const handleGetStarted = () => {
    setIsMenuOpen(false);
    router.push("/get-started");
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full px-[5%] py-5 md:py-6">
      <div className="maxContainer flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center tracking-tight"
        >
          <Image
            src={useWhiteLogo ? "/canto-white.svg" : "/logo.svg"}
            alt="Canto"
            width={100}
            height={30}
            priority
            className="h-auto w-[90px] md:w-[100px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul
            className={`flex items-center gap-8 text-sm font-medium lg:gap-10 ${
              isDarkNavbar
                ? "text-white/60"
                : "text-[var(--text-muted)]"
            }`}
          >
            {navLinks.map((link) => (
              <motion.li
                key={link.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className={
                    isDarkNavbar
                      ? "transition-colors hover:text-white"
                      : "transition-colors hover:text-black"
                  }
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
            className={`rounded-lg px-5 py-2.5 ${
              isDarkNavbar
                ? "border-white/30 bg-white text-[#11151D] hover:bg-white/90"
                : ""
            }`}
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
          className={`flex h-10 w-10 items-center justify-center rounded-lg md:hidden ${
            isDarkNavbar
              ? "text-white hover:bg-white/10"
              : "text-black hover:bg-black/5"
          }`}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-[5%] right-[5%] top-full mt-2 overflow-hidden rounded-2xl border shadow-xl md:hidden ${
              isDarkNavbar
                ? "border-white/10 bg-[#0A0D14]"
                : "border-black/5 bg-white"
            }`}
          >
            <nav className="p-4">
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={handleNavClick}
                        className={`block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                          isDarkNavbar
                            ? isActive
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                            : isActive
                              ? "bg-black/5 text-black"
                              : "text-[var(--text-muted)] hover:bg-black/5 hover:text-black"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Get Started */}
              <div className="mt-3 border-t border-black/5 pt-4 dark:border-white/10">
                <Button
                  variant="outline"
                  onClick={handleGetStarted}
                  className={`w-full rounded-xl py-3 ${
                    isDarkNavbar
                      ? "border-white/20 bg-white text-[#11151D] hover:bg-white/90"
                      : ""
                  }`}
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