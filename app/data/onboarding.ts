import type {
  FieldConfig,
  FieldOption,
  Role,
  RoleConfig,
} from "@/app/types/onboarding.types";

/* ---------- Profile step ---------- */

export const PROFILE_OPTIONS: {
  role: Role;
  label: string;
  image: string;
  tint: string;
}[] = [
  { role: "couple", label: "Couple", image: "/onboarding/couple.png", tint: "bg-[#FDF0FB]" },
  { role: "planner", label: "Event planner", image: "/onboarding/planner.png", tint: "bg-[#EEFAFD]" },
  { role: "vendor", label: "Vendors", image: "/onboarding/vendor.png", tint: "bg-[#F1FCEF]" },
];

/** Export the 11 avatars from Figma into /public/avatars/avatar-1.png … avatar-11.png */
export const PRESET_AVATARS = Array.from(
  { length: 11 },
  (_, i) => `/avatars/avatar-${i + 1}.png`
);

/* ---------- Plan step ---------- */

/**
 * Tabs on the plan step. `label` must match a key in `pricingData`
 * (@/app/data), so onboarding shows the same plans as the pricing page.
 */
export const PLAN_TABS: { role: Role; label: string }[] = [
  { role: "couple", label: "Couples" },
  { role: "planner", label: "Event planners" },
  { role: "vendor", label: "Vendors" },
];

/* ---------- Options ---------- */

const toOptions = (items: string[]): FieldOption[] =>
  items.map((item) => ({ label: item, value: item }));

const ID_TYPES: FieldOption[] = [
  { label: "NIN", value: "nin" },
  { label: "International Passport", value: "passport" },
  { label: "Driver's Licence", value: "drivers_licence" },
  { label: "Voter's Card", value: "voters_card" },
];

const COUNTRIES = toOptions([
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Other",
]);

const BUSINESS_TYPES: FieldOption[] = [
  { label: "Registered company", value: "registered" },
  { label: "Individual", value: "individual" },
];

const YEARS: FieldOption[] = [
  { label: "Less than 1 year", value: "0-1" },
  { label: "1 - 3 years", value: "1-3" },
  { label: "4 - 6 years", value: "4-6" },
  { label: "7 - 10 years", value: "7-10" },
  { label: "10+ years", value: "10+" },
];

const SERVICE_CATEGORIES = toOptions([
  "Photography and Media",
  "Catering",
  "Decor",
  "Venue",
  "Makeup and Beauty",
  "Fashion and Bridal",
  "Music and Entertainment",
  "Cakes and Desserts",
  "Logistics",
  "Other",
]);

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
const DOC_ACCEPT = "application/pdf,image/png,image/jpeg";

/* ---------- Shared fields ---------- */

const idTypeField: FieldConfig = {
  name: "idType",
  label: "ID type",
  type: "select",
  required: true,
  options: ID_TYPES,
  placeholder: "Select",
};

const idNumberField: FieldConfig = {
  name: "idNumber",
  label: "ID number",
  type: "text",
  required: true,
  placeholder: "Enter ID number",
};

const idDocumentField: FieldConfig = {
  name: "idDocumentUrl",
  label: "Upload ID document",
  reviewLabel: "ID upload",
  type: "upload",
  required: true,
  span: 2,
  accept: DOC_ACCEPT,
  uploadFolder: "id-documents",
  hint: "PDF, JPG or PNG · max 5MB",
};

/** Planner and vendor documents step */
const cacCertificateField: FieldConfig = {
  name: "cacDocumentUrl",
  label: "CAC certificate",
  type: "upload",
  span: 2,
  accept: DOC_ACCEPT,
  uploadFolder: "cac-documents",
  hint: "PDF or image, leave blank if not yet registered",
};

const ownerIdField: FieldConfig = {
  name: "idDocumentUrl",
  label: "Owner's government ID",
  reviewLabel: "ID upload",
  type: "upload",
  required: true,
  span: 2,
  accept: DOC_ACCEPT,
  uploadFolder: "id-documents",
  hint: "Passport, National ID, or Driver's License",
};

