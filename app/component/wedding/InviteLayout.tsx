"use client";

import { useState } from "react";
import { Check, Copy, Gift, Phone } from "lucide-react";
import {
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
import { FillImage, headingFont, scriptFont } from "./ThemeScope";

/** Optional blocks (hosts, hashtag, RSVP, gifts, photos, logo) render only when filled in */

const filled = (value?: string) => !!value && value.trim() !== "";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context); nothing useful to show
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="shrink-0 transition-opacity hover:opacity-70"
      style={{ color: "var(--c-secondary)" }}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function Names({
  content,
  className = "",
  color,
}: {
  content: WeddingContent;
  className?: string;
  color?: string;
}) {
  return (
    <h1
      aria-label={coupleNames(content)}
      style={color ? { ...scriptFont, color } : scriptFont}
      className={`flex flex-col items-center leading-none ${className}`}
    >
      <span aria-hidden="true">{content.partner1}</span>
      <span aria-hidden="true" className="text-[0.32em] leading-none">
        &amp;
      </span>
      <span aria-hidden="true">{content.partner2}</span>
    </h1>
  );
}

/** Polaroid: white border, soft shadow, a slight tilt and a strip of tape */
const TILTS = ["-rotate-3", "rotate-2", "-rotate-1"];
const TAPES = [
  "-right-5 -top-3 rotate-[35deg]",
  "-left-6 -bottom-2 rotate-[35deg]",
  "-right-6 -bottom-3 -rotate-[35deg]",
];

