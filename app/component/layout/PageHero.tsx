"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import Navbar from "./Navbar";

interface PageHeroBannerProps {
  /** Small gold label above the title */
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function PageHeroBanner({
  eyebrow,
  title,
  description,
  className = "",
  children,
}: PageHeroBannerProps) {
  return (
    <>
      {/* Navbar sits OUTSIDE the section: a sticky element only sticks
          within its parent, so inside <section> it would scroll away
          once the hero ends. */}
      <Navbar />

      <section className={`bg-white ${className}`}>
        <MotionConfig reducedMotion="user">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pb-12 pt-14 md:pb-8 md:pt-20 lg:pt-24"
          >
            <div className="maxContainer px-[5%]">
              {eyebrow && (
                <motion.p
                  variants={itemVariants}
                  className="mb-3 text-sm font-medium text-[#C99532] md:mb-4"
                >
                  {eyebrow}
                </motion.p>
              )}

              <motion.h1
                variants={itemVariants}
                className="text-[32px] max-w-[1022px] leading-[1.15] tracking-[-0.01em] text-[#060D18] sm:text-[40px] lg:text-[48px]"
              >
                {title}
              </motion.h1>

              {description && (
                <motion.p
                  variants={itemVariants}
                  className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-[#4B5563] md:mt-5 md:text-base"
                >
                  {description}
                </motion.p>
              )}

              {children && (
                <motion.div variants={itemVariants} className="mt-8">
                  {children}
                </motion.div>
              )}
            </div>
          </motion.div>
        </MotionConfig>
      </section>
    </>
  );
}