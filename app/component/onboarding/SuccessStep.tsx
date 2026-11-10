"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { ROUTES } from "@/app/lib/routes";
import { useAppDispatch } from "@/app/store/hooks";
import { resetOnboarding } from "@/app/store/onboardingSlice";
import { PrimaryButton } from "./ui";
import WelcomeSplash from "./WelcomeSplash";

export default function SuccessStep() {
  const [showWelcome, setShowWelcome] = useState(true);
  const hideWelcome = useCallback(() => setShowWelcome(false), []);

  return (
    <>
      <AnimatePresence>{showWelcome && <WelcomeSplash onDone={hideWelcome} />}</AnimatePresence>
      {!showWelcome && <SubmittedMessage />}
    </>
  );
}

function SubmittedMessage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#C99532]"
      >
        <motion.span
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#C99532]"
        />
        <Check className="relative h-7 w-7 text-white" strokeWidth={3} aria-hidden="true" />
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <h2 className="mt-6 text-[26px] text-[#060D18] sm:text-[32px]">Submitted for verification</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#64748B] sm:text-[15px]">
          Thanks — we&apos;re reviewing your details and will email you once your
          account is verified.
        </p>
        <PrimaryButton
          className="mt-8 w-64"
          onClick={() => {
            dispatch(resetOnboarding());
            router.push(ROUTES.dashboard);
          }}
        >
          Go to dashboard
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
