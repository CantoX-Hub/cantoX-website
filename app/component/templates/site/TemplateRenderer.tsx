"use client";

import { useCallback, useEffect, useMemo, type ComponentType } from "react";
import type { PreviewDevice, SectionType, TemplateSection, WeddingTemplate } from "@/app/types/template.types";
import { SiteContext, sectionDomId } from "./context";
import { Countdown, Events, Footer, Gallery, Gifts, Hero, Location, Quote, Rsvp, Story, Wishlist } from "./sections";

/** One component per section type. Add a type here and in template.types.ts. */
const SECTION_COMPONENTS: { [K in SectionType]: ComponentType<{ section: Extract<TemplateSection, { type: K }> }> } = {
  hero: Hero,
  countdown: Countdown,
  story: Story,
  events: Events,
  location: Location,
  gallery: Gallery,
  wishlist: Wishlist,
  gifts: Gifts,
  rsvp: Rsvp,
  quote: Quote,
  footer: Footer,
};

/** Adds the template's Google Fonts stylesheet to <head> once */
function useGoogleFonts(families: string[] | undefined) {
  const href = families?.length ? `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap` : null;
  useEffect(() => {
    if (!href || document.querySelector(`link[data-template-fonts="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.templateFonts = href;
    document.head.appendChild(link);
  }, [href]);
}

/**
 * Renders a full wedding website from a template. Only the sections listed in
 * `template.sections` are drawn, in that order; unknown section types are skipped.
 */
export default function TemplateRenderer({ template, device }: { template: WeddingTemplate; device: PreviewDevice }) {
  const { theme, couple } = template;
  useGoogleFonts(theme.googleFonts);

  const sections = useMemo(() => template.sections.filter((s) => !s.hidden), [template.sections]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(sectionDomId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const ctx = useMemo(() => ({ couple, device, sections, scrollTo, logo: theme.logo }), [couple, device, sections, scrollTo, theme.logo]);

  const vars = {
    "--t-bg": theme.colors.background,
    "--t-surface": theme.colors.surface,
    "--t-text": theme.colors.text,
    "--t-muted": theme.colors.muted,
    "--t-primary": theme.colors.primary,
    "--t-on-primary": theme.colors.onPrimary,
    "--t-accent": theme.colors.accent ?? theme.colors.primary,
    "--t-script": theme.fonts.script,
    "--t-heading": theme.fonts.heading,
    "--t-body": theme.fonts.body,
    background: "var(--t-bg)",
    color: "var(--t-text)",
    fontFamily: "var(--t-body)",
  } as React.CSSProperties;

  return (
    <SiteContext.Provider value={ctx}>
      <div style={vars} className="w-full">
        {sections.map((section) => {
          const Section = SECTION_COMPONENTS[section.type] as ComponentType<{ section: TemplateSection }> | undefined;
          return Section ? <Section key={section.id} section={section} /> : null;
        })}
      </div>
    </SiteContext.Provider>
  );
}

/** Human labels for "what's inside" chips */
export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Cover",
  countdown: "Countdown",
  story: "Love story",
  events: "Wedding details",
  location: "Map",
  gallery: "Gallery",
  wishlist: "Wishlist",
  gifts: "Cash gifts",
  rsvp: "RSVP",
  quote: "Quote",
  footer: "Footer",
};
