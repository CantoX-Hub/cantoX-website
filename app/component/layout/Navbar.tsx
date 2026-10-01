"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Button from "../common/Button";

interface NavbarProps {
  variant?: "light" | "dark";
}

const navLinks = [
  { name: "How it works", href: "/how-it-works" },
  { name: "Templates", href: "/templates" },
  { name: "Request logo", href: "/request-logo" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar({ variant = "light" }: NavbarProps) {
  const pathname = usePathname();

  // Home page uses the normal logo.
  // Every other page uses the white logo.
  const isHomePage = pathname === "/";

  const useWhiteLogo = !isHomePage || variant === "dark";

  const isDark = variant === "dark";

  return (
    <header className="w-full px-[5%] py-6">
      <div className="maxContainer flexBetween">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center tracking-tight"
        >
          <Image
            src={useWhiteLogo ? "/canto-white.svg" : "/logo.svg"}
            alt="Canto"
            width={100}
            height={30}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul
            className={`flex items-center gap-10 text-sm font-medium ${
              isDark || !isHomePage
                ? "text-white/60"
                : "text-[var(--text-muted)]"
            }`}
          >
            {navLinks.map((link) => (
              <motion.li
                key={link.name}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={link.href}
                  className={
                    isDark || !isHomePage
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

        {/* Action Button */}
        <div className="hidden md:block">
          <Button
            variant="outline"
            className={`rounded-lg px-5 py-2.5 ${
              isDark || !isHomePage
                ? "border-white/30 bg-white text-[#11151D] hover:bg-white/90"
                : ""
            }`}
          >
            Get started
          </Button>
        </div>

      </div>
    </header>
  );
}