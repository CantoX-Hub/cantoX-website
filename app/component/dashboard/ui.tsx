"use client";

import Link from "next/link";
import { Button, Rating } from "@mui/material";
import {
  Cake,
  Camera,
  Flower2,
  Music,
  Shirt,
  Sparkles,
  Store,
  Tent,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/** White panel used for every dashboard block */
export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[#E8E8EC] bg-white ${className}`}>{children}</section>;
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-[22px] leading-tight text-[#0F0F0F] sm:text-[24px]">{children}</h1>
      {action}
    </div>
  );
}

/** Full-width card footer button, as in the designs */
export function CardAction({
  href,
  onClick,
  children,
  tone = "gold",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: "gold" | "soft";
}) {
  const sx =
    tone === "gold"
      ? { py: 1.25 }
      : { py: 1.25, bgcolor: "#F3F4F6", color: "#0F0F0F", "&:hover": { bgcolor: "#E9EAEE" } };
  return href ? (
    <Button component={Link} href={href} variant="contained" fullWidth sx={sx} color={tone === "gold" ? "primary" : "inherit"}>
      {children}
    </Button>
  ) : (
    <Button onClick={onClick} variant="contained" fullWidth sx={sx} color={tone === "gold" ? "primary" : "inherit"}>
      {children}
    </Button>
  );
}

export function Stars({ value, size = "small", showValue = false }: { value: number; size?: "small" | "medium"; showValue?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Rating value={value} precision={0.5} readOnly size={size} sx={{ color: "#C99532" }} aria-label={`Rated ${value} out of 5`} />
      {showValue && <span className="text-[13px] text-[#6B7280]">{value.toFixed(1)}</span>}
    </span>
  );
}

/* ---------- Generated image tiles (until real vendor photos come from the API) ---------- */

const CATEGORY_STYLE: { match: RegExp; icon: LucideIcon; from: string; to: string }[] = [
  { match: /food|catering/i, icon: UtensilsCrossed, from: "#F6E7C8", to: "#E3B65E" },
  { match: /entertain|dj|music/i, icon: Music, from: "#2A1747", to: "#7C3AED" },
  { match: /photo/i, icon: Camera, from: "#1F2937", to: "#4B5563" },
  { match: /flor|decor/i, icon: Flower2, from: "#FCE7F3", to: "#F472B6" },
  { match: /makeup|beauty/i, icon: Sparkles, from: "#FDE9E1", to: "#E8967A" },
  { match: /fashion|fabric/i, icon: Shirt, from: "#E0ECFF", to: "#5B8DEF" },
  { match: /cake|dessert/i, icon: Cake, from: "#FFF1E6", to: "#F0A868" },
  { match: /rental/i, icon: Tent, from: "#E6F4EA", to: "#4CAF7A" },
];

export function styleForCategory(category: string) {
  return CATEGORY_STYLE.find((s) => s.match.test(category)) ?? { icon: Store, from: "#F3F4F6", to: "#C99532" };
}

/**
 * Shows the image if there is one, otherwise a tile in the vendor's category
 * colours. `variant` shifts the angle so gallery tiles don't look identical.
 */
export function VendorImage({
  src,
  alt,
  category,
  variant = 0,
  className = "",
  iconSize = 32,
}: {
  src?: string;
  alt: string;
  category: string;
  variant?: number;
  className?: string;
  iconSize?: number;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const { icon: Icon, from, to } = styleForCategory(category);
  const angle = 135 + variant * 37;
  const dark = from.startsWith("#1") || from.startsWith("#2");
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }}
    >
      <Icon size={iconSize} strokeWidth={1.25} className={dark ? "text-white/70" : "text-white/90"} style={{ opacity: 0.6 + (variant % 3) * 0.13 }} />
    </div>
  );
}

/** Empty state with the stacked-cards illustration from the designs */
export function EmptyIllustration() {
  return (
    <div aria-hidden className="relative mx-auto h-[92px] w-[110px]">
      <div className="absolute left-3 top-3 h-[70px] w-[84px] rotate-[-8deg] rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]" />
      <div className="absolute right-2 top-1 h-[70px] w-[84px] rotate-[6deg] rounded-lg border border-[#E5E7EB] bg-[#F3F4F6]" />
      <div className="absolute left-[13px] top-[10px] flex h-[72px] w-[84px] flex-col gap-1.5 rounded-lg border border-[#E5E7EB] bg-white p-2.5 shadow-sm">
        <span className="h-1.5 w-10 rounded bg-[#E5E7EB]" />
        <span className="h-1.5 w-14 rounded bg-[#F0F0F2]" />
        <span className="mt-auto flex h-6 w-6 items-center justify-center self-center rounded-full border border-[#E5E7EB] text-[11px] font-semibold text-[#9CA3AF]">0</span>
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
      <EmptyIllustration />
      <p className="mt-4 text-[15px] font-semibold text-[#0F0F0F]">{title}</p>
      <p className="mt-1 max-w-[240px] text-[13px] leading-5 text-[#6B7280]">{body}</p>
    </div>
  );
}

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