function Photo({ src, index }: { src: string; index: number }) {
  return (
    <div
      className={`relative w-full max-w-[300px] bg-white p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:w-1/3 ${TILTS[index % 3]}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <FillImage src={src} alt={`Photo ${index + 1}`} className="object-cover" />
      </div>
      <span
        aria-hidden="true"
        className={`absolute h-12 w-12 opacity-90 ${TAPES[index % 3]}`}
        style={{
          backgroundImage: "url(/templates/itunu-stephen/tape.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}

export default function InviteLayout({
  template,
  content,
  theme,
}: {
  template: TemplateDefinition;
  content: WeddingContent;
  theme: ThemeValues;
}) {
  const contacts = (content.contacts ?? []).filter((c) => filled(c.name) || filled(c.phone));
  const gifts = (content.gifts ?? []).filter((g) => filled(g.label) || filled(g.value));
  const photos = (content.gallery?.loveStory ?? []).filter(Boolean);
  const hasHosts = filled(content.hostsA) || filled(content.hostsB);
  const gallerySpec = hasSection(template, "gallery");

  const scrollToDetails = () =>
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main style={{ background: "var(--c-bg)", color: "var(--c-text)" }}>
      {/* Hero */}
      <section
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        style={{ background: "var(--c-hero-tint)", color: "var(--c-hero-text)" }}
      >
        {theme.heroBanner && (
          <>
            <div className="absolute inset-x-0 top-0 h-[55%] md:left-1/2 md:h-[640px] md:w-[900px] md:-translate-x-1/2 md:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
              <div className="relative h-full w-full md:[mask-image:linear-gradient(to_bottom,black_78%,transparent)]">
                <FillImage src={theme.heroBanner} priority className="object-cover object-top" />
              </div>
            </div>
            <div
              className="absolute inset-0 md:hidden"
              style={{
                background: "linear-gradient(to bottom, transparent 40%, var(--c-hero-tint) 62%)",
              }}
            />
          </>
        )}

        {content.logo && (
          <div className="absolute left-0 right-0 top-6 z-10 flex justify-center">
            <div className="relative h-14 w-40">
              <FillImage src={content.logo} alt="Logo" className="object-contain" />
            </div>
          </div>
        )}

        <div className="relative mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-end px-6 pb-10 pt-24 md:max-w-[1100px] md:items-center md:px-10 md:pb-16">
          <Names
            content={content}
            className="mb-14 self-center text-[100px] md:mb-20 md:text-[168px]"
          />

          <div className="w-full md:max-w-[640px] md:text-center">
            <p className="text-[20px] font-medium italic md:text-[26px]" style={{ fontFamily: "var(--f-body)" }}>
              Hello, 🎉😍
            </p>
            <p
              className="mt-1 text-[36px] font-light leading-[1.1] md:text-[52px]"
              style={{ fontFamily: "var(--f-body)" }}
            >
              {filled(content.tagline) ? content.tagline : "We are doing forever together."}
            </p>
            <p
              className="mt-6 text-[14px] font-light md:text-[16px]"
              style={{ fontFamily: "var(--f-body)" }}
            >
              If you are seeing this, you have been invited
            </p>

            <button
              type="button"
              onClick={scrollToDetails}
              className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full border text-[13px] font-semibold backdrop-blur-md transition-opacity hover:opacity-80 md:mx-auto md:max-w-[320px]"
              style={{
                borderColor: "color-mix(in srgb, var(--c-hero-text) 15%, transparent)",
                background: "color-mix(in srgb, var(--c-hero-text) 12%, transparent)",
                fontFamily: "var(--f-body)",
              }}
            >
              Scroll down
            </button>
          </div>
        </div>
      </section>

      {/* Invitation */}
      <section
        id="details"
        className="mx-auto flex w-full max-w-[640px] scroll-mt-4 flex-col items-center px-6 pb-8 pt-16 text-center md:pt-24"
      >
        {hasHosts ? (
          <>
            <p style={scriptFont} className="text-[16px] md:text-[20px]">
              The families of
            </p>
            {filled(content.hostsA) && (
              <p
                style={headingFont}
                className="mt-3 whitespace-pre-line text-[13px] font-bold uppercase leading-[1.5] md:text-[16px]"
              >
                {content.hostsA}
              </p>
            )}
            {filled(content.hostsA) && filled(content.hostsB) && (
              <p style={scriptFont} className="my-2 text-[16px] md:text-[20px]">
                &amp;
              </p>
            )}
            {filled(content.hostsB) && (
              <p
                style={headingFont}
                className="whitespace-pre-line text-[13px] font-bold uppercase leading-[1.5] md:text-[16px]"
              >
                {content.hostsB}
              </p>
            )}
            <p style={scriptFont} className="mt-5 text-[16px] md:text-[20px]">
              cordially invites you to the
            </p>
            <p style={scriptFont} className="text-[18px] md:text-[26px]">
              Wedding Ceremony of their children
            </p>
          </>
        ) : (
          <>
            <p style={scriptFont} className="text-[16px] md:text-[20px]">
              Together with their families
            </p>
            <p style={scriptFont} className="text-[18px] md:text-[26px]">
              invite you to celebrate the wedding of
            </p>
          </>
        )}

        <Names
          content={content}
          className="my-14 text-[100px] md:my-20 md:text-[150px]"
          color="var(--c-primary)"
        />

        {filled(content.hashtag) && (
          <p
            style={headingFont}
            className="-mt-6 mb-8 text-[15px] tracking-wide md:text-[20px]"
          >
            {content.hashtag}
          </p>
        )}

        <p style={scriptFont} className="text-[16px] md:text-[24px]">
          Date
        </p>
        <p style={headingFont} className="text-[15px] uppercase md:text-[24px]">
          {formatLongDate(content.weddingDate)}
        </p>
        <p style={scriptFont} className="mt-5 text-[16px] md:text-[24px]">
          Time
        </p>
        <p style={headingFont} className="text-[15px] uppercase md:text-[24px]">
          {formatTime(content.ceremonyTime)}
        </p>
        <p style={scriptFont} className="mt-5 text-[16px] md:text-[24px]">
          Venue
        </p>
        <p style={headingFont} className="text-[13px] font-bold uppercase md:text-[17px]">
          {content.venue}
        </p>
        {filled(content.venueAddress) && (
          <p style={headingFont} className="text-[12px] uppercase md:text-[14px]">
            {content.venueAddress}
          </p>
        )}
      </section>

      {/* RSVP + gifts: only the blocks this wedding filled in */}
      {(contacts.length > 0 || gifts.length > 0) && (
        <section
          className={`mx-auto grid w-full max-w-[640px] gap-10 px-6 py-12 md:py-20 ${
            contacts.length > 0 && gifts.length > 0
              ? "md:max-w-[1000px] md:grid-cols-2 md:gap-14"
              : ""
          }`}
        >
          {contacts.length > 0 && (
            <div>
              <h2 className="mb-4 text-[18px] font-bold" style={{ color: "var(--c-primary)" }}>
                R.S.V.P
              </h2>
              <div className="flex flex-col gap-3">
                {contacts.map((person, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-[0_4px_18px_rgba(18,26,71,0.08)]"
                  >
                    <span
                      className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg text-[20px] font-semibold"
                      style={{
                        background: "color-mix(in srgb, var(--c-secondary) 18%, white)",
                        color: "var(--c-primary)",
                      }}
                    >
                      {person.avatar ? (
                        <FillImage src={person.avatar} className="object-cover" />
                      ) : (
                        person.name.trim().charAt(0).toUpperCase() || <Phone className="h-5 w-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium">{person.name}</p>
                      <p className="mt-1 text-[12px] opacity-60">Contact:</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${person.phone.replace(/\s/g, "")}`}
                          className="text-[15px] font-bold"
                        >
                          {person.phone}
                        </a>
                        <CopyButton value={person.phone} label={`${person.name}'s number`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {gifts.length > 0 && (
            <div>
              <h2 className="mb-4 text-[18px] font-bold" style={{ color: "var(--c-primary)" }}>
                Send Gifts
              </h2>
              <div className="flex flex-col gap-3">
                {gifts.map((gift, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-[0_4px_18px_rgba(18,26,71,0.08)]"
                  >
                    <span
                      className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-lg"
                      style={{
                        background: "color-mix(in srgb, var(--c-secondary) 18%, white)",
                        color: "var(--c-primary)",
                      }}
                    >
                      {gift.logo ? (
                        <FillImage src={gift.logo} className="object-contain p-1.5" />
                      ) : (
                        <Gift className="h-6 w-6" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px]">{gift.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="break-all text-[15px] font-bold">{gift.value}</p>
                        <CopyButton value={gift.value} label={gift.label} />
                      </div>
                      {filled(gift.note) && (
                        <p className="mt-1 text-[12px] opacity-60">{gift.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Love pictures */}
      {gallerySpec && photos.length > 0 && (
        <section className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-6 px-4 pb-16 pt-8 md:max-w-[1100px] md:flex-row md:items-start md:justify-center md:gap-4 md:pb-24">
          {photos.map((src, i) => (
            <Photo key={`${i}-${src.slice(-24)}`} src={src} index={i} />
          ))}
        </section>
      )}
    </main>
  );
}
