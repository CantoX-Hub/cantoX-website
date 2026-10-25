"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Button from "../common/Button";
import AudienceMarquee from "./AudienceMarquee";

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
    <section className="w-full pt-16 pb-12 relative overflow-hidden">
      <div className="maxContainer px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
        {/* Left Column: Text & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start max-w-[656px]"
        >
        {/* <div> </div> */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] mb-6 text-[#0F0F0F]"
          >
            Design your perfect day, <br className="hidden md:block" /> without
            the stress.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base mb-10 leading-relaxed max-w-[555px] font-medium"
          >
            Your wedding, beautifully presented. Pick a design, add your
            details, share your link, and Done.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flexStart flex-wrap gap-4 mb-16"
          >
            <Button
            href="/templates"
              variant="accent"  
             className="bg-[#C9933A] text-white"
              icon={<ArrowUpRight size={18} className="ml-1 text-white" />}
            >
              Browse templates
            </Button>
            <Button variant="outline" className="border-2" href="/get-started">Get started</Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="flex gap-5 md:gap-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <h2 className="text-[24px] sm:text-[32px]  text-[#060D18] mb-2">
                  {stat.value}
                </h2>
                <span className="text-sm sm:text-base text-center ">
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
          className="relative w-full h-full min-h-[400px] lg:max-h-[466px] flexCenter"
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
       <AudienceMarquee />
    </section>
  );
}
