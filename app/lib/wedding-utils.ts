import type { CSSProperties } from "react";
import type {
  CoreContent,
  SectionSpec,
  TemplateDefinition,
  ThemeOverrides,
  ThemeValues,
  ValidationErrors,
  WeddingContent,
} from "@/app/types/wedding.types";
import { CORE_FIELDS } from "@/app/data/wedding-templates/shared";
import { FONT_STACKS } from "./fonts";

export const emptyCore = (): CoreContent => ({
  partner1: "",
  partner2: "",
  weddingDate: "",
  ceremonyTime: "",
  venue: "",
});

export const hasSection = <K extends SectionSpec["kind"]>(
  template: TemplateDefinition,
  kind: K
) => template.sections.find((s): s is Extract<SectionSpec, { kind: K }> => s.kind === kind);

/** Template defaults with the couple's overrides on top */
export function resolveTheme(
  template: TemplateDefinition,
  overrides: ThemeOverrides | null | undefined
): ThemeValues {
  const merged = { ...template.customizationSchema.defaults };
  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      // null / "" mean "cleared": fall back to the template default
      if (value !== undefined && value !== null && value !== "") {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
  }
  return merged;
}

/** CSS variables the layouts read */
export function themeStyle(theme: ThemeValues): CSSProperties {
  return {
    "--c-primary": theme.primary,
    "--c-secondary": theme.secondary,
    "--c-bg": theme.background,
    "--c-text": theme.text,
    "--c-hero-tint": theme.heroTint,
    "--c-hero-text": theme.heroText,
    "--f-heading": FONT_STACKS[theme.headingFont],
    "--f-script": FONT_STACKS[theme.scriptFont],
    "--f-body": FONT_STACKS[theme.bodyFont],
  } as CSSProperties;
}

const filled = (value: string | undefined) => !!value && value.trim() !== "";

/** placeholders: fill empty fields from the template's mock data (previews, studio). Off on the public site. */
export function resolveContent(
  template: TemplateDefinition,
  content: Partial<WeddingContent> | null | undefined,
  placeholders: boolean
): WeddingContent {
  const mock = template.mock;
  const src = content ?? {};
  const pick = (value: string | undefined, fallback: string | undefined) =>
    filled(value) ? (value as string) : placeholders ? fallback ?? "" : "";

  const out: WeddingContent = {
    partner1: pick(src.partner1, mock.partner1),
    partner2: pick(src.partner2, mock.partner2),
    weddingDate: pick(src.weddingDate, mock.weddingDate),
    ceremonyTime: pick(src.ceremonyTime, mock.ceremonyTime),
    venue: pick(src.venue, mock.venue),
    venueAddress: pick(src.venueAddress, mock.venueAddress),
    hashtag: pick(src.hashtag, mock.hashtag),
    tagline: pick(src.tagline, mock.tagline),
    hostsA: pick(src.hostsA, mock.hostsA),
    hostsB: pick(src.hostsB, mock.hostsB),
    logo: src.logo || undefined,
  };

  const story = hasSection(template, "story");
  if (story) {
    out.story = {};
    for (const block of story.blocks) {
      out.story[block.key] = pick(src.story?.[block.key], mock.story?.[block.key]);
    }
  }

  const contacts = hasSection(template, "contacts");
  if (contacts) {
    out.contacts = Array.from({ length: contacts.count }, (_, i) => {
      const own = src.contacts?.[i];
      if (own && (filled(own.name) || filled(own.phone))) return own;
      return placeholders ? mock.contacts?.[i] ?? { name: "", phone: "" } : { name: "", phone: "" };
    });
  }

  const gifts = hasSection(template, "gifts");
  if (gifts) {
    out.gifts = Array.from({ length: gifts.count }, (_, i) => {
      const own = src.gifts?.[i];
      if (own && (filled(own.label) || filled(own.value))) return own;
      return placeholders ? mock.gifts?.[i] ?? { label: "", value: "" } : { label: "", value: "" };
    });
  }

  const gallery = hasSection(template, "gallery");
  if (gallery) {
    const slots = (count: number, own?: string[], fallback?: string[]) =>
      Array.from({ length: count }, (_, i) =>
        own?.[i] ? own[i] : placeholders ? fallback?.[i] ?? "" : ""
      );
    out.gallery = {
      loveStory: slots(gallery.loveStory, src.gallery?.loveStory, mock.gallery?.loveStory),
      lens: slots(gallery.lens, src.gallery?.lens, mock.gallery?.lens),
    };
  }

  const addons = hasSection(template, "addons");
  if (addons) {
    out.addons = {};
    for (const option of addons.options) {
      out.addons[option.key] =
        src.addons?.[option.key] ?? (placeholders ? mock.addons?.[option.key] ?? false : false);
    }
  }

  return out;
}

