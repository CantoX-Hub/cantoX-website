"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../common/Button";

const navLinks = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Templates", href: "#templates" },
  { name: "Request logo", href: "#request-logo" },
  { name: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  return (
    <header className="w-full py-6 px-[5%]">
      <div className="maxContainer flexBetween">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center tracking-tight">
         <Image
                  src="/logo.svg"
                  alt="Logo"
                  aria-hidden="true"
                  width={100}
                  height={30}
               
                />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-10 text-[var(--text-muted)] text-sm font-medium">
            {navLinks.map((link) => (
              <motion.li key={link.name} whileHover={{ y: -2 }}>
                <Link href={link.href} className="hover:text-black transition-colors">
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
          <Button variant="outline" className="py-2.5 px-5 rounded-lg">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}