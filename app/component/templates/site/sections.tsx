"use client";

/* eslint-disable @next/next/no-img-element -- template photos will come from the API/CDN */

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Gift, MapPin, Phone } from "lucide-react";
import type {
  CountdownSection,
  EventsSection,
  FooterSection,
  GallerySection,
  GiftsSection,
  HeroSection,
  LocationSection,
  RideApp,
  QuoteSection,
  RsvpSection,
  StorySection,
  WishlistSection,
} from "@/app/types/template.types";
import { formatDate, sectionDomId, useSite } from "./context";

/* ---------- Theme helpers (values come from CSS variables set by the renderer) ---------- */

const font = {
  script: { fontFamily: "var(--t-script)" },
  heading: { fontFamily: "var(--t-heading)" },
};
const onPrimaryBand = { background: "var(--t-primary)", color: "var(--t-on-primary)" };
const surfaceBand = { background: "var(--t-surface)" };
const primaryButton = { background: "var(--t-primary)", color: "var(--t-on-primary)" };
/** A faint line in the current text colour */
const hairline = { borderColor: "color-mix(in srgb, currentColor 22%, transparent)" };

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function Band({
  id,
  style,
  className = "",
  children,
}: {
  id: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}) {
  const { pick } = useSite();
  return (
    <section id={sectionDomId(id)} style={style} className={`${pick("px-16 py-20", "px-5 py-14")} ${className}`}>
      <div className="mx-auto w-full max-w-[1080px]">{children}</div>
    </section>
  );
}

