import { ROLE_CONFIGS } from "@/app/data/onboarding";
import type {
  FieldConfig,
  FormValues,
  OnboardingPayload,
  Role,
  StepConfig,
} from "@/app/types/onboarding.types";

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const URL_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

/** False for a conditional field whose condition isn't met (it's hidden, skipped and not sent). */
export function isFieldVisible(field: FieldConfig, values: FormValues): boolean {
  if (!field.showWhen) return true;
  return values[field.showWhen.field] === field.showWhen.equals;
}

export function isFieldRequired(field: FieldConfig, values: FormValues): boolean {
  if (!isFieldVisible(field, values)) return false;
  if (field.required) return true;
  if (field.requiredWhen) {
    return values[field.requiredWhen.field] === field.requiredWhen.equals;
  }
  return false;
}

function requiredMessage(field: FieldConfig): string {
  switch (field.type) {
    case "upload":
      return "Please upload a file.";
    case "avatar":
      return "Choose an avatar or upload a photo.";
    case "select":
    case "radio":
      return "Please select an option.";
    case "date":
      return "Please choose a date.";
    default:
      return `${field.reviewLabel ?? field.label} is required.`;
  }
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function ageOn(dob: Date, on: Date) {
  let age = on.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    on.getMonth() < dob.getMonth() ||
    (on.getMonth() === dob.getMonth() && on.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function validateField(
  field: FieldConfig,
  rawValue: string | undefined,
  values: FormValues
): string | undefined {
  if (!isFieldVisible(field, values)) return undefined;
  const value = (rawValue ?? "").trim();

  if (!value) {
    return isFieldRequired(field, values) ? requiredMessage(field) : undefined;
  }

  switch (field.type) {
    case "email":
      if (!EMAIL_RE.test(value)) return "Enter a valid email address.";
      break;
    case "tel":
      if (!PHONE_RE.test(value) || value.replace(/\D/g, "").length < 7) {
        return "Enter a valid phone number.";
      }
      break;
    case "url":
      if (!URL_RE.test(value)) return "Enter a valid web address.";
      break;
    case "date": {
      const date = new Date(`${value}T00:00:00`);
      if (Number.isNaN(date.getTime())) return "Enter a valid date.";
      if (field.rules?.future && date < startOfToday()) {
        return "Choose a date in the future.";
      }
      if (field.rules?.minAge && ageOn(date, new Date()) < field.rules.minAge) {
        return `You must be at least ${field.rules.minAge} years old.`;
      }
      break;
    }
  }

  if (field.pattern && !field.pattern.value.test(value.replace(/\s/g, ""))) {
    return field.pattern.message;
  }

  if (field.maxLength && value.length > field.maxLength) {
    return `Keep this under ${field.maxLength} characters.`;
  }

  return undefined;
}

export function validateStep(step: StepConfig, values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of step.fields) {
    const error = validateField(field, values[field.name], values);
    if (error) errors[field.name] = error;
  }
  return errors;
}

/** Index of the first step with errors, or -1 if everything passes. */
export function firstInvalidStep(role: Role, values: FormValues): number {
  return ROLE_CONFIGS[role].steps.findIndex(
    (step) => Object.keys(validateStep(step, values)).length > 0
  );
}

/** Stable plan id from the pricing data, e.g. ("couple", "Premium") → "couple-premium". */
export function planIdFor(role: Role, planName: string): string {
  const slug = planName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${role}-${slug}`;
}

/**
 * Builds the POST /onboarding body. Only keys defined for this role are sent;
 * the login email is dropped (the backend knows it from the session), hidden
 * conditional fields (e.g. a CAC number typed before switching to Individual)
 * are dropped, and empty values are omitted.
 */
export function buildPayload(
  role: Role,
  values: FormValues,
  planId: string | null
): OnboardingPayload {
  const allowed = new Set(
    ROLE_CONFIGS[role].steps.flatMap((step) =>
      step.fields.filter((f) => isFieldVisible(f, values)).map((f) => f.name)
    )
  );
  allowed.delete("email");

  const fields: Record<string, string> = {};
  for (const [name, value] of Object.entries(values)) {
    const trimmed = value.trim();
    if (allowed.has(name) && trimmed) fields[name] = trimmed;
  }

  return {
    role,
    ...(planId ? { planId } : {}),
    ...fields,
  } as OnboardingPayload;
}

/** Human-readable value for the review step. Dates show as dd-mm-yyyy. */
export function displayValue(field: FieldConfig, value: string | undefined): string {
  if (!value) return "Nil";
  if (field.options) {
    return field.options.find((o) => o.value === value)?.label ?? value;
  }
  if (field.type === "date") {
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : value;
  }
  return value;
}
