"use client";

import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { displayValue, isFieldVisible } from "@/app/lib/onboarding";
import type { FieldConfig, FormValues, StepConfig } from "@/app/types/onboarding.types";

interface ReviewStepProps {
  steps: StepConfig[];
  values: FormValues;
  emailOverride?: string | null;
  onEdit: (stepIndex: number) => void;
}

export default function ReviewStep({ steps, values, emailOverride, onEdit }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        // Avatars and photo uploads aren't listed, as in the design
        const rows = step.fields.filter(
          (field) =>
            isFieldVisible(field, values) &&
            field.type !== "avatar" &&
            !(field.type === "upload" && isImageUpload(field))
        );

        return (
          <motion.section
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
            className="rounded-[8px] border border-[#E2E8F0] px-4 py-2 sm:px-5"
          >
            <div className="flex items-center justify-between py-3">
              <h4 className="font-['DM_Sans',sans-serif] text-[15px] font-medium text-[#11151D]">
                {step.label}
              </h4>
              <button
                type="button"
                onClick={() => onEdit(index)}
                className="rounded px-1 text-sm font-medium text-[#C99532] transition-colors hover:text-[#A97A22] hover:underline"
              >
                Edit<span className="sr-only"> {step.label}</span>
              </button>
            </div>

            <dl>
              {rows.map((field) => {
                const value =
                  field.name === "email" && emailOverride ? emailOverride : values[field.name];
                return (
                  <div
                    key={field.name}
                    className="flex items-start justify-between gap-6 border-b border-[#E2E8F0] py-3.5 text-sm last:border-b-0 sm:text-[15px]"
                  >
                    <dt className="shrink-0 text-[#64748B]">{field.reviewLabel ?? field.label}</dt>
                    <dd className="min-w-0 break-words text-right font-medium text-[#475569]">
                      <ReviewValue field={field} value={value} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </motion.section>
        );
      })}
    </div>
  );
}

function isImageUpload(field: FieldConfig) {
  return !!field.accept && field.accept.split(",").every((t) => t.trim().startsWith("image/"));
}

function ReviewValue({ field, value }: { field: FieldConfig; value?: string }) {
  if (!value) return <>Nil</>;

  if (field.type === "upload") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        title="View document"
        className="inline-flex items-center gap-1.5 hover:text-[#C99532]"
      >
        Uploaded
        <CheckCheck className="h-4 w-4" aria-hidden="true" />
      </a>
    );
  }

  return <>{displayValue(field, value)}</>;
}
