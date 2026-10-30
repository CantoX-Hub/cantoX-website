
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LOGO_SLIDES = [
  {
    id: 1,
    image: "/logo1.svg",
    alt: "Elegant custom wedding logo design",
    caption: "Elegant & timeless",
  },
  {
    id: 2,
    image: "/logo2.svg",
    alt: "Personalized wedding monogram",
    caption: "Made just for you",
  },
  {
    id: 3,
    image: "/logo3.svg",
    alt: "Luxury wedding identity design",
    caption: "Luxury in every detail",
  },
  {
    id: 4,
    image: "/logo1.svg",
    alt: "Classic wedding identity",
    caption: "Your story, beautifully told",
  },
  {
    id: 5,
    image: "/logo2.svg",
    alt: "Minimal wedding monogram",
    caption: "Simple. Meaningful. Yours.",
  },
  {
    id: 6,
    image: "/logo3.svg",
    alt: "Beautiful personalized wedding branding",
    caption: "A signature of your love",
  },
];

const SLIDE_DURATION = 5000;

export default function LogoPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % LOGO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, []);

  const currentLogo = LOGO_SLIDES[currentIndex];

  return (
    <aside className="flex w-full max-w-[421px] flex-col items-center pt-1 lg:sticky lg:top-12 lg:pt-0">
      {/* Header */}
      <div className="mb-8 text-center">
       
        <h2 className="text-2xl leading-tight tracking-[-0.005em] sm:text-3xl">
          Have it ready in 24hrs
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#777D87]">
          Have a peek at a few wedding identities we created.
        </p>
      </div>

      {/* Animated logo showcase */}
        <div
          className="flex h-[344px] w-full max-w-[421px] items-center justify-center
            overflow-hidden rounded-md border border-[#E2E8F0] bg-white p-6
            shadow-[0_12px_45px_rgba(17,21,29,0.04)]"
          aria-roledescription="carousel"
          aria-label="Wedding logo inspiration"
        >
          <div className="relative h-[144px] w-full max-w-[293px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLogo.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 0, scale: 0.94, y: 10 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.03, y: -6 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.15 : 0.7,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <Image
                  src={currentLogo.image}
                  alt={currentLogo.alt}
                  fill
                  priority={currentIndex === 0}
                  sizes="293px"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

    </aside>
  );
}
