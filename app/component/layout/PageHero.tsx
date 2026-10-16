"use client";
import { motion, MotionConfig, type Variants } from "framer-motion";
import Navbar from "./Navbar";

interface PageHeroBannerProps {
  /** Small gold label above the title, e.g. "Templates" */
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
    <section className={`bg-white px-[5%] ${className}`}>
      <Navbar />

      <MotionConfig reducedMotion="user">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="maxContainer pb-12 pt-14 md:pb-16 md:pt-20 lg:pt-24"
        >
          <div className="max-w-[1022px]">
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
              className="text-[32px] leading-[1.15] tracking-[-0.01em] text-[#060D18] sm:text-[40px] lg:text-[48px]"
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
  );
}