"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepTabsProps {
  labels: string[];
  current: number;
  /** Highest step the user has reached; tabs up to here are clickable */
  reached: number;
  onSelect: (index: number) => void;
}

export default function StepTabs({ labels, current, reached, onSelect }: StepTabsProps) {
  const listRef = useRef<HTMLOListElement>(null);

  // On narrow screens, keep the active tab scrolled into view
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  return (
    <nav aria-label="Onboarding steps" className="-mx-1 overflow-x-auto px-1">
      <ol ref={listRef} className="flex min-w-max border-b border-[#E2E8F0] sm:pl-6">
        {labels.map((label, index) => {
          const active = index === current;
          const done = index < current;
          const clickable = index <= reached && !active;

          return (
            <li key={label}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect(index)}
                aria-current={active ? "step" : undefined}
                className={`relative flex items-center gap-2 px-3 pb-4 pt-1 text-sm transition-colors sm:px-6 sm:text-[15px] ${
                  active
                    ? "font-medium text-[#C99532]"
                    : clickable
                      ? "text-[#64748B] hover:text-[#C99532]"
                      : "text-[#64748B]"
                } ${clickable ? "cursor-pointer" : "cursor-default"}`}
              >
                {label}
                <span
                  className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold transition-colors duration-300 ${
                    active ? "bg-[#FBF1DF] text-[#C99532]" : "bg-[#EEF2F7] text-[#475569]"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={done ? "done" : "number"}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="flex"
                    >
                      {done ? (
                        <Check className="h-3 w-3" strokeWidth={3} aria-label="done" />
                      ) : (
                        index + 1
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>

                {active && (
                  <motion.span
                    layoutId="step-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-[#C99532]"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
