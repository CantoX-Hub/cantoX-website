// A TemplateDefinition is the blank frame, a Wedding is the couple's data inside it

export type TemplateTier = "Free" | "Premium";
export type TemplateLayout = "invite" | "website";

/** Compulsory in every template */
export interface CoreContent {
  partner1: string;
  partner2: string;
  /** ISO date, yyyy-mm-dd */
  weddingDate: string;
  /** 24h time, HH:mm */
  ceremonyTime: string;
  venue: string;
}

export interface ContactEntry {
  name: string;
  phone: string;
  /** Mock data only: a picture shown beside the contact */
  avatar?: string;
}

export interface GiftEntry {
  label: string;
  value: string;
  note?: string;
  /** Mock data only: bank or service logo */
  logo?: string;
}

/** Only present when the template's schema enables them */
export interface OptionalContent {
  venueAddress?: string;
  hashtag?: string;
  tagline?: string;
  hostsA?: string;
  hostsB?: string;
  logo?: string;
  story?: Record<string, string>;
  contacts?: ContactEntry[];
  gifts?: GiftEntry[];
  gallery?: { loveStory?: string[]; lens?: string[] };
  addons?: Record<string, boolean>;
}

export type WeddingContent = CoreContent & OptionalContent;

export type FontKey =
  | "montez"
  | "greatVibes"
  | "pinyon"
  | "cinzel"
  | "playfair"
  | "sourceSerif"
  | "cormorant"
  | "inter"
  | "dmSans"
  | "lato"
  | "leagueSpartan";

export type ThemeColorKey =
  | "primary"
  | "secondary"
  | "background"
  | "text"
  | "heroTint"
  | "heroText";

export type ThemeFontKey = "headingFont" | "scriptFont" | "bodyFont";

export interface ThemeValues {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  heroTint: string;
  heroText: string;
  headingFont: FontKey;
  scriptFont: FontKey;
  bodyFont: FontKey;
  /** Hero banner (data URL or path). null → template default */
  heroBanner: string | null;
}

/** What a wedding stores: only the keys the couple changed. null = template defaults. */
export type ThemeOverrides = Partial<ThemeValues>;

export interface ColorControl {
  key: ThemeColorKey;
  label: string;
  swatches: string[];
  allowCustom: boolean;
}

export interface FontControl {
  key: ThemeFontKey;
  label: string;
  options: FontKey[];
}

export interface CustomizationSchema {
  colors: ColorControl[];
  fonts: FontControl[];
  heroBanner: boolean;
  defaults: ThemeValues;
}

export type ScalarFieldKey =
  | keyof CoreContent
  | "venueAddress"
  | "hashtag"
  | "tagline"
  | "hostsA"
  | "hostsB";

export interface ScalarField {
  key: ScalarFieldKey;
  label: string;
  type: "text" | "textarea" | "date" | "time";
  required: boolean;
  placeholder?: string;
}

export type SectionSpec =
  | { kind: "fields"; id: string; label: string; fields: ScalarField[] }
  | { kind: "styling"; id: string; label: string; logo: boolean }
  | {
      kind: "story";
      id: string;
      label: string;
      blocks: { key: string; label: string }[];
    }
  | { kind: "contacts"; id: string; label: string; count: number; required: boolean }
  | { kind: "gifts"; id: string; label: string; count: number }
  | {
      kind: "gallery";
      id: string;
      label: string;
      heroBanner: boolean;
      loveStory: number;
      lens: number;
    }
  | {
      kind: "addons";
      id: string;
      label: string;
      options: { key: string; label: string }[];
    };

export interface TemplateDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  tier: TemplateTier;
  rating: number;
  /** null: no design has been built for this template yet */
  layout: TemplateLayout | null;
  thumbnail: string;
  desktopBanner: string;
  mobileBanner: string;
  features: string[];
  exclusiveFeatures: string[];
  sections: SectionSpec[];
  customizationSchema: CustomizationSchema;
  /** Placeholder data for previews and empty studio fields */
  mock: WeddingContent;
}

export type WeddingStatus = "draft" | "live";

export interface Wedding {
  id: string;
  templateId: string;
  /** Public URL segment: /wedding/<slug> */
  slug: string;
  coupleDisplayNames: string;
  weddingDate: string;
  weddingLocation: string;
  content: WeddingContent;
  /** null → the template defaults apply */
  customizations: ThemeOverrides | null;
  status: WeddingStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface UserTemplate {
  templateId: string;
  acquiredAt: string;
}

/** Field errors keyed by path, e.g. "partner1", "contacts.0.phone" */
export type ValidationErrors = Record<string, string>;

/** Sent from the studio to the preview iframe on every edit */
export interface PreviewMessage {
  type: "canto:preview";
  content: Partial<WeddingContent>;
  overrides: ThemeOverrides | null;
}
