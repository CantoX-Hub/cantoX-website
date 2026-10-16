"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  PenTool,
  Share,
  FilePen,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    id: "step-1",
    num: "STEP 01",
    title: "Pick a template",
    desc: "200+ designs. Free to start. Yours in seconds.",
    icon: FilePen,
    image: "/step1.png",
    imageAlt: "Browse and choose a wedding invitation template",
  },
  {
    id: "step-2",
    num: "STEP 02",
    title: "Edit design",
    desc: "Add your names, date, venue, and photos. Every change updates live as you type.",
    icon: PenTool,
    image: "/step2.png",
    imageAlt: "Personalize a wedding invitation with the Canto editor",
  },
  {
    id: "step-3",
    num: "STEP 03",
    title: "Share invite",
    desc: "Share one link with every guest. Works on web and mobile.",
    icon: Share,
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
  const ActiveIcon = activeStep.icon;

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative bg-[#0A0D14] px-[5%] py-16 md:min-h-[300vh] md:py-0"
    >
      {/* Sticky experience on desktop; normal flow on mobile */}
      <div className="relative flex w-full maxContainer flex-col justify-center md:sticky md:top-0 md:min-h-screen md:overflow-hidden md:py-10">
        {/* Header */}
        <header className="mb-10 text-center md:mb-12">
          <span className="mb-3 text-xs font-semibold tracking-widest text-[#857E75]">
              HOW IT WORKS
            </span>

          <h2 className="mb-3 text-[24px] sm:text-[32px] leading-tight tracking-[-0.005em] md:text-[48px] text-white">
              Few step and you are done
            </h2>

          <p className="text-sm leading-6 text-[#A7AFBF] sm:text-base">
            From free to premium templates, personalize your invite
            to fully express yourself.
          </p>
        </header>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[0.75fr_1.6fr] md:gap-10 lg:grid-cols-[0.7fr_1.8fr] lg:gap-16">
          {/* Left: Interactive steps */}
          <div className="flex flex-col gap-3 md:gap-6">
            {steps.map((step, index) => {
              const isActive = activeIndex === index;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={`
                    group relative w-full max-w-[269px]
                    text-left transition-all duration-300
                    md:border-transparent md:bg-transparent md:p-0
                    ${
                      isActive
                        ? "border-[#FABB18]/30 bg-white/[0.06]"
                        : "border-white/[0.06] bg-transparent md:opacity-45 md:hover:opacity-75"
                    }
                  `}
                >
                  <div className="flex items-start gap-8">
                    {/* Active indicator / step icon */}
                    {/* <div
                      className={`
                        mt-1 flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-lg transition-all duration-300
                        ${
                          isActive
                            ? "bg-[#FABB18] text-[#0A0D14]"
                            : "bg-white/[0.07] text-white/60 group-hover:text-white"
                        }
                      `}
                    >
                      {isActive ? (
                        <Icon size={18} strokeWidth={2} />
                      ) : (
                        <span className="text-xs font-semibold">
                          0{index + 1}
                        </span>
                      )}
                    </div> */}

                    <div className="min-w-0 flex-1 mb-2 flex flex-col gap-1.5 py-3 md:py-4">
                      <span
                        className={`mb-1 block text-[14px] tracking-wider text-[#EAF0F5]`}
                      >
                        {step.num}
                      </span>

                      <h3
                        className={`flex items-center my-2 gap-2 text-base transition-colors sm:text-lg md:text-2xl ${
                          isActive ? "text-white" : "text-white/70"
                        }`}
                      >
                        {step.title}
                        
                         <Icon className="h-4 w-4 opacity-70" />
                      </h3>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: 6 }}
                            animate={{ opacity: 1, height: "auto", y: 5 }}
                            // exit={{ opacity: 0, height: 0, y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-sm leading-relaxed text-[#EAF0F5] ">
                              {step.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <ChevronRight
                      size={16}
                      className={`mt-2 shrink-0 transition-all duration-300 md:hidden ${
                        isActive
                          ? "translate-x-0 text-[#FABB18] opacity-100"
                          : "-translate-x-1 text-white/30 opacity-0"
                      }`}
                    />
                  </div>

                  {/* Desktop progress line */}
                  {isActive && (
                    <motion.div
                      layoutId="how-it-works-indicator"
                      className="absolute -left-4 top-0 hidden h-full w-[3px] rounded-full bg-[#FABB18] md:block"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Animated image showcase */}
          <div className="relative min-w-0">
         

            <div className="relative overflow-hidden w-full max-w-[900px] ">
              {/* Stable image frame prevents layout shifts */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#080D16] sm:aspect-[1.45/1]">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0, scale: 1.035, x: 12 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.985, x: -8 }}
                    transition={{
                      opacity: { duration: 0.45, ease: "easeInOut" },
                      scale: { duration: 0.65, ease: "easeOut" },
                      x: { duration: 0.45, ease: "easeInOut" },
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
                      // className="object-contain object-center"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Image caption */}
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4 sm:px-3 sm:pt-5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FABB18]/10 text-[#FABB18]">
                    <ActiveIcon size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white sm:text-sm">
                      {activeStep.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/45 sm:text-xs">
                      Step {activeIndex + 1} of {steps.length}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      type="button"
                      aria-label={`Show step ${index + 1}: ${step.title}`}
                      aria-pressed={activeIndex === index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeIndex === index
                          ? "w-7 bg-[#FABB18]"
                          : "w-1.5 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}