"use client";
import Image from "next/image";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
interface PageHeroBannerProps {
  title: string;
  description?: string;
  backgroundImage: string;
  className?: string;
  children?: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};
export default function PageHeroBanner({
  title,
  description,
  backgroundImage,
  className = "",
  children,
}: PageHeroBannerProps) {
  return (
    <section
      className={`relative min-h-[300px] overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="page_hero"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#07101C]/25" />

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[279px] max-w-[1000px] items-center px-[5%] pb-12">
        <div className="max-w-[700px]">
          <motion.h1
                      variants={itemVariants}
                      className="text-5xl lg:text-[3.5rem] leading-[1.1] mb-6 text-white"
                    >
            {title}
          </motion.h1>

          {description && (
            <motion.p
                        variants={itemVariants}
                        className="text-[14px] md:text-base text-white/75 mb-10 leading-relaxed "
                      >
              {description}
            </motion.p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}