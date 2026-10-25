
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

const steps = [
  {
    id: "step-1",
    num: "STEP 01",
    title: "Pick a template",
    desc: "200+ designs. Free to start. Yours in seconds.",
    icon: "/template.svg",
    image: "/step1.png",
    imageAlt: "Browse and choose a wedding invitation template",
  },
  {
    id: "step-2",
    num: "STEP 02",
    title: "Edit design",
    desc: "Add your names, date, venue, and photos. Every change updates live as you type.",
    icon: "/pen.svg",
    image: "/step2.png",
    imageAlt: "Personalize a wedding invitation with the Canto editor",
  },
  {
    id: "step-3",
    num: "STEP 03",
    title: "Share invite",
    desc: "Share one link with every guest. Works on web and mobile.",
    icon: "/share.svg",
    image: "/step3.png",
    imageAlt: "Share a personalized wedding invitation with guests",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex =
      latest < 1 / 3 ? 0 : latest < 2 / 3 ? 1 : 2;

    setActiveIndex((current) =>
      current === nextIndex ? current : nextIndex
    );
  });

  const activeStep = steps[activeIndex];

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative bg-[#0A0D14] py-16 md:min-h-[300vh] md:py-0"
    >
      {/* Sticky experience on desktop; normal flow on mobile */}
      <div className="relative flex w-full maxContainer flex-col justify-center px-[5%] md:sticky md:top-0 md:min-h-screen md:overflow-hidden md:py-10">
        {/* Header */}
        <header className="mb-10 text-center md:mb-12">
          <span className="mb-5 block text-[14px] font-medium tracking-widest text-[#C7E1F5]">
            HOW IT WORKS
          </span>

          <h2 className="mb-2 text-[24px] leading-tight tracking-[-0.005em] text-white sm:text-[32px]">
            Few step and you are done
          </h2>

          <p className="text-sm font-medium leading-6 text-white sm:text-base">
            From free to premium templates, personalize your invite
            to fully express yourself.
          </p>
        </header>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[0.75fr_1.6fr] md:gap-10 lg:grid-cols-[0.7fr_1.8fr] lg:gap-16">
          {/* Left: Interactive steps */}
          <div className="flex flex-col gap-3 md:gap-6">
            {steps.map((step, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`
                    group relative w-full text-left
                    transition-opacity duration-300
                    md:max-w-[269px]
                    ${
                      isActive
                        ? "opacity-100"
                        : "opacity-45 hover:opacity-75"
                    }
                  `}
                >
                  {/* Animated gold arrow for the active step */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key="active-arrow"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                        className="
                          absolute -left-4 top-[18px]
                          h-0 w-0
                          border-y-[6px] border-y-transparent
                          border-l-[7px] border-l-[#FABB18]
                        "
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex items-start gap-8">
                    <div className="mb-2 flex min-w-0 flex-1 flex-col gap-1.5 py-3 md:py-4">
                      <span className="mb-1 block text-[14px] tracking-wider text-[#EAF0F5]">
                        {step.num}
                      </span>

                      <h3
                        className={`
                          my-2 flex items-center gap-4
                          text-md transition-colors
                          sm:text-lg md:text-[24px]
                          ${
                            isActive
                              ? "text-white"
                              : "text-white/70"
                          }
                        `}
                      >
                        {step.title}

                        <Image
                          src={step.icon}
                          alt=""
                          width={22}
                          height={22}
                          aria-hidden="true"
                          className={`
                            h-5 w-5 shrink-0 object-contain
                            transition-opacity duration-300
                            ${
                              isActive
                                ? "opacity-100"
                                : "opacity-60"
                            }
                          `}
                        />
                      </h3>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key={`${step.id}-description`}
                            initial={{ opacity: 0, height: 0, y: 6 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              y: 5,
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                              y: -4,
                            }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-sm leading-relaxed text-[#EAF0F5]">
                              {step.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Animated image showcase */}
          <div className="relative min-w-0">
            <div className="relative w-full max-w-[900px] overflow-hidden">
              {/* Stable image frame prevents layout shifts */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#080D16] sm:aspect-[1.45/1]">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={activeStep.id}
                    initial={{
                      opacity: 0,
                      scale: 1.035,
                      x: 12,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.985,
                      x: -8,
                    }}
                    transition={{
                      opacity: {
                        duration: 0.45,
                        ease: "easeInOut",
                      },
                      scale: {
                        duration: 0.65,
                        ease: "easeOut",
                      },
                      x: {
                        duration: 0.45,
                        ease: "easeInOut",
                      },
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeStep.image}
                      alt={activeStep.imageAlt}
                      fill
                      className="object-cover object-top"
                      priority={activeIndex === 0}
                      sizes="(max-width: 768px) 90vw, 65vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
