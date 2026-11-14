"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ROUTES } from "@/app/lib/routes";
import { useAppSelector } from "@/app/store/hooks";
import WelcomeSplash from "./WelcomeSplash";

/**
 * Shown for every role once POST /onboarding succeeds: the "Welcome to CantoX"
 * splash plays, then the user lands on the dashboard.
 */
export default function SuccessStep() {
  const router = useRouter();
  const role = useAppSelector((state) => state.onboarding.role);
  const leaving = useRef(false);

  // Load the dashboard while the splash plays so the hand-over is instant.
  // The finished flow is cleared by OnboardingFlow if /onboarding is opened again,
  // so the first onboarding step never flashes on the way out.
  useEffect(() => {
    router.prefetch(ROUTES.dashboard);
  }, [router]);

  // The splash can finish on its timer, a click or a key press; only leave once
  const goToDashboard = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;

    // Planners and vendors are reviewed before they get a verified badge
    if (role === "planner" || role === "vendor") {
      toast.success("We're reviewing your details and will email you once your account is verified.", {
        duration: 6000,
      });
    }

    router.replace(ROUTES.dashboard);
  }, [role, router]);

  return (
    <AnimatePresence>
      <WelcomeSplash onDone={goToDashboard} />
    </AnimatePresence>
  );
}
