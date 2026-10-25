"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const CAROUSEL_SLIDES = [
  {
    id: 1,
    src: "/couple-banner.png",
    alt: "Adeola x Joshua - 2026",
  },
  {
    id: 2,
    src: "/couple-banner-2.png",
    alt: "Adebisi x Muyiwa - 2026",
  },
  {
    id: 3,
    src: "/couple-banner-3.png",
    alt: "Itunu x Stephen - 2026",
  },
  {
    id: 4,
    src: "/couple-banner-4.png",
    alt: "La’Posh Events - 2026",
  },
];

const SLIDE_DURATION = 5000;

const HappyCouple = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-white py-12 sm:py-20 md:py-24">
      {/* Header */}
      <div className="relative maxContainer px-5 sm:px-[5%] z-10 flex flex-col items-center text-center">
        <h2 className="mb-3 text-[24px] leading-tight tracking-[-0.005em] sm:text-[32px]">
          Happy couples use CantoX
        </h2>

         <p className="text-center font-medium leading-relaxed text-[#060D18] text-base sm:text-[24px]">
          Ready in minutes, not days...designed for couples not designers.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative mt-8 w-full">
        <div className="relative z-10 px-[5%] w-full maxContainer">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#EAF0F5] shadow-sm sm:aspect-[16/9] max-h-[546px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Happy couples using Canto"
          >
            {/* Sliding image track */}
            <div
              className="flex h-full max-h-[546px] w-full transition-transform duration-1000 ease-in-out motion-reduce:transition-none"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {CAROUSEL_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className="relative h-full max-h-[546px] w-full flex-shrink-0"
                  aria-hidden={currentSlide !== index}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 1440px"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>

            {/* Bottom gradient for caption readability */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/75 via-black/35 to-transparent sm:h-40" />

            {/* Animated bottom-left caption */}
            <div
              className="pointer-events-none absolute bottom-5 left-5 z-20 w-full "
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={CAROUSEL_SLIDES[currentSlide].id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-sm font-medium leading-relaxed text-white drop-shadow-md sm:text-base "
                >
                  {CAROUSEL_SLIDES[currentSlide].alt}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Slide indicators */}
            <div
              className="absolute bottom-5 right-5 z-20 flex items-center gap-2"
              aria-label="Choose a wedding image"
            >
              {CAROUSEL_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show image ${index + 1} of ${CAROUSEL_SLIDES.length}`}
                  aria-current={currentSlide === index ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-12 sm:w-24 bg-[#C99532]"
                      : "w-6 bg-white/30 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappyCouple;