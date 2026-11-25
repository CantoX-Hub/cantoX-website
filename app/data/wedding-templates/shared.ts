import type {
  ColorControl,
  FontControl,
  FontKey,
  ScalarField,
  SectionSpec,
} from "@/app/types/wedding.types";

/** Compulsory in every template; "Go live" is blocked until they are filled */
export const CORE_FIELDS: ScalarField[] = [
  { key: "partner1", label: "Partner 1", type: "text", required: true, placeholder: "Joan" },
  { key: "partner2", label: "Partner 2", type: "text", required: true, placeholder: "Jamie" },
  { key: "weddingDate", label: "Wedding date", type: "date", required: true },
  { key: "ceremonyTime", label: "Ceremony time", type: "time", required: true },
  {
    key: "venue",
    label: "Venue",
    type: "text",
    required: true,
    placeholder: "Premier Banqueting Suites",
  },
];

export const HASHTAG_FIELD: ScalarField = {
  key: "hashtag",
  label: "Hashtag",
  type: "text",
  required: false,
  placeholder: "#jjstory27",
};

export const VENUE_ADDRESS_FIELD: ScalarField = {
  key: "venueAddress",
  label: "Venue address",
  type: "text",
  required: false,
  placeholder: "22 Igbobi College Road, Lagos",
};

export function essentialsSection(extra: ScalarField[] = []): SectionSpec {
  return {
    kind: "fields",
    id: "essentials",
    label: "The essentials",
    fields: [...CORE_FIELDS, ...extra],
  };
}

export const STRONG_SWATCHES = ["#B3243D", "#2F4BC4", "#2DAA3C"];
export const SOFT_SWATCHES = ["#F4E7E9", "#E6ECF7", "#E4F3E4"];

export function colorControl(
  key: ColorControl["key"],
  label: string,
  swatches: string[],
  allowCustom = true
): ColorControl {
  return { key, label, swatches, allowCustom };
}

export const SCRIPT_FONTS: FontKey[] = ["montez", "greatVibes", "pinyon"];
export const SERIF_FONTS: FontKey[] = ["sourceSerif", "playfair", "cormorant", "cinzel"];
export const SANS_FONTS: FontKey[] = ["lato", "inter", "dmSans", "leagueSpartan"];

export function fontControl(
  key: FontControl["key"],
  label: string,
  options: FontKey[]
): FontControl {
  return { key, label, options };
}

/** Preview-panel copy, straight from the design */
export const FREE_FEATURES = ["Change names", "Add time, date and venue", "3 picture slot"];
export const PREMIUM_FEATURES = [
  "Optional logo slot",
  "Gift inventory slot",
  "Showcase your love pictures",
  "Guest management",
  "Timeline and checklist",
];