const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/;

export function validateWedding(
  template: TemplateDefinition,
  content: Partial<WeddingContent>
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Compulsory everywhere, whatever the template's schema lists
  for (const field of CORE_FIELDS) {
    if (!filled(content[field.key as keyof CoreContent] as string | undefined)) {
      errors[field.key] = `${field.label} is required`;
    }
  }

  // Compulsory only where the schema says so
  for (const section of template.sections) {
    if (section.kind === "fields") {
      for (const field of section.fields) {
        if (field.required && !filled(content[field.key] as string | undefined)) {
          errors[field.key] = `${field.label} is required`;
        }
      }
    }
    if (section.kind === "contacts" && section.required) {
      const complete = (content.contacts ?? []).some((c) => filled(c.name) && filled(c.phone));
      if (!complete) errors["contacts.0.name"] = "Add at least one contact";
    }
  }

  if (filled(content.weddingDate) && Number.isNaN(Date.parse(content.weddingDate as string))) {
    errors.weddingDate = "Enter a valid date";
  }

  content.contacts?.forEach((contact, i) => {
    if (filled(contact.name) && !filled(contact.phone)) {
      errors[`contacts.${i}.phone`] = "Add a phone number";
    }
    if (filled(contact.phone) && !PHONE_PATTERN.test(contact.phone.trim())) {
      errors[`contacts.${i}.phone`] = "Enter a valid phone number";
    }
    if (filled(contact.phone) && !filled(contact.name)) {
      errors[`contacts.${i}.name`] = "Add a name";
    }
  });

  content.gifts?.forEach((gift, i) => {
    if (filled(gift.label) !== filled(gift.value)) {
      errors[`gifts.${i}.${filled(gift.label) ? "value" : "label"}`] = "Fill in both fields";
    }
  });

  return errors;
}

/** Which section id owns an error path, so the studio can open it */
export function sectionForError(template: TemplateDefinition, path: string): string | null {
  const [head] = path.split(".");
  for (const section of template.sections) {
    if (section.kind === "fields" && section.fields.some((f) => f.key === head)) return section.id;
    if (section.kind === head) return section.id;
  }
  return null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** Parses yyyy-mm-dd as a local date (no timezone shift) */
export function parseLocalDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatLongDate(iso: string) {
  const date = parseLocalDate(iso);
  if (!date) return "";
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
}

export function formatTime(time: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return "";
  const hours = Number(match[1]);
  return `${hours % 12 === 0 ? 12 : hours % 12}:${match[2]}${hours >= 12 ? "PM" : "AM"}`;
}

/** Ceremony start as a Date (local), or null when the inputs are incomplete */
export function ceremonyDateTime(content: Pick<CoreContent, "weddingDate" | "ceremonyTime">) {
  const date = parseLocalDate(content.weddingDate);
  if (!date) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(content.ceremonyTime);
  if (match) date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date;
}

export const coupleNames = (content: Pick<CoreContent, "partner1" | "partner2">) =>
  [content.partner1, content.partner2].filter((n) => n && n.trim()).join(" & ");

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function uniqueSlug(base: string, taken: string[]) {
  const root = slugify(base) || "our-wedding";
  if (!taken.includes(root)) return root;
  let n = 2;
  while (taken.includes(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

export function timeAgo(iso: string, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}hr ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Reads an image file and downsizes it so it fits comfortably in localStorage */
export function fileToDataUrl(file: File, maxEdge = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not read that image"));
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // PNG keeps logo transparency; everything else goes JPEG for size
        const type = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(type, quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
