"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { BURGUNDY_MAP_IMAGE } from "@/app/data/wedding-templates";
import { useMediaQuery } from "@/app/lib/use-media-query";
import {
  ceremonyDateTime,
  coupleNames,
  formatLongDate,
  formatTime,
  hasSection,
} from "@/app/lib/wedding-utils";
import type {
  TemplateDefinition,
  ThemeValues,
  WeddingContent,
} from "@/app/types/wedding.types";
import { FillImage, headingFont } from "./ThemeScope";

/** Sections (story, gallery, contacts, ride links) render only when filled in */

const filled = (value?: string) => !!value && value.trim() !== "";
const pad = (n: number) => String(n).padStart(2, "0");

function useCountdown(target: Date | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!target || now === null) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = Math.max(0, target.getTime() - now);
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const jump = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** The design's deep brand colour (#3C1016) is the primary at 35% over black, so it follows a recolour */
const dark = () => "color-mix(in srgb, var(--c-primary) 35%, black)";

function Eyebrow({ children }: { children: string }) {
  return (
    <p
      className="flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.3em] md:text-[13px]"
      style={{ color: "var(--c-primary)", fontFamily: "var(--f-body)" }}
    >
      <span className="h-px w-6 bg-current opacity-60" />
      {children}
      <span className="h-px w-6 bg-current opacity-60" />
    </p>
  );
}

function SectionTitle({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <h2
      style={{ ...headingFont, color: light ? "#fff" : dark() }}
      className="mt-3 text-center text-[34px] font-light md:text-[50px]"
    >
      {children}
    </h2>
  );
}

