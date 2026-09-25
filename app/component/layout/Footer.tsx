"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaSquareFacebook,
} from "react-icons/fa6";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FaSquareFacebook,
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#060D18] px-[5%] py-14 mt-14 md:py-16">
      <div className="maxContainer flex flex-col items-center text-center">

        {/* Logo */}
        <Link
          href="/"
          className="relative block h-[100px] w-[220px] md:h-[224px] md:w-[960px]"
        >
          <Image
            src="/canto-footer-logo.svg"
            alt="Canto"
            fill
            priority
            className="object-contain"
          />
        </Link>

        {/* Tagline */}
        <p className="mt-4 text-[14px] text-gray-300 md:text-base">
          Crafted for the moments that change everything.
        </p>

        {/* Social Icons */}
        <div className="my-10 flex items-center gap-4">
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
            text-gray-400
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