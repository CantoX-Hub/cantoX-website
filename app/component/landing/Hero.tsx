"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Button from "../common/Button";

const stats = [
  { value: "200+", label: "Templates" },
  { value: "4,800+", label: "Happy couples" },
  { value: "48hrs", label: "Logo delivery" },
];

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

export default function Hero() {
  return (
    <section className="w-full pt-16 px-[5%] pb-24 relative overflow-hidden">
      <div className="maxContainer grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
        {/* Left Column: Text & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start max-w-[656px]"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl lg:text-[3.5rem] leading-[1.1] mb-6 text-[#0F0F0F]"
          >
            Design your perfect day, <br className="hidden md:block" /> without
            the stress.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-[var(--text-muted)] mb-10 leading-relaxed max-w-md"
          >
            Your wedding, beautifully presented. Pick a design, add your
            details, share your link, and Done.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flexStart flex-wrap gap-4 mb-16"
          >
            <Button
              variant="primary"
              icon={<ArrowUpRight size={18} className="ml-1 text-gray-300" />}
            >
              Browse templates
            </Button>
            <Button variant="outline">Get started</Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="flexStart gap-10 md:gap-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-[#0F0F0F] mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-full min-h-[400px] lg:min-h-[600px] flexCenter"
        >

          <Image
            src="/couple-illustration.svg"
            alt="Wedding couple illustration"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
