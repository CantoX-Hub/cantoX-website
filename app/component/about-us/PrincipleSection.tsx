
"use client";

import { motion, useReducedMotion } from "framer-motion";

const principles = [
  {
    number: "01",
    title: "Take the burden off",
    description:
      "If a task needs a designer, a spreadsheet and three apps, we haven't finished building it yet.",
  },
  {
    number: "02",
    title: "Trust is built in",
    description:
      "Vendors are verified against business registration documents, reviewed by real clients, and can be reported. Money and trust move together.",
  },
  {
    number: "03",
    title: "Made for how we celebrate",
    description:
      "Multi-day ceremonies, family names, traditional and white weddings, prices in naira. We start from here, not from somewhere else.",
  },
  {
    number: "04",
    title: "Beautiful by default",
    description:
      "You shouldn't need a design eye to send something you're proud of. Every template is finished before you touch it.",
  },
];

export default function PrincipleSection() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: shouldReduceMotion
      ? { opacity: 1, x: 0, y: 0 }
      : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 md:py-28">
      <div className="maxContainer w-full px-[5%]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Left column */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="max-w-[357px] text-[24px] leading-[1.15] text-[#11151D] sm:text-[32px]">
              Four principles behind every decision.
            </h2>
          </motion.div>

          {/* Right column */}
          <motion.div
            className="flex min-w-0 flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.16,
                  delayChildren: shouldReduceMotion ? 0 : 0.1,
                },
              },
            }}
          >
            {principles.map((principle, index) => (
              <motion.article
                key={principle.number}
                variants={reveal}
                className={`group relative max-w-[496px] py-7 first:pt-0 last:pb-0 ${
                  index !== principles.length - 1
                    ? "border-b border-[#E1E7EF]"
                    : ""
                }`}
              >
                {/* Number */}
                <motion.span
                  className="mb-2 block text-sm font-medium tracking-wide text-[#C99532]"
                  whileHover={
                    shouldReduceMotion ? undefined : { x: 3 }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {principle.number}
                </motion.span>

                {/* Title */}
                <h3 className="text-base leading-5 text-[#11151D] transition-colors duration-300 group-hover:text-[#B78628]">
                  {principle.title}
                </h3>

                {/* Description */}
                <p className="mt-3 max-w-[470px] text-sm font-medium leading-[1.5] text-[#060D18 sm:text-base">
                  {principle.description}
                </p>

                {/* Subtle divider highlight */}
                {index !== principles.length - 1 && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute bottom-[-1px] left-0 h-px bg-[#C99532]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.8,
                      delay: shouldReduceMotion ? 0 : 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                )}
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
