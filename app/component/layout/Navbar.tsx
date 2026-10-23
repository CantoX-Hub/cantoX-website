"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "../common/Button";

const navLinks = [
  { name: "About Us", href: "/about" },
  { name: "Templates", href: "/templates" },
  { name: "Request logo", href: "/request-logo" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    setIsMenuOpen(false);
    router.push("/get-started");
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full  py-5 md:py-6 bg-white">
      <div className="maxContainer px-[5%] flex items-center justify-between">
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
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium lg:gap-10 text-[var(--text-muted,#6B7280)]">
            {navLinks.map((link) => (
              <motion.li
                key={link.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#0F0F0F]"
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
            className="rounded-lg px-5 py-2.5 border-[#0F0F0F] text-[#0F0F0F] hover:bg-gray-50"
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
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0F0F0F] hover:bg-black/5 md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-[5%] right-[5%] top-full mt-2 overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-xl md:hidden"
          >
            <nav>
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={handleNavClick}
                        className={`block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-black/5 text-[#0F0F0F]"
                            : "text-[var(--text-muted,#6B7280)] hover:bg-black/5 hover:text-[#0F0F0F]"
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