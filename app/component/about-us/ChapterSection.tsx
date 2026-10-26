"use client";

import Image from "next/image";
import { TbMinusVertical } from "react-icons/tb";
import { motion, Variants } from "framer-motion";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const lineGrow: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ChapterSection() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-28 overflow-hidden">
      <div className="maxContainer px-5 sm:px-[5%] w-full">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          
          {/* ================= LEFT COLUMN (Sticky Title & Subtitle) ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h2 className="max-w-[357px] text-[24px] leading-[1.15] tracking-[-0.045em] text-[#11151D] sm:text-[32px]">
              A chapter, and the experience of living it.
            </h2>
            
            <div className="flex items-center font-medium mt-4">
              {/* Animated Gold Line */}
              <motion.div
                variants={lineGrow}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="origin-top"
              >
                <TbMinusVertical className="text-[#C9933A]" />
              </motion.div>

              <p className="max-w-[420px] text-sm leading-6 sm:text-base">
                Canto is your chapter. CantoX is how you experience it.
              </p>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN (Staggered Story Content) ================= */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex min-w-0 flex-col font-medium"
          >
            {/* 1. Brand description */}
            <motion.div variants={fadeInUp} className="border-b border-[#E5EAF1] pb-7">
              <p className="text-xs font-semibold text-[#11151D] sm:text-sm">
                Canto: noun · <span className="italic">Italian / Latin</span>
              </p>

              <p className="mt-4 text-sm leading-6 sm:text-base">
                A division of an epic poem. Dante split the Divine Comedy into
                a hundred of them, each one a chapter complete in itself,
                each one part of a larger journey.
              </p>
            </motion.div>

            {/* 2. The experience */}
            <motion.div variants={fadeInUp} className="border-b border-[#E5EAF1] py-7">
              <h3 className="text-base">
                The experience
              </h3>

              <p className="mt-4 text-sm leading-6 sm:text-base">
                A chapter is more than the words on the page. It’s everyone who
                gathers, everyone who helps, and every moment inside it.
              </p>
            </motion.div>

            {/* 3. Image Reveal */}
            <motion.div 
              variants={fadeInUp}
              className="relative mt-7 aspect-[4/3] w-full overflow-hidden rounded-md bg-[#EAF0F5] sm:aspect-[5/4]"
            >
              <motion.div
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                className="relative w-full h-full"
              >
                <Image
                  src="/about-couple.png"
                  alt="A couple sharing an intimate moment on their wedding day"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 560px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}