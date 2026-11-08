"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FieldConfig } from "@/app/types/onboarding.types";
import AvatarPicker from "./AvatarPicker";
import UploadField from "./UploadField";

interface FieldRendererProps {
  field: FieldConfig;
  value: string;
  required: boolean;
  readOnly?: boolean;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

// text-base on mobile stops iOS zooming into focused inputs
const inputBase =
  "w-full rounded-[6px] border bg-white px-4 text-base text-[#11151D] outline-none transition placeholder:text-[#94A3B8] hover:border-[#C9CED6] focus:border-[#C99532] focus:ring-4 focus:ring-[#C99532]/10 sm:text-[15px]";
// Only for locked text inputs. Not part of inputBase, because browsers treat
// every <select> as :read-only and it would grey them all out.
const lockedInput = "bg-[#F8FAFC] text-[#64748B] hover:border-[#E2E8F0] focus:border-[#E2E8F0] focus:ring-0";

export default function FieldRenderer({
  field,
  value,
  required,
  readOnly,
  error,
  onChange,
  onBlur,
}: FieldRendererProps) {
  const id = field.name;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const showHintBelow = !!field.hint && field.type !== "upload";
  const describedBy =
    [error && errorId, showHintBelow && hintId].filter(Boolean).join(" ") || undefined;
  const border = error ? "border-red-400" : "border-[#E2E8F0]";
  const grouped = field.type === "radio" || field.type === "avatar";

  const control = (() => {
    switch (field.type) {
      case "avatar":
        return <AvatarPicker name={id} value={value} describedBy={describedBy} onChange={onChange} />;

      case "upload":
        return (
          <UploadField
            id={id}
            value={value}
            accept={field.accept}
            folder={field.uploadFolder}
            hint={field.hint}
            describedBy={describedBy}
            invalid={!!error}
            onChange={onChange}
          />
        );

      case "radio":
        return (
          <div role="radiogroup" aria-describedby={describedBy} className="flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const active = value === option.value;
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange(option.value)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex h-11 items-center gap-2.5 rounded-[6px] border-[1.5px] bg-white px-4 text-sm transition-colors outline-none focus-visible:ring-4 focus-visible:ring-[#C99532]/15 sm:h-12 sm:text-[15px] ${
                    active
                      ? "border-[#C99532] text-[#C99532]"
                      : `${error ? "border-red-400" : "border-[#E2E8F0]"} text-[#11151D] hover:border-[#C99532]/50`
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                      active ? "border-[#C99532]" : "border-[#94A3B8]"
                    }`}
                  >
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 600, damping: 28 }}
                          className="h-2.5 w-2.5 rounded-full bg-[#C99532]"
                        />
                      )}
                    </AnimatePresence>
                  </span>
                  {option.label}
                </motion.button>
              );
            })}
          </div>
        );

      case "select":
        return (
          <div className="relative">
            <select
              id={id}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onBlur={onBlur}
              aria-required={required || undefined}
              aria-invalid={!!error || undefined}
              aria-describedby={describedBy}
              className={`${inputBase} ${border} h-12 cursor-pointer appearance-none pr-10 ${
                value ? "" : "text-[#94A3B8]"
              }`}
            >
              <option value="" disabled>
                {field.placeholder ?? "Select"}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value} className="text-[#11151D]">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#475569]"
              aria-hidden="true"
            />
          </div>
        );

      case "textarea":
        return (
          <div>
            <textarea
              id={id}
              value={value}
              rows={3}
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              onChange={(event) => onChange(event.target.value)}
              onBlur={onBlur}
              aria-required={required || undefined}
              aria-invalid={!!error || undefined}
              aria-describedby={describedBy}
              className={`${inputBase} ${border} resize-none py-3`}
            />
            {field.maxLength && (
              <p className="mt-1 text-right text-xs text-[#94A3B8]">
                {value.length}/{field.maxLength}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            id={id}
            name={id}
            type={field.type}
            value={value}
            readOnly={readOnly}
            placeholder={field.placeholder}
            autoComplete={autoCompleteFor(field)}
            inputMode={field.type === "tel" ? "tel" : field.name === "ninNumber" ? "numeric" : undefined}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            aria-required={required || undefined}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={`${inputBase} ${border} h-12 ${readOnly ? lockedInput : ""} ${
              field.type === "date" && !value ? "text-[#94A3B8]" : ""
            }`}
          />
        );
    }
  })();

  // Optional fields say so, unless the placeholder already does
  const showOptional = !required && !field.placeholder?.toLowerCase().includes("optional");
  const labelContent = (
    <>
      {field.label}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-[#EF4444]">
          *
        </span>
      )}
      {showOptional &&<span className="ml-1.5 font-normal text-[#94A3B8]">(Optional)</span>}
    </>
  );
  const labelClass = "mb-2 block text-sm font-medium text-[#11151D] sm:text-[15px]";

  return (
    <>
      {field.dividerBefore && <div className="my-1 border-t border-[#E2E8F0] sm:col-span-2" />}

      <motion.div
        data-field={field.name}
        // Conditional fields (CAC / NIN) slide in when they appear
        initial={field.showWhen ? { opacity: 0, y: -6 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={field.span === 2 ? "sm:col-span-2" : ""}
      >
        {grouped ? (
          <fieldset>
            <legend className={labelClass}>{labelContent}</legend>
            {control}
          </fieldset>
        ) : (
          <>
            <label htmlFor={id} className={labelClass}>
              {labelContent}
            </label>
            {control}
          </>
        )}

        {showHintBelow && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-[#94A3B8]">
            {field.hint}
          </p>
        )}
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-1.5 text-xs text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function autoCompleteFor(field: FieldConfig): string | undefined {
  switch (field.name) {
    case "fullName":
      return "name";
    case "email":
    case "businessEmail":
      return "email";
    case "phone":
    case "whatsapp":
      return "tel";
    case "dob":
      return "bday";
    case "businessName":
      return "organization";
    case "businessAddress":
      return "street-address";
    case "ninNumber":
    case "partnerName":
    case "partnerEmail":
    case "partnerPhone":
      return "off";
    default:
      return undefined;
  }
}
