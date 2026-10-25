"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedin,
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#060D18] py-14 mt-14 sm:py-16 md:py-24">
      <div className="maxContainer px-5 sm:px-[5%] flex flex-col items-center text-center">

        {/* Logo */}
        <Link
          href="/"
          className="relative block h-[100px] md:min-h-[329px] md:w- [1440px] w-full"
        >
          <Image
            src="/canto-footer-logo.svg"
            alt="Canto"
            fill
            priority
            className="object-contain w-full"
          />
        </Link>

        {/* Tagline */}
        <p className="mt-4 md:text-[24px] text-white text-base">
          Crafted for the moments that change everything.
        </p>

        {/* Social Icons */}
        <div className="my-10 md:my-24 flex items-center gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="
                  flex h-7 w-7
                  items-center justify-center
                  text-white
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:text-[#FABB18]
                "
              >
                <Icon className="h-[24px] w-[24px]" />
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-10 w-full border-t border-white/15" />

        {/* Bottom Row */}
        <div
          className="
            mt-4 flex w-full
            flex-col-reverse
            items-center
            justify-between
            gap-3
            text-[14px]
            text-white
            sm:flex-row
          "
        >
          <p>2026. All rights reserved</p>

          <Link
            href="/terms"
            className="transition-colors hover:text-white"
          >
            Terms and conditions
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;