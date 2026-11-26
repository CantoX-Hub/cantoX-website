/**
 * Wedding website templates.
 *
 * A template is its card details (TemplateSummary), a theme, and an ordered
 * list of sections. Templates don't share a fixed layout: each one lists only
 * the sections it uses, in the order it wants them. Anything a template
 * doesn't need (a wishlist, a map, a countdown…) is simply left out.
 *
 * Every section has a `type` naming its kind and a unique `id` (used for nav
 * links). The renderer skips types it doesn't know, so the backend can add new
 * section types without breaking older clients.
 */

export type TemplateTier = "free" | "premium";

/** Which layout the renderer uses. Driven by a prop, not the viewport, so a
 * phone-sized preview looks right on a desktop screen too. */
export type PreviewDevice = "desktop" | "mobile";

export interface TemplateTheme {
  colors: {
    /** Page background */
    background: string;
    /** Cards and alternate section bands */
    surface: string;
    text: string;
    muted: string;
    /** Headings, buttons and accent bands */
    primary: string;
    /** Text on top of `primary` */
    onPrimary: string;
    /** Small details (dividers, icons). Falls back to primary. */
    accent?: string;
  };
  /** CSS font-family values */
  fonts: {
    /** Couple names and section titles */
    script: string;
    heading: string;
    body: string;
  };
  /** Google Fonts css2 family params loaded with the template, e.g. "Great+Vibes" */
  googleFonts?: string[];
  /** Couple's logo (image URL). Replaces the initials in the hero nav. */
  logo?: string;
  /** Colours the editor suggests for this template. `secondary` sets the page background. */
  swatches?: { primary: string[]; secondary: string[] };
}

/** Sample couple shown in the preview; replaced by the user's own details */
export interface Couple {
  partnerOne: string;
  partnerTwo: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  city?: string;
  hashtag?: string;
}

interface SectionBase<T extends string> {
  type: T;
  /** Unique within the template */
  id: string;
  /** Small label above the heading, e.g. "Our journey" */
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  /** Short name in the hero nav. Defaults to the heading; sections with neither aren't linked. */
  navLabel?: string;
  /** Switched off in the editor's Add-on panel: kept in the template, not drawn */
  hidden?: boolean;
}

export interface HeroAction {
  label: string;
  /** Section id to scroll to */
  target: string;
}

export interface HeroSection extends SectionBase<"hero"> {
  image: string;
  tagline?: string;
  /** Button that scrolls to the RSVP section, when the template has one */
  ctaLabel?: string;
  /** Buttons that scroll to other sections. Used instead of ctaLabel when set. */
  actions?: HeroAction[];
  /** Show a top bar with links to the other sections. Default true. */
  showNav?: boolean;
  /** "bar" tints the nav with the primary colour. Default "transparent". */
  navStyle?: "transparent" | "bar";
  /** Big couple names over the photo. Default true. */
  showNames?: boolean;
  /** Countdown tiles inside the hero */
  showCountdown?: boolean;
}

export interface CountdownSection extends SectionBase<"countdown"> {
  /** Optional background photo */
  image?: string;
}

export interface StoryChapter {
  title?: string;
  body: string;
  image?: string;
}

export interface StorySection extends SectionBase<"story"> {
  /** Opening paragraph under the heading */
  intro?: string;
  chapters: StoryChapter[];
}

export interface WeddingEvent {
  name: string;
  /** ISO date. Defaults to the couple's date. */
  date?: string;
  time: string;
  venue: string;
  address?: string;
  dressCode?: string;
  /** Colours of the day, as CSS colours */
  colours?: string[];
}

export interface EventsSection extends SectionBase<"events"> {
  events: WeddingEvent[];
}

/** Ride-hailing apps a template can show buttons for under the map */
export type RideApp = "uber" | "bolt" | "indrive";

export interface LocationSection extends SectionBase<"location"> {
  venue: string;
  address: string;
  /** What to search on the map. Defaults to the address. */
  mapQuery?: string;
  notes?: string[];
  /** Ride buttons shown under the map (the editor’s "Add-on" switches) */
  rides?: RideApp[];
}

export interface GallerySection extends SectionBase<"gallery"> {
  images: string[];
  /** Columns on desktop (phones always use 2). Default 4. */
  columns?: 2 | 3 | 4;
}

export interface WishlistItem {
  name: string;
  /** In naira */
  price: number;
  image?: string;
  link?: string;
}

export interface WishlistSection extends SectionBase<"wishlist"> {
  items: WishlistItem[];
}

export interface GiftAccount {
  /** "Kuda Bank", "Zelle"… */
  provider: string;
  /** Account number, email or tag */
  value: string;
  accountName?: string;
  note?: string;
}

export interface GiftsSection extends SectionBase<"gifts"> {
  accounts: GiftAccount[];
}

export interface RsvpSection extends SectionBase<"rsvp"> {
  /** ISO date */
  deadline?: string;
  contacts: { name: string; phone: string }[];
}

export interface QuoteSection extends SectionBase<"quote"> {
  text: string;
  attribution?: string;
  /** Optional background photo */
  image?: string;
}

export interface FooterSection extends SectionBase<"footer"> {
  message?: string;
  image?: string;
}

export type TemplateSection =
  | HeroSection
  | CountdownSection
  | StorySection
  | EventsSection
  | LocationSection
  | GallerySection
  | WishlistSection
  | GiftsSection
  | RsvpSection
  | QuoteSection
  | FooterSection;

export type SectionType = TemplateSection["type"];

/** What a template card needs (the list endpoint) */
export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  tier: TemplateTier;
  /** 0–5 */
  rating: number;
  thumbnail: string;
  /** Section types the template includes, shown as "what's inside" */
  includes: SectionType[];
}

/** The full template (the detail endpoint) */
export interface WeddingTemplate extends TemplateSummary {
  theme: TemplateTheme;
  couple: Couple;
  sections: TemplateSection[];
}
