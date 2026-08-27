"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Copy, Edit3, Send } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    id: "step-1",
    num: "STEP 01",
    title: "Pick a template",
    desc: "200+ designs. Free to start. Yours in seconds.",
    icon: Copy,
  },
  {
    id: "step-2",
    num: "STEP 02",
    title: "Edit design",
    desc: "Add your names, date, venue, and photos. Every change updates live as you type.",
    icon: Edit3,
  },
  {
    id: "step-3",
    num: "STEP 03",
    title: "Share invite",
    desc: "share one link with every guest. Works on any web and mobile.",
    icon: Send,
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Creates a 300vh scroll runway to trigger the step changes
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress (0 to 1) to the 3 steps
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActiveIndex(0);
    } else if (latest >= 0.35 && latest < 0.7) {
      setActiveIndex(1);
    } else {
      setActiveIndex(2);
    }
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#0A0D14] pt-16 px-[5%] pb-24">
      {/* Sticky container stays pinned for 300vh */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden ">
        <div className="maxContainer w-full ">
          
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center md:mb-20">
            <span className="mb-3 text-xs font-semibold tracking-widest text-[#857E75]">
              HOW IT WORKS
            </span>
            <h2 className="mb-3 text-3xl text-white md:text-5xl">
              Few step and you are done
            </h2>
            <p >
              From free to premium templates, personalize it to fully express yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            
            {/* Left Column: Animated Steps */}
            <div className="flex flex-col justify-center space-y-10">
              {steps.map((step, index) => {
                const isActive = activeIndex === index;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`relative pl-6 transition-all duration-500 ${
                      isActive ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    {/* Sliding Yellow Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="active-step-indicator"
                        className="absolute left-0 top-1.5 h-0 w-0 border-y-[6px] border-l-[8px] border-y-transparent border-l-[#FABB18]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span className="mb-1 block text-[12px] tracking-wider text-[#EAF0F5]">
                      {step.num}
                    </span>
                    <h3 className="mb-2 flex items-center gap-2 text-xl  text-white ">
                      {step.title}
                      <Icon className="h-4 w-4 opacity-70" />
                    </h3>
                    <p className="max-w-sm leading-relaxed text-[#EAF0F5]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Static Image */}
            <div className="relative flex items-center justify-center">
              {/* Cream container from the design */}
              <div className="relative w-full max-w-[600px] overflow-hidden rounded-xl bg-[#FFF6EB] p-4 md:p-8 pt-10 shadow-2xl">
                
                {/* Static Image Mockup */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md border border-gray-100">
                  <Image
                    src="/template-mockup.png" // Replace with your actual image path
                    alt="CantoX Platform Templates"
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}