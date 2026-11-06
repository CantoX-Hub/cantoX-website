"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ROUTES } from "@/app/lib/routes";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { goBack } from "@/app/store/onboardingSlice";
import OnboardingShell from "./OnboardingShell";
import PlanStep from "./PlanStep";
import ProfileStep from "./ProfileStep";
import RoleForm from "./RoleForm";
import SuccessStep from "./SuccessStep";
import { Spinner } from "./ui";

export default function OnboardingFlow() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { hydrated, phase, role, stepIndex } = useAppSelector((state) => state.onboarding);
  const authStatus = useAppSelector((state) => state.auth.status);

  // Refresh failed somewhere → back to sign-in (the draft stays in sessionStorage)
  useEffect(() => {
    if (authStatus === "guest") router.replace(ROUTES.getStarted);
  }, [authStatus, router]);

  // Start each screen at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase, stepIndex]);

  if (!hydrated) {
    return (
      <OnboardingShell>
        <div className="flex justify-center pt-16" aria-label="Loading">
          <Spinner />
        </div>
      </OnboardingShell>
    );
  }

  // Guard against a draft with a phase but no role
  const current = role ? phase : "profile";

  const handleBack = () => {
    if (current === "profile") router.push(ROUTES.getStarted);
    else dispatch(goBack());
  };

  return (
    <OnboardingShell onBack={current === "done" ? undefined : handleBack}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current === "form" ? `form-${role}` : current}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          {current === "profile" && <ProfileStep />}
          {current === "plan" && role && <PlanStep role={role} />}
          {current === "form" && role && <RoleForm key={role} role={role} />}
          {current === "done" && <SuccessStep />}
        </motion.div>
      </AnimatePresence>
    </OnboardingShell>
  );
}
