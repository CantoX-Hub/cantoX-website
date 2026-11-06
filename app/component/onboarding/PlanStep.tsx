"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { pricingData } from "@/app/data";
import { PLAN_TABS } from "@/app/data/onboarding";
import { planIdFor } from "@/app/lib/onboarding";
import { useAppDispatch } from "@/app/store/hooks";
import { confirmPlan, selectPlan, selectRole, skipPlan } from "@/app/store/onboardingSlice";
import type { Role } from "@/app/types/onboarding.types";
import { DarkButton, SecondaryButton } from "./ui";

/** Plans come from the same `pricingData` as the pricing page. */
export default function PlanStep({ role }: { role: Role }) {
  const dispatch = useAppDispatch();
  const [activeRole, setActiveRole] = useState<Role>(role);

  const activeTab = PLAN_TABS.find((tab) => tab.role === activeRole) ?? PLAN_TABS[0];
  const plans = pricingData[activeTab.label] ?? [];

  const choosePlan = (planName: string) => {
    // Picking a plan on another tab switches the profile to match
    dispatch(selectRole(activeRole));
    dispatch(selectPlan(planIdFor(activeRole, planName)));
    // TODO: send to checkout here for paid plans once a payment endpoint exists
    dispatch(confirmPlan());
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Tabs */}
      <div role="tablist" aria-label="Plans" className="flex gap-6 border-b border-[#D9DDE3] sm:gap-10">
        {PLAN_TABS.map((tab) => {
          const active = tab.role === activeRole;
          return (
            <button
              key={tab.role}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveRole(tab.role)}
              className={`relative px-1 pb-3 text-sm transition-colors sm:px-5 sm:text-base ${
                active ? "font-semibold text-[#060D18]" : "text-[#94A3B8] hover:text-[#64748B]"
              }`}
            >
              {tab.label}
              {active && (
                <motion.span
                  layoutId="plan-tab-underline"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-[#060D18]"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Plans */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeRole}
          role="tabpanel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-10 grid grid-cols-1 gap-12 sm:mt-14 lg:grid-cols-2 lg:gap-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
              className="flex flex-col sm:px-8"
            >
              <div>
                <h3 className="text-[22px] leading-tight text-[#11151D] sm:text-2xl">{plan.name}</h3>
                <p className="mt-1 text-[26px] font-medium tracking-tight text-[#8D8D8D] sm:text-[30px]">
                  {plan.price}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#060D18] sm:text-base">{plan.billing}</p>
              </div>

              <p className="mt-10 text-sm font-medium text-[#060D18] sm:mt-14 sm:text-base">
                {plan.description}
              </p>

              <DarkButton className="mt-6 self-start" onClick={() => choosePlan(plan.name)}>
                Continue<span className="sr-only"> with {plan.name}</span>
              </DarkButton>

              <div className="my-8 border-b border-dashed border-[#E2E8F0]" />

              <div className="space-y-5 text-sm text-[#8D8D8D]">
                <p className="text-base font-medium text-[#2A2A2A]">What you get:</p>
                {plan.features.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    {group.category && (
                      <p className="pt-1 text-base font-medium text-[#2A2A2A]">{group.category}</p>
                    )}
                    <ul className="space-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#11151D]" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <SecondaryButton className="mt-14" onClick={() => dispatch(skipPlan())}>
        Skip
      </SecondaryButton>
    </div>
  );
}
