
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
    <aside className="flex w-full flex-col items-center pt-1 lg:sticky lg:top-12 lg:pt-0">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C99532]">
          Crafted for your story
        </span>

        <h2 className="text-2xl leading-tight tracking-[-0.005em] sm:text-3xl">
          Have it ready in 24hrs
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#777D87]">
          Have a peek at a few wedding identities we created.
        </p>
      </div>

      {/* Animated logo showcase */}
      <div
        className="relative w-full max-w-[420px]"
        aria-roledescription="carousel"
        aria-label="Wedding logo inspiration"
      >
        <div className="relative flex aspect-[1.05/1] w-full items-center justify-center overflow-hidden rounded-xl border border-[#E5EAF1] bg-white shadow-[0_12px_45px_rgba(17,21,29,0.04)]">
          {/* Soft decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C99532]/[0.06] blur-3xl"
          />

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
              className="absolute inset-0 flex items-center justify-center p-8 sm:p-10"
            >
              <Image
                src={currentLogo.image}
                alt={currentLogo.alt}
                fill
                priority={currentIndex === 0}
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-contain p-8 sm:p-10"
              />
            </motion.div>
          </AnimatePresence>

          {/* Current slide label */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-white via-white/95 to-transparent px-5 pb-6 pt-12 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentLogo.caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-medium tracking-wide text-[#777D87]"
              >
                {currentLogo.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Animated slide indicators */}
        {/* <div
          className="mt-5 flex items-center justify-center gap-2"
          aria-label={`Logo ${currentIndex + 1} of ${LOGO_SLIDES.length}`}
        >
          {LOGO_SLIDES.map((logo, index) => (
            <button
              key={logo.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show logo ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
              className={`relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300 ${
                currentIndex === index
                  ? "w-9 bg-[#E8EAF0]"
                  : "w-1.5 bg-[#D9DDE5] hover:bg-[#C99532]/60"
              }`}
            >
              {currentIndex === index && (
                <motion.span
                  key={`${logo.id}-${currentIndex}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                  className="absolute inset-0 origin-left rounded-full bg-[#C99532]"
                />
              )}
            </button>
          ))}
        </div> */}
      </div>

    </aside>
  );
}