function Heading({ heading, subheading, eyebrow }: { heading?: string; subheading?: string; eyebrow?: string }) {
  const { pick } = useSite();
  if (!heading && !subheading && !eyebrow) return null;
  return (
    <div className={`text-center ${pick("mb-12", "mb-8")}`}>
      {eyebrow && (
        <p className="mb-3 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.24em]" style={{ color: "var(--t-accent)" }}>
          <span aria-hidden className="h-px w-8 bg-current" />
          {eyebrow}
          <span aria-hidden className="h-px w-8 bg-current" />
        </p>
      )}
      {heading && (
        <h2 style={font.script} className={`leading-none ${pick("text-[60px]", "text-[42px]")}`}>
          {heading}
        </h2>
      )}
      {subheading && <p className="mx-auto mt-3 max-w-[460px] text-[16px] opacity-75">{subheading}</p>}
      <span aria-hidden className="mx-auto mt-5 block h-px w-16" style={{ background: "var(--t-accent)" }} />
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <button type="button" onClick={copy} aria-label={`Copy ${label}`} className="shrink-0 opacity-70 transition-opacity hover:opacity-100">
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

/* ---------- Hero ---------- */

export function Hero({ section }: { section: HeroSection }) {
  const { couple, sections, scrollTo, pick, isDesktop, logo } = useSite();
  const links = sections
    .filter((s) => !s.hidden && s.type !== "hero" && s.type !== "footer" && (s.navLabel || s.heading))
    .map((s) => ({ id: s.id, label: s.navLabel || s.heading! }));
  const rsvp = sections.find((s) => s.type === "rsvp" && !s.hidden);
  const actions = (section.actions ?? []).filter((a) => sections.some((s) => s.id === a.target && !s.hidden));
  const bar = section.navStyle === "bar";
  const showNames = section.showNames !== false;

  const brand = logo ? (
    <img src={logo} alt={`${couple.partnerOne} & ${couple.partnerTwo}`} className="h-9 w-auto max-w-[120px] object-contain" />
  ) : (
    <span style={font.script} className="text-[30px] leading-none">
      {couple.partnerOne[0]}&amp;{couple.partnerTwo[0]}
    </span>
  );

  return (
    <header id={sectionDomId(section.id)} className={`relative flex flex-col overflow-hidden text-white ${pick("min-h-[680px]", "min-h-[600px]")}`}>
      <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/65" />

      {section.showNav !== false && (
        <nav
          className={`relative z-10 flex items-center gap-6 ${bar ? pick("px-10 py-3", "px-4 py-2.5") : pick("px-16 py-6", "px-5 py-4")} ${
            bar && !logo ? "justify-center" : "justify-between"
          }`}
          style={bar ? { background: "color-mix(in srgb, var(--t-primary) 82%, transparent)", color: "var(--t-on-primary)" } : undefined}
        >
          {(!bar || logo) && brand}
          {links.length > 0 && (isDesktop || bar) && (
            <ul className={`flex gap-6 text-[13px] ${bar ? "" : "uppercase tracking-[0.2em]"} ${isDesktop ? "" : "overflow-x-auto whitespace-nowrap"}`}>
              {links.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(l.id)}
                    className={`pb-0.5 transition-opacity hover:opacity-100 ${bar && i === 0 ? "border-b border-current opacity-100" : "opacity-80"}`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      )}

      <div className={`relative z-10 flex flex-1 flex-col items-center px-6 pb-16 pt-10 text-center ${showNames ? "justify-center" : "justify-end"}`}>
        {showNames && (
          <>
            <h1 style={font.script} className={`leading-[0.95] ${pick("text-[112px]", "text-[66px]")}`}>
              {couple.partnerOne}
              <span className="block text-[0.42em] leading-tight">&amp;</span>
              {couple.partnerTwo}
            </h1>
            {section.tagline && <p className="mt-5 max-w-[440px] text-[17px] italic opacity-90">{section.tagline}</p>}
            <p style={font.heading} className="mt-5 text-[13px] uppercase tracking-[0.28em]">
              {formatDate(couple.date)}
              {couple.city && ` · ${couple.city}`}
            </p>
          </>
        )}
        {!showNames && <h1 className="sr-only">{`${couple.partnerOne} & ${couple.partnerTwo}`}</h1>}

        {section.showCountdown && (
          <div className={`w-full max-w-[420px] ${showNames ? "mt-8" : ""} ${pick("max-w-[460px]", "")}`}>
            <CountdownTiles tone="glass" />
          </div>
        )}

        {actions.length > 0 ? (
          <div className={`mt-5 flex flex-wrap justify-center ${pick("gap-3", "gap-2")}`}>
            {actions.map((a, i) => (
              <button
                key={a.target}
                type="button"
                onClick={() => scrollTo(a.target)}
                className={`min-w-[150px] rounded px-6 py-2.5 text-[12px] uppercase tracking-[0.22em] transition-opacity hover:opacity-90 ${
                  i === 0 ? "bg-white/90" : "border border-white/80 text-white"
                }`}
                style={i === 0 ? { color: "var(--t-primary)" } : undefined}
              >
                {a.label}
              </button>
            ))}
          </div>
        ) : (
          section.ctaLabel &&
          rsvp && (
            <button
              type="button"
              onClick={() => scrollTo(rsvp.id)}
              style={{ ...primaryButton, ...font.heading }}
              className="mt-9 rounded-full px-8 py-3 text-[12px] uppercase tracking-[0.22em] transition-opacity hover:opacity-90"
            >
              {section.ctaLabel}
            </button>
          )
        )}
      </div>
    </header>
  );
}

/* ---------- Countdown ---------- */

function useNow() {
  // null on the first render so server and client agree
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/** Days / hours / minutes / seconds until the wedding. "glass" sits on photos. */
function CountdownTiles({ tone = "plain" }: { tone?: "plain" | "glass" }) {
  const { couple, pick } = useSite();
  const now = useNow();
  const target = new Date(`${couple.date}T00:00:00`).getTime();
  const left = now === null ? null : Math.max(0, target - now);
  const parts = [
    { label: "Days", value: left === null ? null : Math.floor(left / 86_400_000) },
    { label: "Hours", value: left === null ? null : Math.floor(left / 3_600_000) % 24 },
    { label: "Minutes", value: left === null ? null : Math.floor(left / 60_000) % 60 },
    { label: "Seconds", value: left === null ? null : Math.floor(left / 1000) % 60 },
  ];
  const glass = tone === "glass";

  return (
    <div className={`mx-auto grid max-w-[640px] grid-cols-4 ${pick(glass ? "gap-3" : "gap-6", "gap-2")}`} role="timer" aria-label="Time until the wedding">
      {parts.map((p) => (
        <div
          key={p.label}
          className={`rounded-md border text-center ${glass ? "border-white/60 bg-black/35 backdrop-blur-sm" : ""} ${pick(glass ? "py-3" : "py-6", "py-2.5")}`}
          style={glass ? undefined : hairline}
        >
          <p
            style={{ ...font.heading, ...(glass ? { color: "var(--t-accent)" } : {}) }}
            className={`tabular-nums leading-none ${pick(glass ? "text-[38px]" : "text-[44px]", "text-[24px]")}`}
          >
            {p.value === null ? "--" : String(p.value).padStart(2, "0")}
          </p>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] opacity-80">{p.label}</p>
        </div>
      ))}
    </div>
  );
}

export function Countdown({ section }: { section: CountdownSection }) {
  const content = (
    <>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      <CountdownTiles />
    </>
  );
  const { pick } = useSite();

  if (!section.image) {
    return (
      <Band id={section.id} style={surfaceBand}>
        {content}
      </Band>
    );
  }

  return (
    <section id={sectionDomId(section.id)} className={`relative overflow-hidden text-white ${pick("px-16 py-24", "px-5 py-16")}`}>
      <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto max-w-[1080px]">{content}</div>
    </section>
  );
}

/* ---------- Story ---------- */

export function Story({ section }: { section: StorySection }) {
  const { pick, isDesktop } = useSite();
  return (
    <Band id={section.id}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      {section.intro && (
        <p className={`mx-auto max-w-[680px] whitespace-pre-line text-center text-[17px] leading-8 opacity-80 ${pick("-mt-4 mb-16", "-mt-2 mb-10")}`}>{section.intro}</p>
      )}
      <div className={`flex flex-col ${pick("gap-20", "gap-12")}`}>
        {section.chapters.map((c, i) => (
          <article key={i} className={c.image ? pick("grid grid-cols-2 items-center gap-14", "flex flex-col gap-6") : "mx-auto max-w-[620px] text-center"}>
            {c.image && (
              <img
                src={c.image}
                alt={c.title ?? ""}
                className={`aspect-[4/5] w-full rounded-lg object-cover ${isDesktop && i % 2 === 1 ? "order-2" : ""}`}
              />
            )}
            <div className={isDesktop ? "" : "text-center"}>
              {c.title && (
                <h3 style={font.heading} className="text-[22px] uppercase tracking-[0.12em]">
                  {c.title}
                </h3>
              )}
              <p className="mt-4 whitespace-pre-line text-[18px] leading-8 opacity-80">{c.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Band>
  );
}

/* ---------- Events ---------- */

const EVENT_COLS: Record<number, string> = { 1: "grid-cols-1 max-w-[520px] mx-auto", 2: "grid-cols-2", 3: "grid-cols-3" };

export function Events({ section }: { section: EventsSection }) {
  const { couple, pick } = useSite();
  const cols = pick(EVENT_COLS[Math.min(section.events.length, 3)], "grid-cols-1");

  return (
    <Band id={section.id} style={onPrimaryBand}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      <div className={`grid gap-5 ${cols}`}>
        {section.events.map((e) => (
          <article key={e.name} className="flex flex-col items-center rounded-lg border px-6 py-8 text-center" style={hairline}>
            <h3 style={font.heading} className="text-[18px] uppercase tracking-[0.16em]">
              {e.name}
            </h3>
            <p className="mt-4 text-[16px]">{formatDate(e.date ?? couple.date)}</p>
            <p className="text-[16px] opacity-80">{e.time}</p>
            <span aria-hidden className="my-5 h-px w-10 bg-current opacity-30" />
            <p className="text-[17px] font-medium">{e.venue}</p>
            {e.address && <p className="mt-1 text-[14px] opacity-75">{e.address}</p>}
            {e.dressCode && <p className="mt-4 text-[13px] uppercase tracking-[0.14em] opacity-80">Dress code: {e.dressCode}</p>}
            {e.colours && e.colours.length > 0 && (
              <div className="mt-3 flex gap-2" aria-label="Colours of the day">
                {e.colours.map((c) => (
                  <span key={c} className="h-5 w-5 rounded-full border" style={{ background: c, ...hairline }} />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Band>
  );
}

/* ---------- Location ---------- */

const RIDES: Record<RideApp, { label: string; bg: string; fg: string; href: (address: string) => string; note?: string }> = {
  // Uber can open with the venue as the drop-off
  uber: { label: "Uber", bg: "#000000", fg: "#FFFFFF", href: (a) => `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(a)}` },
  // Bolt and inDrive have no public link that sets a destination, so these open the app/site; guests paste the copied address
  bolt: { label: "Bolt", bg: "#34D186", fg: "#0B2A17", href: () => "https://bolt.eu/", note: "Copy the venue address, then paste it in Bolt" },
  indrive: { label: "inDrive", bg: "#C1F11D", fg: "#141414", href: () => "https://indrive.com/", note: "Copy the venue address, then paste it in inDrive" },
};

export function Location({ section }: { section: LocationSection }) {
  const { pick } = useSite();
  const [copied, setCopied] = useState(false);
  const query = encodeURIComponent(section.mapQuery ?? section.address);
  const fullAddress = `${section.venue}, ${section.address}`;
  const buttonClass = `inline-flex items-center justify-center rounded-[3px] py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-90 ${pick("px-6 min-w-[150px]", "px-4 flex-1 min-w-[120px]")}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is shown above */
    }
  };

  return (
    <Band id={section.id}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      <div className={pick("mx-auto max-w-[760px]", "")}>
        <iframe
          title={`Map of ${section.venue}`}
          src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
          loading="lazy"
          className={`w-full rounded-[3px] border-0 ${pick("h-[360px]", "h-[240px]")}`}
        />
        <p className="mt-4 flex items-start justify-center gap-2 text-center text-[15px] opacity-80">
          <MapPin size={16} className="mt-1 shrink-0" style={{ color: "var(--t-primary)" }} aria-hidden />
          <span>
            <span style={font.heading}>{section.venue}</span>, {section.address}
          </span>
        </p>
        {section.notes && section.notes.length > 0 && (
          <ul className="mt-3 flex flex-col items-center gap-1 text-center text-[14px] opacity-75">
            {section.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}

        <div className={`mt-6 flex flex-wrap justify-center ${pick("gap-4", "gap-2")}`}>
          <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer" style={primaryButton} className={buttonClass}>
            Open map
          </a>
          {(section.rides ?? []).map((r) => {
            const ride = RIDES[r];
            return (
              <a key={r} href={ride.href(fullAddress)} target="_blank" rel="noreferrer" title={ride.note} style={{ background: ride.bg, color: ride.fg }} className={buttonClass}>
                {ride.label}
              </a>
            );
          })}
        </div>
        <p className="mt-5 text-center">
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-70 hover:opacity-100">
            {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
            <span aria-live="polite">{copied ? "Address copied" : "Copy venue address"}</span>
          </button>
        </p>
      </div>
    </Band>
  );
}

/* ---------- Gallery ---------- */

const GALLERY_COLS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

export function Gallery({ section }: { section: GallerySection }) {
  const { pick } = useSite();
  return (
    <Band id={section.id} style={surfaceBand}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      <div className={`grid ${pick(`${GALLERY_COLS[section.columns ?? 4]} gap-3`, "grid-cols-2 gap-2")}`}>
        {section.images.map((src, i) => (
          <img key={`${src}-${i}`} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-md object-cover" />
        ))}
      </div>
    </Band>
  );
}

/* ---------- Wishlist ---------- */

export function Wishlist({ section }: { section: WishlistSection }) {
  const { pick } = useSite();
  return (
    <Band id={section.id}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      <div className={`grid ${pick("grid-cols-4 gap-5", "grid-cols-2 gap-3")}`}>
        {section.items.map((item) => (
          <article key={item.name} className="flex flex-col overflow-hidden rounded-lg border" style={{ ...surfaceBand, ...hairline }}>
            {item.image ? (
              <img src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
            ) : (
              <div
                aria-hidden
                className="flex aspect-square items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--t-primary) 12%, transparent)", color: "var(--t-primary)" }}
              >
                <Gift size={36} strokeWidth={1.25} />
              </div>
            )}
            <div className="flex flex-1 flex-col p-3">
              <p className="text-[15px] font-medium leading-5">{item.name}</p>
              <p className="mt-1 text-[14px] opacity-75">{naira(item.price)}</p>
              <span style={primaryButton} className="mt-3 rounded-md py-2 text-center text-[12px] font-medium uppercase tracking-[0.12em]">
                Gift this
              </span>
            </div>
          </article>
        ))}
      </div>
    </Band>
  );
}

/* ---------- Cash gifts ---------- */

export function Gifts({ section }: { section: GiftsSection }) {
  const { pick } = useSite();
  return (
    <Band id={section.id} style={surfaceBand}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      <div className={`mx-auto grid max-w-[760px] gap-4 ${pick(section.accounts.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-[380px]", "grid-cols-1")}`}>
        {section.accounts.map((a) => (
          <article key={a.value} className="rounded-lg border p-5 text-center" style={hairline}>
            <p style={font.heading} className="text-[15px] uppercase tracking-[0.14em]">
              {a.provider}
            </p>
            {a.note && <p className="mt-1 text-[13px] opacity-70">{a.note}</p>}
            <div className="mt-3 flex items-center justify-center gap-2">
              <p className="break-all text-[18px] font-semibold">{a.value}</p>
              <CopyButton value={a.value} label={`${a.provider} details`} />
            </div>
            {a.accountName && <p className="mt-1 text-[14px] opacity-75">{a.accountName}</p>}
          </article>
        ))}
      </div>
    </Band>
  );
}

/* ---------- RSVP ---------- */

export function Rsvp({ section }: { section: RsvpSection }) {
  const { pick } = useSite();
  return (
    <Band id={section.id}>
      <Heading heading={section.heading} subheading={section.subheading} eyebrow={section.eyebrow} />
      {section.deadline && <p className="-mt-4 mb-8 text-center text-[16px] opacity-80">Kindly respond by {formatDate(section.deadline)}</p>}
      <div className={`mx-auto flex max-w-[640px] justify-center gap-4 ${pick("flex-row", "flex-col")}`}>
        {section.contacts.map((c) => (
          <a
            key={c.phone}
            href={`tel:${c.phone.replace(/\s+/g, "")}`}
            className="flex flex-1 items-center gap-3 rounded-lg border px-5 py-4 transition-opacity hover:opacity-80"
            style={hairline}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={primaryButton}>
              <Phone size={16} />
            </span>
            <span>
              <span className="block text-[16px] font-medium">{c.name}</span>
              <span className="block text-[14px] opacity-75">{c.phone}</span>
            </span>
          </a>
        ))}
      </div>
    </Band>
  );
}

/* ---------- Quote ---------- */

export function Quote({ section }: { section: QuoteSection }) {
  const { pick } = useSite();
  const body = (
    <figure className="mx-auto max-w-[720px] text-center">
      <blockquote style={font.heading} className={`italic leading-snug ${pick("text-[34px]", "text-[24px]")}`}>
        “{section.text}”
      </blockquote>
      {section.attribution && <figcaption className="mt-4 text-[13px] uppercase tracking-[0.2em] opacity-80">{section.attribution}</figcaption>}
    </figure>
  );

  if (!section.image) {
    return (
      <Band id={section.id} style={surfaceBand}>
        {body}
      </Band>
    );
  }
  return (
    <section id={sectionDomId(section.id)} className={`relative overflow-hidden text-white ${pick("px-16 py-28", "px-5 py-20")}`}>
      <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative">{body}</div>
    </section>
  );
}

/* ---------- Footer ---------- */

export function Footer({ section }: { section: FooterSection }) {
  const { couple, pick } = useSite();
  return (
    <footer id={sectionDomId(section.id)} className={`relative overflow-hidden text-center ${pick("px-16 py-24", "px-5 py-16")}`} style={onPrimaryBand}>
      {section.image && (
        <>
          <img src={section.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "color-mix(in srgb, var(--t-primary) 70%, transparent)" }} />
        </>
      )}
      <div className="relative">
        <p style={font.script} className={`leading-none ${pick("text-[80px]", "text-[52px]")}`}>
          {couple.partnerOne} &amp; {couple.partnerTwo}
        </p>
        <p style={font.heading} className="mt-5 text-[13px] uppercase tracking-[0.28em]">
          {formatDate(couple.date)}
        </p>
        {section.message && <p className="mx-auto mt-4 max-w-[420px] text-[17px] italic opacity-90">{section.message}</p>}
        {couple.hashtag && <p className="mt-4 text-[15px] font-medium">{couple.hashtag}</p>}
        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] opacity-60">Made with canto</p>
      </div>
    </footer>
  );
}
