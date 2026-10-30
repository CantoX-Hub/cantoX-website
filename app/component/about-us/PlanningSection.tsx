
"use client";

import { motion, useReducedMotion } from "framer-motion";

const paragraphs = [
  <>
    Today, a celebration is held together by a freelance designer and weeks of
    revisions for the invitation, WhatsApp threads for guests, a spreadsheet
    nobody fully trusts, and Instagram DMs for vendors you can't verify.
    Weddings, birthdays, naming ceremonies: the mess is the same.
  </>,
  <>
    We took the back-and-forth out. Hosts come to CantoX, pick an invitation
    they love, and edit it themselves in minutes — no designer, no revision
    rounds, no waiting.
  </>,
  <>
    Then we connected everything else to it: the guest list, the seating, the
    vendors, the wishlist. One place, one link, one source of truth for any
    occasion.
  </>,
];

export default function PlanningSection() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.75,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 md:py-28">
      <div className="maxContainer px-5 sm:px-[5%] w-full">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Left column */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="max-w-[357px] text-[24px] leading-[1.15] tracking-[-0.045em] text-[#11151D] sm:text-[32px]">
              Planning a celebration shouldn&apos;t take five tools.
            </h2>
          </motion.div>

          {/* Right column */}
          <motion.div
            className="flex min-w-0 flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: shouldReduceMotion ? 0 : 0.18,
                  delayChildren: shouldReduceMotion ? 0 : 0.12,
                },
              },
            }}
          >
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={reveal}
                className={` text-sm font-medium leading-[1.9] text-[#060D18] sm:text-base ${
                  index !== paragraphs.length - 1 ? "mb-6 sm:mb-8" : ""
                }`}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
