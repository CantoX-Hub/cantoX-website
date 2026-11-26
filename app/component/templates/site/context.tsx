"use client";

import { createContext, useContext } from "react";
import type { Couple, PreviewDevice, TemplateSection } from "@/app/types/template.types";

interface SiteContextValue {
  couple: Couple;
  device: PreviewDevice;
  /** Visible sections only */
  sections: TemplateSection[];
  logo?: string;
  /** Scrolls to a section by id (works inside the preview's scroll container) */
  scrollTo: (id: string) => void;
}

export const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <TemplateRenderer>");
  const { device } = ctx;
  /** Picks the desktop or mobile class string */
  const pick = (desktop: string, mobile: string) => (device === "desktop" ? desktop : mobile);
  return { ...ctx, isDesktop: device === "desktop", pick };
}

/** "2027-04-17" → "Saturday, 17 April 2027". Parsed as a local date so it never shifts a day. */
export function formatDate(iso: string, style: "long" | "short" = "long") {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(
    "en-GB",
    style === "long" ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "short", year: "numeric" }
  );
}

/** DOM id for a section, prefixed so two previews on one page can't clash */
export const sectionDomId = (id: string) => `tpl-${id}`;
