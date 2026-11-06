"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PROFILE_OPTIONS } from "@/app/data/onboarding";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { confirmRole, selectRole } from "@/app/store/onboardingSlice";
import type { Role } from "@/app/types/onboarding.types";
import { PrimaryButton, StepHeading } from "./ui";

export default function ProfileStep() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.onboarding.role);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (next: Role) => dispatch(selectRole(next));

  // Arrow keys move between profiles, like a native radio group
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const nextIndex = (index + step + PROFILE_OPTIONS.length) % PROFILE_OPTIONS.length;
    choose(PROFILE_OPTIONS[nextIndex].role);
    buttonRefs.current[nextIndex]?.focus();
  };

  const selectedIndex = PROFILE_OPTIONS.findIndex((o) => o.role === role);

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <StepHeading
        size="page"
        title="Choose a profile"
        description="We have different packages for everyone, so please select where you belong."
      />

      <div
        role="radiogroup"
        aria-label="Profile type"
        className="mt-10 grid grid-cols-3 gap-3 sm:mt-16 sm:gap-6"
      >
        {PROFILE_OPTIONS.map((option, index) => {
          const active = role === option.role;
          // Only one card is in the tab order: the selected one, or the first
          const tabbable = selectedIndex === -1 ? index === 0 : active;

          return (
            <motion.button
              key={option.role}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => choose(option.role)}
              onDoubleClick={() => {
                choose(option.role);
                dispatch(confirmRole());
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="group flex flex-col items-center gap-3 text-center outline-none sm:gap-4"
            >
              <span
                className={`relative block aspect-square w-full overflow-hidden rounded-[12px] border-2 transition-[border-color,box-shadow] duration-200 sm:rounded-[16px] ${option.tint} ${
                  active
                    ? "border-[#C99532] shadow-[0_10px_30px_-12px_rgba(201,149,50,0.55)]"
                    : "border-transparent group-hover:border-[#E8D6B2] group-hover:shadow-[0_10px_30px_-16px_rgba(6,13,24,0.25)] group-focus-visible:border-[#C99532]"
                }`}
              >
                <Image
                  src={option.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 640px) 30vw, 240px"
                  className={`object-cover transition-transform duration-500 ease-out ${
                    active ? "scale-[1.03]" : "group-hover:scale-[1.03]"
                  }`}
                />
              </span>
              <span
                className={`font-['Cal_Sans',sans-serif] text-[15px] leading-tight transition-colors sm:text-[20px] ${
                  active ? "text-[#060D18]" : "text-[#060D18]/80"
                }`}
              >
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <PrimaryButton
        className="mt-8 sm:mt-10"
        disabled={!role}
        onClick={() => dispatch(confirmRole())}
      >
        Continue
      </PrimaryButton>
    </div>
  );
}
