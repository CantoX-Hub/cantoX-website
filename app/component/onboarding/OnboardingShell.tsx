"use client";

import { ArrowLeft } from "lucide-react";
import { MotionConfig, motion } from "framer-motion";

interface OnboardingShellProps {
  onBack?: () => void;
  children: React.ReactNode;
}

export default function OnboardingShell({ onBack, children }: OnboardingShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-hidden bg-[#050C17] px-3 py-3 sm:px-[6%] sm:py-14">
        <GoldRibbons />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1280px] flex-col rounded-[12px] bg-white px-5 pb-10 pt-8 sm:min-h-[calc(100vh-7rem)] sm:px-[8%] sm:pb-16 sm:pt-14"
        >
          <div className="h-10">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="group flex items-center gap-3 text-[#060D18] transition-colors hover:text-[#C99532]"
              >
                <ArrowLeft
                  className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1 sm:h-6 sm:w-6"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="font-['Cal_Sans',sans-serif] text-[22px] leading-none sm:text-[28px]">
                  Back
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-1 flex-col pt-10 sm:pt-20">{children}</div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

/** Textured gold ribbons behind the card */
function GoldRibbons() {
  const ribbons = [
    "M -80 300 C 200 180, 420 260, 520 420 S 700 900, 900 980",
    "M -100 820 C 200 640, 600 500, 900 380 S 1300 120, 1560 60",
    "M 380 1000 C 700 720, 1100 520, 1560 320",
    "M -60 640 C 100 580, 300 430, 380 180",
  ];

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        {/* Fine grain so the gold reads like the textured ribbons in the design */}
        <filter id="ribbon-grain" x="-5%" y="-5%" width="110%" height="110%">
          {/* Dark specks */}
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3" result="noiseA" />
          <feColorMatrix
            in="noiseA"
            type="matrix"
            values="0 0 0 0 0.42  0 0 0 0 0.28  0 0 0 0 0.08  0 0 0 9 -4.4"
            result="darkSpecks"
          />
          {/* Light specks */}
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" result="noiseB" />
          <feColorMatrix
            in="noiseB"
            type="matrix"
            values="0 0 0 0 0.86  0 0 0 0 0.70  0 0 0 0 0.40  0 0 0 9 -6.2"
            result="lightSpecks"
          />
          <feMerge result="specks">
            <feMergeNode in="darkSpecks" />
            <feMergeNode in="lightSpecks" />
          </feMerge>
          <feComposite in="specks" in2="SourceGraphic" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#ribbon-grain)">
        {ribbons.map((d) => (
          <path key={d} d={d} stroke="#C99532" strokeWidth="58" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}
