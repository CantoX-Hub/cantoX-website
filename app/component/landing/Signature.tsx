
"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Button from "../common/Button";

const SLIDE_DURATION = 10000;

const slides = [
  {
    logo: "/logo1.svg",
    image: "/muyiwa-x-adebisi.png",
    logoBg: "bg-[#E8DCCB]",
    alt: "Adebisi & Olumuyiwa wedding identity",
  },
  {
    logo: "/logo3.svg",
    image: "/nofisat-x-taofeck.png",
    logoBg: "bg-[#FFF]",
    alt: "Adebisi & Olumuyiwa wedding identity",
  },
];

export default function Signature() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const currentSlide = slides[currentIndex];

  const logoVariants = {
    initial: {
      opacity: 0,
      scale: 0.88,
      y: 8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        opacity: { duration: 0.8, ease: "easeOut" as const },
        scale: {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1] as const,
        },
        y: {
          duration: 1,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      y: -5,
      transition: { duration: 0.5, ease: "easeInOut" as const },
    },
  };

  const imageVariants = {
    initial: {
      opacity: 0,
      scale: 1.06,
      x: 12,
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        opacity: { duration: 0.9 },
        scale: { duration: 1.4, ease: "easeOut" as const },
        x: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      x: -8,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 md:py-24">
      <div className="maxContainer grid grid-cols-1 items-center gap-8 px-5 sm:px-[5%] lg:grid-cols-2">

        {/* Left Column */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 25 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.15,
                duration: 0.7,
              },
            },
          }}
          className="flex h-full max-h-[279px] max-w-[556px] flex-col items-start justify-between"
        >
          <div className="w-full md:max-w-[359px]">
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-[24px] leading-[1.15] text-[#11151D] sm:text-[32px]"
            >
              An iconic identity for your special chapter.
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mb-10 mt-4 text-base font-medium leading-relaxed text-[#4B5563]"
            >
              Delivered in 48 hours, expected formats are PNG, JPEG and PDF
              format.
            </motion.p>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mb-8 flex items-center gap-2 sm:mb-16"
          >
            <Button
              href="/request-logo"
              variant="accent"
              className="bg-[#C9933A] text-white"
              icon={<ArrowUpRight size={18} className="ml-1 text-white" />}
            >
              Request Logo
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column: Animated Showcase */}
        <div className="relative h-[220px] w-full overflow-hidden rounded-[4px] border border-[#000] shadow-sm sm:h-[279px]">

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 grid w-full grid-cols-2"
            >
              {/* Logo Showcase */}
              <div
                className={`relative flex h-full w-full items-center justify-center overflow-hidden p-6 ${currentSlide.logoBg}`}
              >
                <motion.div
                  variants={logoVariants}
                  className="relative h-full max-h-[110px] w-full max-w-[211px]"
                >
                  <Image
                    src={currentSlide.logo}
                    alt={currentSlide.alt}
                    fill
                    sizes="211px"
                    priority={currentIndex === 0}
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* Couple Image */}
              <div className="relative h-full w-full overflow-hidden bg-[#E5E7EB]">
                <motion.div
                  variants={imageVariants}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.alt}
                    fill
                    sizes="295px"
                    priority={currentIndex === 0}
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
