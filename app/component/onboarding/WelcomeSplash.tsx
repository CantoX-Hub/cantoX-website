"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** How long the splash stays up before handing over */
const DURATION_MS = 3200;

/**
 * Full-screen "Welcome to CantoX" shown right after onboarding is submitted.
 * Dismisses itself after a few seconds; a click or any key skips it.
 */
export default function WelcomeSplash({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setTimeout(onDone, reduceMotion ? 1800 : DURATION_MS);
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone, reduceMotion]);

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <motion.div
      role="status"
      aria-label="Welcome to CantoX"
      onClick={onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-[#060D18] px-4"
    >
      <div className="flex flex-col items-center text-center">
        <motion.p
          {...rise(0.15)}
          className="font-['Cal_Sans',sans-serif] text-[32px] leading-none tracking-[-0.01em] text-white sm:text-[44px]"
        >
          Welcome to
        </motion.p>

        <motion.h1
          {...rise(0.4)}
          className="-mt-1 font-['Carattere',cursive] text-[96px] leading-[1.05] text-white sm:text-[136px]"
        >
          Canto
          <motion.span
            className="text-[#C99532]"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: reduceMotion ? 0 : 0.85 }}
            style={{ display: "inline-block" }}
          >
            X
          </motion.span>
        </motion.h1>

        <motion.p
          {...rise(1.1)}
          className="mt-1 pl-[0.9em] text-[9px] uppercase tracking-[0.9em] text-white/90 sm:text-[10px]"
        >
          Canto Xperience
        </motion.p>
      </div>
    </motion.div>
  );
}
