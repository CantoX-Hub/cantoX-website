export type Role = "couple" | "planner" | "vendor";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "url"
  | "select"
  | "textarea"
  | "radio"
  | "upload"
  | "avatar";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  /** Also the key sent to the API */
  name: string;
  label: string;
  /** Label on the Review step when the form label is too short (e.g. "Partner's email") */
  reviewLabel?: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  /** Required only when another field has a given value */
  requiredWhen?: { field: string; equals: string };
  /**
   * Only shown (and validated, and sent) when another field has a given value,
   * e.g. CAC number for registered companies, NIN for individuals.
   */
  showWhen?: { field: string; equals: string };
  /** Extra format check, e.g. an 11-digit NIN */
  pattern?: { value: RegExp; message: string };
  /** Prefilled from the signed-in email and locked when available */
  readOnly?: boolean;
  options?: FieldOption[];
  /** 2 = full row on desktop. Default is half width. */
  span?: 1 | 2;
  /** Draws a divider line above this field, to start a new group */
  dividerBefore?: boolean;
  hint?: string;
  accept?: string;
  uploadFolder?: string;
  maxLength?: number;
  rules?: { future?: boolean; minAge?: number };
}

export interface StepConfig {
  id: string;
  label: string;
  title: string;
  description: string;
  fields: FieldConfig[];
}

export interface RoleConfig {
  role: Role;
  title: string;
  /** Shows "Step 2 of 4" under the title */
  showStepCount?: boolean;
  /** Subtitle on the Review step */
  reviewDescription?: string;
  /** The Review step is appended automatically */
  steps: StepConfig[];
}

export type FormValues = Record<string, string>;

export type OnboardingPhase = "profile" | "plan" | "form" | "done";

/**
 * Body for POST /api/v1/onboarding.
 * Fields below the "planner / vendor" line and `role`, `planId`,
 * `partnerEmail`, `partnerPhone` are not in the current Swagger schema yet.
 */
export interface OnboardingPayload {
  role: Role;
  planId?: string;
  fullName?: string;
  phone?: string;
  partnerName?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  weddingDate?: string;
  weddingCountry?: string;
  weddingCity?: string;
  dob?: string;
  idType?: string;
  idNumber?: string;
  avatarUrl?: string;
  idDocumentUrl?: string;
  // planner / vendor
  businessName?: string;
  businessType?: string;
  cacNumber?: string;
  /** Planner who registered as an individual (not in the Swagger schema yet) */
  ninNumber?: string;
  cacDocumentUrl?: string;
  /** Vendors (not in the Swagger schema yet) */
  proofOfResidenceUrl?: string;
  yearsOfExperience?: string;
  businessAddress?: string;
  website?: string;
  instagram?: string;
  bio?: string;
  serviceCategory?: string;
  businessEmail?: string;
  whatsapp?: string;
  logoUrl?: string;
}

export interface AuthUser {
  id?: string;
  email?: string;
  role?: Role | null;
  onboarded?: boolean;
  [key: string]: unknown;
}
