"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Check } from "lucide-react";
import { ROLE_CONFIGS } from "@/app/data/onboarding";
import {
  buildPayload,
  firstInvalidStep,
  isFieldRequired,
  isFieldVisible,
  validateField,
  validateStep,
  type FieldErrors,
} from "@/app/lib/onboarding";
import { ROUTES } from "@/app/lib/routes";
import { useCompleteOnboardingMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { goToStep, selectRoleValues, setField } from "@/app/store/onboardingSlice";
import type { FieldConfig, Role } from "@/app/types/onboarding.types";
import FieldRenderer from "./fields/FieldRenderer";
import ReviewStep from "./ReviewStep";
import StepTabs from "./StepTabs";
import { FormAlert, PrimaryButton, SecondaryButton, SecureNote, StepHeading } from "./ui";

const slide = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -28 }),
};

export default function RoleForm({ role }: { role: Role }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const config = ROLE_CONFIGS[role];
  const { steps } = config;

  const stepIndex = useAppSelector((state) => Math.min(state.onboarding.stepIndex, steps.length));
  const planId = useAppSelector((state) => state.onboarding.planId);
  const values = useAppSelector(selectRoleValues);
  const authEmail = useAppSelector((state) => state.auth.email);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [completeOnboarding, { isLoading: submitting }] = useCompleteOnboardingMutation();
  const shake = useAnimationControls();

  // The highest step reached; you can only get past a step by validating it.
  const [reached, setReached] = useState(stepIndex);

  // Slide forwards or backwards depending on which way the step moved
  // (covers the shell's Back button too, which changes the step from outside).
  const previousStep = useRef(stepIndex);
  const direction = stepIndex >= previousStep.current ? 1 : -1;
  useEffect(() => {
    previousStep.current = stepIndex;
  }, [stepIndex]);

  const isReview = stepIndex === steps.length;
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const tabLabels = [...steps.map((s) => s.label), "Review"];

  // Login email is locked when we know it
  const effectiveValues = authEmail ? { ...values, email: authEmail } : values;
  const lockEmail = (field: FieldConfig) => !!field.readOnly && !!authEmail;

  const changeStep = (index: number) => {
    setErrors({});
    setSubmitError(null);
    dispatch(goToStep(index));
    setReached((r) => Math.max(r, index));
  };

  const handleChange = (field: FieldConfig, value: string) => {
    dispatch(setField({ name: field.name, value }));
    if (errors[field.name]) {
      setErrors(({ [field.name]: _removed, ...rest }) => rest);
    }
  };

  const handleBlur = (field: FieldConfig) => {
    const value = effectiveValues[field.name];
    if (!value) return; // don't nag on empty fields until Continue
    const error = validateField(field, value, effectiveValues);
    setErrors((prev) => {
      const { [field.name]: _old, ...rest } = prev;
      return error ? { ...rest, [field.name]: error } : rest;
    });
  };

  const handleContinue = () => {
    const stepErrors = validateStep(step, effectiveValues);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
      const first = step.fields.find((f) => stepErrors[f.name]);
      if (first) {
        const el =
          document.getElementById(first.name) ??
          document.getElementById(`${first.name}-upload`) ??
          document.querySelector<HTMLElement>(`[data-field="${first.name}"] button, [data-field="${first.name}"] input`);
        el?.focus({ preventScroll: true });
        el?.closest("div")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    changeStep(stepIndex + 1);
  };

  const handleSubmit = async () => {
    const invalid = firstInvalidStep(role, effectiveValues);
    if (invalid !== -1) {
      changeStep(invalid);
      setErrors(validateStep(steps[invalid], effectiveValues));
      return;
    }

    setSubmitError(null);
    try {
      await completeOnboarding(buildPayload(role, values, planId)).unwrap();
      // onboardingSlice moves to the "done" phase on success
    } catch (error) {
      if (hasStatus(error, 409)) {
        router.replace(ROUTES.dashboard);
        return;
      }
      if (hasStatus(error, 401)) return; // session expired → OnboardingFlow redirects
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <div>
      <h2 className="text-[26px] leading-tight tracking-[-0.01em] text-[#060D18] sm:text-[32px]">
        {config.title}
      </h2>
      {config.showStepCount ? (
        <p className="mt-2 text-sm text-[#64748B]" aria-live="polite">
          Step {stepIndex + 1} of {tabLabels.length}
          <span className="sr-only">: {tabLabels[stepIndex]}</span>
        </p>
      ) : (
        <p className="sr-only" aria-live="polite">
          Step {stepIndex + 1} of {tabLabels.length}: {tabLabels[stepIndex]}
        </p>
      )}

      <div className="mt-8 sm:mt-12">
        <StepTabs labels={tabLabels} current={stepIndex} reached={reached} onSelect={changeStep} />
      </div>

      <motion.div animate={shake}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 sm:mt-7"
          >
            {isReview ? (
              <>
                <StepHeading
                  title="Review your information"
                  description={
                    config.reviewDescription ??
                    "Make sure everything looks right before you submit — you can edit any section."
                  }
                />
                <div className="mt-6">
                  <ReviewStep steps={steps} values={values} emailOverride={authEmail} onEdit={changeStep} />
                </div>
                <Consent checked={agreed} onChange={setAgreed} />
              </>
            ) : (
              <>
                <StepHeading title={step.title} description={step.description} />
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleContinue();
                  }}
                  className="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2"
                >
                  {step.fields.filter((field) => isFieldVisible(field, effectiveValues)).map((field) => (
                    <FieldRenderer
                      key={field.name}
                      field={field}
                      value={effectiveValues[field.name] ?? ""}
                      required={isFieldRequired(field, effectiveValues)}
                      readOnly={lockEmail(field)}
                      error={errors[field.name]}
                      onChange={(value) => handleChange(field, value)}
                      onBlur={() => handleBlur(field)}
                    />
                  ))}
                  {/* lets Enter submit the step */}
                  <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
                </form>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {submitError && (
        <div className="mt-5">
          <FormAlert>{submitError}</FormAlert>
        </div>
      )}

      <div className={`mt-4 grid gap-3 sm:gap-4 ${stepIndex > 0 ? "sm:grid-cols-2" : ""}`}>
        {stepIndex > 0 && (
          <SecondaryButton
            className="order-2 sm:order-1"
            onClick={() => changeStep(stepIndex - 1)}
            disabled={submitting}
          >
            Back to step {stepIndex}
          </SecondaryButton>
        )}
        {isReview ? (
          <PrimaryButton
            className="order-1 sm:order-2"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!agreed}
            title={agreed ? undefined : "Tick the box above to continue"}
          >
            {submitting ? "Submitting…" : "Submit for verification"}
          </PrimaryButton>
        ) : (
          <PrimaryButton className="order-1 sm:order-2" onClick={handleContinue}>
            Continue
          </PrimaryButton>
        )}
      </div>

      <SecureNote />
    </div>
  );
}

function Consent({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-[6px] bg-[#EEF2F7] px-4 py-5 text-[13px] leading-5 text-[#11151D] transition-colors hover:bg-[#E7ECF3] sm:px-6 sm:text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-[#C99532]/25 ${
          checked ? "border-[#C99532] bg-[#C99532] text-white" : "border-[#94A3B8] bg-white"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="flex"
            >
              <Check className="h-3 w-3" strokeWidth={3.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span>
        I confirm the information provided is accurate, and I agree to CantoX&apos;s{" "}
        <Link href="/terms" className="underline-offset-2 hover:text-[#C99532] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline-offset-2 hover:text-[#C99532] hover:underline">
          Privacy Policy
        </Link>
        , including the use of this data for identity verification purposes.
      </span>
    </label>
  );
}