export default function WebsiteLayout({
  template,
  content,
  theme,
}: {
  template: TemplateDefinition;
  content: WeddingContent;
  theme: ThemeValues;
}) {
  const [copied, setCopied] = useState(false);
  const galleryColumns = useMediaQuery("(min-width: 768px)") ? 4 : 2;
  const countdown = useCountdown(ceremonyDateTime(content));

  const storySpec = hasSection(template, "story");
  const storyText = (key: string) => content.story?.[key] ?? "";
  const storyBlocks = storySpec?.blocks ?? [];
  const intro = storyBlocks[0] ? storyText(storyBlocks[0].key) : "";
  const rows = storyBlocks.slice(1);
  const loveStory = content.gallery?.loveStory ?? [];
  const lens = (content.gallery?.lens ?? []).filter(Boolean);
  const contacts = (content.contacts ?? []).filter((c) => filled(c.name) || filled(c.phone));
  const addons = content.addons ?? {};
  const hasStory = storyBlocks.some((b) => filled(storyText(b.key)));

  const address = [content.venue, content.venueAddress].filter(filled).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const rideLinks = [
    {
      key: "uber",
      label: "Uber",
      href: `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encodeURIComponent(address)}`,
      bg: "#000",
      fg: "#fff",
    },
    { key: "bolt", label: "Bolt", href: "https://bolt.eu/", bg: "#34D186", fg: "#0b2e1d" },
    { key: "indrive", label: "Indrive", href: "https://indrive.com/", bg: "#C1F11D", fg: "#1f2a00" },
  ].filter((ride) => addons[ride.key]);

  const nav = [
    hasStory && { id: "story", label: "Story" },
    { id: "details", label: "Details" },
    { id: "venue", label: "Venue" },
    lens.length > 0 && { id: "gallery", label: "Gallery" },
    contacts.length > 0 && { id: "contact", label: "Contact" },
  ].filter(Boolean) as { id: string; label: string }[];

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  return (
    <main style={{ background: "var(--c-secondary)", color: dark() }}>
      {/* Hero */}
      <section
        className="relative flex min-h-[640px] flex-col text-white md:min-h-[720px]"
        style={{ background: "var(--c-hero-tint)" }}
      >
        {theme.heroBanner && (
          <FillImage src={theme.heroBanner} priority className="object-cover object-[50%_20%]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/60" />

        <nav
          aria-label="Sections"
          className="relative z-10 flex items-center justify-center gap-5 overflow-x-auto px-4 py-4 text-[13px] md:gap-9 md:text-[14px]"
          style={{ background: "color-mix(in srgb, var(--c-primary) 78%, transparent)" }}
        >
          {content.logo && (
            <span className="relative mr-2 hidden h-7 w-20 shrink-0 md:block">
              <FillImage src={content.logo} alt="Logo" className="object-contain" />
            </span>
          )}
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => jump(item.id)}
              className="shrink-0 transition-opacity hover:opacity-70"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-12 text-center md:pb-16">
          <h1
            style={headingFont}
            className="mb-8 text-[40px] font-light leading-tight md:text-[64px]"
          >
            {coupleNames(content)}
          </h1>

          <div className="grid w-full max-w-[560px] grid-cols-4 gap-2 md:gap-3">
            {(
              [
                ["Days", countdown.days],
                ["Hours", countdown.hours],
                ["Minutes", countdown.minutes],
                ["Seconds", countdown.seconds],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-[3px] border border-white/40 bg-black/35 px-1 py-3 backdrop-blur-[2px] md:py-4"
              >
                <p
                  className="text-[30px] leading-none md:text-[56px]"
                  style={{
                    fontFamily: "var(--f-body)",
                    color: "color-mix(in srgb, var(--c-primary) 82%, #ff2d4f)",
                  }}
                  aria-label={`${value} ${label}`}
                >
                  {label === "Days" ? value : pad(value)}
                </p>
                <p className="mt-2 text-[12px] uppercase tracking-[0.15em] md:text-[13px]">{label}</p>
              </div>
            ))}
          </div>

          {(hasStory || contacts.length > 0) && (
            <div className="mt-4 flex w-full max-w-[560px] gap-2 md:gap-3">
              {hasStory && (
                <button
                  type="button"
                  onClick={() => jump("story")}
                  className="h-11 flex-1 rounded-[2px] bg-white text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-85 md:text-[13px]"
                  style={{ color: dark() }}
                >
                  Our story
                </button>
              )}
              {contacts.length > 0 && (
                <button
                  type="button"
                  onClick={() => jump("contact")}
                  className="h-11 flex-1 rounded-[2px] border border-white/70 text-[12px] uppercase tracking-[0.2em] md:text-[13px] transition-colors hover:bg-white/10"
                >
                  Contact
                </button>
              )}
            </div>
          )}

          {filled(content.hashtag) && (
            <p className="mt-6 text-[14px] tracking-[0.2em] opacity-80">{content.hashtag}</p>
          )}
        </div>
      </section>

      {/* Story */}
      {hasStory && (
        <section id="story" className="mx-auto w-full max-w-[1000px] scroll-mt-4 px-5 py-16 md:py-24">
          <Eyebrow>Our journey</Eyebrow>
          <SectionTitle>Our Love Story</SectionTitle>
          {filled(intro) && (
            <p
              className="mx-auto mt-5 max-w-[640px] text-center text-[15px] leading-7 opacity-80 md:text-[16px]"
              style={headingFont}
            >
              {intro}
            </p>
          )}

          <div className="mt-14 flex flex-col gap-14 md:gap-20">
            {rows.map((block, i) => {
              const photo = loveStory[i];
              const text = storyText(block.key);
              if (!filled(text) && !photo) return null;
              return (
                <div
                  key={block.key}
                  className={`flex flex-col items-center gap-6 md:gap-16 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  <div className="flex-1 text-center md:text-left">
                    <h3
                      style={{ ...headingFont, color: dark() }}
                      className="text-[24px] font-light md:text-[28px]"
                    >
                      {block.label}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 opacity-80 md:text-[16px]" style={headingFont}>
                      {text}
                    </p>
                  </div>
                  {photo && (
                    <div className="relative aspect-[4/5] w-full max-w-[300px] shrink-0 overflow-hidden rounded-[3px] shadow-[0_12px_30px_rgba(60,16,22,0.2)]">
                      <FillImage src={photo} alt={block.label} className="object-cover" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Details */}
      <section id="details" className="scroll-mt-4 px-5 py-16 text-white md:py-24" style={{ background: dark() }}>
        <p className="text-center text-[12px] uppercase tracking-[0.25em] opacity-70 md:text-[13px]">Save the date</p>
        <SectionTitle light>Wedding Details</SectionTitle>
        <div className="mx-auto mt-10 grid max-w-[760px] grid-cols-1 gap-8 text-center md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/30">
          {[
            ["Date", formatLongDate(content.weddingDate)],
            ["Time", formatTime(content.ceremonyTime)],
            ["Venue", content.venue],
          ].map(([label, value]) => (
            <div key={label} className="px-4">
              <p className="text-[12px] uppercase tracking-[0.25em] opacity-70 md:text-[13px]">{label}</p>
              <p className="mt-2 text-[16px]" style={headingFont}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Venue */}
      <section id="venue" className="mx-auto w-full max-w-[860px] scroll-mt-4 px-5 py-16 md:py-24">
        <Eyebrow>Find us</Eyebrow>
        <SectionTitle>Getting There</SectionTitle>
        <div className="relative mt-10 aspect-[696/359] w-full overflow-hidden rounded-[3px]">
          <FillImage src={BURGUNDY_MAP_IMAGE} alt={`Map to ${content.venue}`} className="object-cover" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center rounded-[2px] text-[12px] uppercase tracking-[0.2em] text-white transition-opacity md:text-[13px] hover:opacity-85"
            style={{ background: dark() }}
          >
            Open map
          </a>
          {rideLinks.map((ride) => (
            <a
              key={ride.key}
              href={ride.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center rounded-[2px] text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-85 md:text-[13px]"
              style={{ background: ride.bg, color: ride.fg }}
            >
              {ride.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={copyAddress}
          className="mx-auto mt-6 flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70 md:text-[13px]"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Address copied" : "Copy venue address"}
        </button>
      </section>

      {/* Gallery */}
      {lens.length > 0 && (
        <section id="gallery" className="mx-auto w-full max-w-[1100px] scroll-mt-4 px-5 pb-16 md:pb-24">
          <Eyebrow>Moments</Eyebrow>
          <SectionTitle>Through Our Lens</SectionTitle>
          {/* Photos keep their own proportions; dealing them out round-robin keeps the reading order left to right */}
          <div className="mt-10 flex gap-3">
            {Array.from({ length: galleryColumns }, (_, col) => (
              <div key={col} className="flex min-w-0 flex-1 flex-col gap-3">
                {lens
                  .filter((_, i) => i % galleryColumns === col)
                  .map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src.slice(-32)}
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-auto w-full rounded-[10px]"
                    />
                  ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {contacts.length > 0 && (
        <section id="contact" className="mx-auto w-full max-w-[760px] scroll-mt-4 px-5 pb-16 md:pb-24">
          <Eyebrow>Say hello</Eyebrow>
          <SectionTitle>Contact</SectionTitle>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {contacts.map((person, i) => (
              <a
                key={i}
                href={`tel:${person.phone.replace(/\s/g, "")}`}
                className="rounded-[3px] bg-white/70 p-4 text-center transition-colors hover:bg-white"
              >
                <p className="text-[15px] font-medium">{person.name}</p>
                <p className="mt-1 text-[14px] opacity-70">{person.phone}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <footer className="px-5 py-10 text-center text-white" style={{ background: dark() }}>
        <p className="text-[24px] font-light" style={headingFont}>
          {coupleNames(content)}
        </p>
        <p className="mt-2 text-[12px] uppercase tracking-[0.25em] opacity-70">
          {formatLongDate(content.weddingDate)}
          {filled(content.hashtag) ? `  ·  ${content.hashtag}` : ""}
        </p>
      </footer>
    </main>
  );
}