/* ---------- Role flows ---------- */

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  couple: {
    role: "couple",
    title: "Couples",
    reviewDescription: "Make sure everything looks right before you submit — you can edit any section.",
    steps: [
      {
        id: "details",
        label: "Your details",
        title: "Tell us about you both",
        description: "We use this to personalize your wedding website and keep your account secure.",
        fields: [
          { name: "avatarUrl", label: "Select avatar", type: "avatar", required: true, span: 2 },
          { name: "fullName", label: "Full name", type: "text", required: true, span: 2, placeholder: "eg. Precious Abiodun" },
          { name: "email", label: "Email", type: "email", required: true, readOnly: true, placeholder: "youremail@gmail.com" },
          { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "eg. 08118238433" },
          {
            name: "partnerName",
            label: "Partner's name",
            type: "text",
            span: 2,
            dividerBefore: true,
            placeholder: "(Optional)",
          },
          { name: "partnerEmail", label: "Email", reviewLabel: "Partner's email", type: "email", placeholder: "(Optional)" },
          { name: "partnerPhone", label: "Phone number", reviewLabel: "Partner's phone number", type: "tel", placeholder: "(Optional)" },
        ],
      },
      {
        id: "wedding",
        label: "Wedding details",
        title: "A few details about your day",
        description: "This helps us set up your wedding website with the right information from the start.",
        fields: [
          { name: "weddingDate", label: "Wedding date", type: "date", required: true, rules: { future: true } },
          { name: "weddingCountry", label: "Country", type: "select", required: true, options: COUNTRIES, placeholder: "Select" },
          { name: "weddingCity", label: "City", type: "text", required: true, span: 2, placeholder: "eg. Lagos, Nigeria" },
        ],
      },
      {
        id: "identity",
        label: "Identity",
        title: "Verify your identity",
        description: "We verify every account to keep couples, planners and vendors safe.",
        fields: [
          { name: "dob", label: "Date of birth", type: "date", required: true, rules: { minAge: 18 } },
          idTypeField,
          { ...idNumberField, span: 2 },
          idDocumentField,
        ],
      },
    ],
  },

  planner: {
    role: "planner",
    title: "Event planner",
    showStepCount: true,
    reviewDescription: "Verified planners get a badge and appear higher when couples search for planners.",
    steps: [
      {
        id: "details",
        label: "Your details",
        title: "A little about you",
        description: "This is the account owner on record for your planning business.",
        fields: [
          { name: "avatarUrl", label: "Upload logo", type: "upload", span: 2, accept: IMAGE_ACCEPT, uploadFolder: "avatars" },
          { name: "fullName", label: "Full name", type: "text", required: true, span: 2, placeholder: "eg. Olawale Abiodun" },
          { name: "email", label: "Email", type: "email", required: true, readOnly: true, placeholder: "eg. olawale@gmail.com" },
          { name: "phone", label: "Phone number", type: "tel", required: true, placeholder: "eg. 08188298033" },
          { name: "dob", label: "Date of birth", type: "date", required: true, span: 2, rules: { minAge: 18 } },
        ],
      },
      {
        id: "business",
        label: "Business information",
        title: "Your planning business",
        description: "Couples and vendors will see this information on your planner profile.",
        fields: [
          { name: "businessName", label: "Business name", type: "text", required: true, span: 2, placeholder: "eg. Olori Events" },
          { name: "businessType", label: "Business type", type: "radio", required: true, span: 2, options: BUSINESS_TYPES },
          // Only one of these two shows, depending on the business type
          {
            name: "cacNumber",
            label: "CAC registration number",
            type: "text",
            required: true,
            placeholder: "eg. RC 2314532",
            showWhen: { field: "businessType", equals: "registered" },
          },
          {
            name: "ninNumber",
            label: "NIN number",
            reviewLabel: "NIN",
            type: "text",
            required: true,
            placeholder: "eg. 11123487921",
            showWhen: { field: "businessType", equals: "individual" },
            pattern: { value: /^\d{11}$/, message: "Your NIN is 11 digits." },
          },
          { name: "yearsOfExperience", label: "Years planning events", type: "select", required: true, options: YEARS, placeholder: "Select" },
          { name: "businessAddress", label: "Business address", type: "text", required: true, span: 2, placeholder: "eg. 13, Ore close, Surulere, Lagos, Nigeria" },
          { name: "website", label: "Website or Instagram", type: "text", span: 2, placeholder: "eg. www.olorievents.com or @olorievents" },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        title: "Verify your business",
        description: "Verified planners get a badge and appear higher when couples search for planners.",
        fields: [
          // Planners who chose "Registered company" must upload it
          { ...cacCertificateField, requiredWhen: { field: "businessType", equals: "registered" } },
          ownerIdField,
        ],
      },
    ],
  },

  vendor: {
    role: "vendor",
    title: "Vendor",
    showStepCount: true,
    reviewDescription: "Make sure everything looks right before you submit — you can edit any section.",
    steps: [
      {
        id: "business",
        label: "Business information",
        title: "Your business",
        description: "Couples and planners will see this information on your vendor profile.",
        fields: [
          { name: "logoUrl", label: "Upload logo", type: "upload", span: 2, accept: IMAGE_ACCEPT, uploadFolder: "logos" },
          { name: "businessName", label: "Business name", type: "text", required: true, span: 2, placeholder: "eg. Lens and Light Studios" },
          { name: "bio", label: "Bio", type: "text", required: true, span: 2, maxLength: 160, placeholder: "eg. Photography studio doing the most" },
          { name: "serviceCategory", label: "Service category", type: "select", required: true, span: 2, options: SERVICE_CATEGORIES, placeholder: "Select" },
          { name: "businessType", label: "Business type", type: "radio", required: true, span: 2, options: BUSINESS_TYPES },
          { name: "cacNumber", label: "CAC registration number", type: "text", placeholder: "eg. RC 2314532" },
          { name: "yearsOfExperience", label: "Years in operation", type: "select", required: true, options: YEARS, placeholder: "Select" },
        ],
      },
      {
        id: "contact",
        label: "Contact & location",
        title: "Contact and location",
        description: "How couples and planners will reach you, and where you operate.",
        fields: [
          { name: "businessEmail", label: "Email", type: "email", required: true, placeholder: "eg. olawale@gmail.com" },
          { name: "whatsapp", label: "WhatsApp number", type: "tel", required: true, placeholder: "eg. 08188298033" },
          { name: "website", label: "Website", type: "url", placeholder: "eg. lensandlight.com" },
          { name: "instagram", label: "Instagram", type: "text", placeholder: "eg. instagram.com/lensandlight" },
          { name: "businessAddress", label: "Business address", type: "text", required: true, span: 2, placeholder: "eg. 13, Ore close, Surulere, Lagos, Nigeria" },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        title: "Identity & business verification",
        description: "Verified vendors get a badge and appear higher when couples and planners search.",
        fields: [
          cacCertificateField,
          ownerIdField,
          {
            name: "proofOfResidenceUrl",
            label: "Proof of residence",
            type: "upload",
            span: 2,
            accept: DOC_ACCEPT,
            uploadFolder: "proof-of-residence",
            hint: "Utility bill or bank statement from the last 3 months",
          },
        ],
      },
    ],
  },
};
