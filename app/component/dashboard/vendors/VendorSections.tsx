"use client";

import { useId, useState } from "react";
import { Button, Dialog, IconButton, Rating } from "@mui/material";
import { ArrowUpRight, AtSign, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, Globe, Instagram, MapPin, X } from "lucide-react";
import { useAddVendorReviewMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { Vendor } from "@/app/types/dashboard.types";
import { useDashboard } from "../DashboardContext";
import { useToast } from "../Toast";
import { VendorImage } from "../ui";

/**
 * Sections of a vendor profile, shared by the "View vendor" side panel and
 * the full vendor page so both stay in step.
 */

export const heading = { fontFamily: '"Cal Sans", "DM Sans", sans-serif' };
const REVIEWS_PAGE = 2;

export function VendorStars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <Rating
      value={value}
      precision={0.5}
      readOnly
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
      sx={{ fontSize: size, color: "#FFB400", "& .MuiRating-iconEmpty": { color: "#FFE3A3" } }}
    />
  );
}

export function CategoryTag({ children }: { children: React.ReactNode }) {
  return <span className="inline-block max-w-full truncate rounded-[3px] bg-[#F1F4F8] px-1 py-px text-[12px] leading-5 text-[#0F0F0F]">{children}</span>;
}

export function ProfileCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#D9DEE5] p-3">
      <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-full border border-[#F0F0F2]">
        <VendorImage src={vendor.image} alt={`${vendor.name} logo`} category={vendor.category} iconSize={28} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-[22px] tracking-[-0.02em] text-[#0F0F0F] sm:text-[24px]" style={heading}>
            {vendor.name}
          </h2>
          {vendor.verified && <BadgeCheck size={17} className="shrink-0 text-[#C99532]" aria-label="Verified vendor" />}
        </div>
        <div className="mt-1">
          <CategoryTag>{vendor.category}</CategoryTag>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <VendorStars value={vendor.rating} />
          <span className="text-[12px] text-[#6B7280]">({vendor.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

function Block({ children, last = false }: { children: React.ReactNode; last?: boolean }) {
  return <section className={`py-4 ${last ? "" : "border-b border-[#E8E8EC]"}`}>{children}</section>;
}

const sectionTitle = "text-[16px] tracking-[-0.01em] text-[#0F0F0F]";

export function AboutBlock({ vendor }: { vendor: Vendor }) {
  return (
    <Block>
      <h3 className={sectionTitle} style={heading}>
        About
      </h3>
      <p className="mt-3 text-[14px] leading-[1.45] text-[#0F0F0F]">{vendor.about}</p>
    </Block>
  );
}

export function MoqBlock({ vendor }: { vendor: Vendor }) {
  if (!vendor.moq) return null;
  return (
    <Block>
      <p className="flex items-center gap-3">
        <span className={sectionTitle} style={heading}>
          MOQ
        </span>
        <CategoryTag>{vendor.moq}</CategoryTag>
      </p>
    </Block>
  );
}

/** Products (with prices) or services, collapsible */
export function OfferingsBlock({ vendor, defaultOpen = true }: { vendor: Vendor; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const listId = useId();
  const products = vendor.products ?? [];
  const services = vendor.services ?? [];
  if (!products.length && !services.length) return null;

  return (
    <Block>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] ${sectionTitle}`}
          style={heading}
        >
          {products.length ? "Product[s]" : "Service[s]"}
          <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </h3>
      {open && (
        <ol id={listId} className="mt-3 space-y-2 text-[14px] text-[#0F0F0F]">
          {products.map((p, i) => (
            <li key={p.name} className="flex justify-between gap-4">
              <span>
                {i + 1}. {p.name}
              </span>
              <span className="shrink-0 font-semibold tabular-nums">₦ {p.price.toLocaleString("en-NG")}</span>
            </li>
          ))}
          {services.map((s, i) => (
            <li key={s}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      )}
    </Block>
  );
}

/** WhatsApp / mail buttons plus Instagram, website and location */
export function ContactBlock({ vendor, layout }: { vendor: Vendor; layout: "inline" | "stacked" }) {
  const wa = `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(`Hi ${vendor.name}, I found you on canto and I'd like to make an enquiry.`)}`;
  const mail = `mailto:${vendor.email}?subject=${encodeURIComponent("Enquiry from canto")}`;
  const link = "flex min-w-0 items-center gap-2 rounded hover:text-[#C99532] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]";

  const items = [
    vendor.instagram && (
      <a key="ig" href={`https://instagram.com/${vendor.instagram}`} target="_blank" rel="noopener noreferrer" className={link} aria-label={`${vendor.name} on Instagram, ${vendor.instagram} (opens in a new tab)`}>
        <Instagram size={16} className="shrink-0" aria-hidden />
        <span className="truncate">{vendor.instagram}</span>
      </a>
    ),
    vendor.website && (
      <a key="web" href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className={link} aria-label={`${vendor.website} (opens in a new tab)`}>
        <Globe size={16} className="shrink-0" aria-hidden />
        <span className="truncate">{vendor.website}</span>
      </a>
    ),
    <span key="loc" className="flex min-w-0 items-center gap-2">
      <MapPin size={16} className="shrink-0" aria-hidden />
      <span className="sr-only">Location: </span>
      <span className="truncate">{vendor.location}</span>
    </span>,
  ].filter(Boolean);

  return (
    <Block last>
      <h3 className={sectionTitle} style={heading}>
        Contact info
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="contained" href={wa} target="_blank" rel="noopener noreferrer" endIcon={<ArrowUpRight size={16} />} sx={{ py: 1.1, fontWeight: 600 }}>
          WhatsApp
        </Button>
        <Button href={mail} endIcon={<ArrowUpRight size={16} />} sx={{ py: 1.1, fontWeight: 600, bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}>
          Send mail
        </Button>
      </div>
      {layout === "inline" ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-[#0F0F0F]">
          {items.map((item, i) => (
            <span key={i} className={`flex min-w-0 items-center ${i > 0 ? "border-l border-[#D1D5DB] pl-3" : ""}`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mt-4 space-y-2.5 text-[14px] text-[#0F0F0F]">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </Block>
  );
}

/** A gallery photo that opens the lightbox */
export function GalleryTile({ vendor, index, onOpen, className = "" }: { vendor: Vendor; index: number; onOpen: (i: number) => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${vendor.gallery.length}`}
      className={`block w-full overflow-hidden rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99532] ${className}`}
    >
      <VendorImage src={vendor.gallery[index]} alt="" category={vendor.category} variant={index} className="transition-transform duration-300 hover:scale-105" iconSize={32} />
    </button>
  );
}

/** Reviews list, See more, and the review form */
export function ReviewsBlock({ vendor }: { vendor: Vendor }) {
  const notify = useToast();
  const { profile, role } = useDashboard();
  const [addReview, { isLoading }] = useAddVendorReviewMutation();
  const [shown, setShown] = useState(REVIEWS_PAGE);
  const [draft, setDraft] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState("");
  const fieldId = useId();
  const reviews = vendor.reviews;
  const all = shown >= reviews.length;

  // Couples review as "Damilola & Tobi", planners by business name
  const author =
    role === "couple" && profile.partnerName
      ? `${profile.fullName.split(" ")[0]} & ${profile.partnerName.split(" ")[0]}`
      : profile.businessName || profile.fullName;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return setError("Write a few words about working with them.");
    if (!rating) return setError("Choose a star rating too.");
    try {
      await addReview({ id: vendor.id, review: { author, rating, body: draft } }).unwrap();
      setDraft("");
      setRating(null);
      setError("");
      setShown((n) => Math.max(n, REVIEWS_PAGE));
      notify("Thanks! Your review is posted.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section>
      <h3 className={sectionTitle} style={heading}>
        Reviews &amp; ratings
      </h3>

      {reviews.length === 0 ? (
        <p className="py-4 text-[14px] text-[#6B7280]">No reviews yet. Worked with {vendor.name}? Be the first to review them.</p>
      ) : (
        <ul>
          {reviews.slice(0, shown).map((r) => (
            <li key={r.id} className="border-b border-[#E8E8EC] py-4">
              <p className="text-[14px] leading-[1.45] text-[#0F0F0F]">{r.body}</p>
              <p className="mt-2 flex items-center gap-2 text-[14px] tracking-[-0.01em] text-[#0F0F0F]" style={heading}>
                <AtSign size={15} aria-hidden />
                {r.author}
                <span className="sr-only">, {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              </p>
              <div className="mt-1">
                <VendorStars value={r.rating} size={16} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {reviews.length > REVIEWS_PAGE && (
        <Button
          fullWidth
          onClick={() => setShown((n) => (all ? REVIEWS_PAGE : n + REVIEWS_PAGE))}
          endIcon={<ChevronDown size={16} className={all ? "rotate-180" : ""} />}
          sx={{ mt: 2, py: 1, fontWeight: 600, bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}
        >
          {all ? "Show less" : "See more"}
        </Button>
      )}

      {role !== "vendor" && (
        <form onSubmit={submit} noValidate className="mt-3">
          <label htmlFor={fieldId} className="sr-only">
            Your review of {vendor.name}
          </label>
          <textarea
            id={fieldId}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError("");
            }}
            maxLength={1000}
            rows={4}
            placeholder="Send a review..."
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className="block w-full resize-y rounded-md border border-[#D1D5DB] bg-white px-3 py-3 text-[14px] text-[#0F0F0F] outline-none placeholder:text-[#6B7280] focus:border-[#C99532] focus:ring-2 focus:ring-[#C99532]/20"
          />
          <div className="mt-2 flex items-center gap-2">
            <span id={`${fieldId}-rating`} className="text-[13px] text-[#4B5563]">
              Your rating
            </span>
            <Rating
              value={rating}
              onChange={(_, v) => {
                setRating(v);
                setError("");
              }}
              aria-labelledby={`${fieldId}-rating`}
              sx={{ color: "#FFB400", fontSize: 22 }}
            />
          </div>
          {error && (
            <p id={`${fieldId}-error`} role="alert" className="mt-1 text-[13px] text-[#D32F2F]">
              {error}
            </p>
          )}
          <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ mt: 1.5, py: 1.1, fontWeight: 600 }}>
            {isLoading ? "Submitting…" : "Submit"}
          </Button>
        </form>
      )}
    </section>
  );
}

/** Full-screen photo viewer with arrow-key navigation */
export function GalleryLightbox({ vendor, index, onChange }: { vendor: Vendor; index: number | null; onChange: (i: number | null) => void }) {
  const count = vendor.gallery.length;
  const go = (delta: number) => index !== null && onChange((index + delta + count) % count);
  const round = { position: "absolute", bgcolor: "rgba(0,0,0,0.45)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.65)" } } as const;

  return (
    <Dialog
      open={index !== null}
      onClose={() => onChange(null)}
      maxWidth="md"
      fullWidth
      aria-label={`${vendor.name} photos`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      slotProps={{ paper: { sx: { bgcolor: "#060D18", overflow: "hidden" } } }}
    >
      {index !== null && (
        <div className="relative">
          <div className="aspect-[4/3] w-full">
            <VendorImage src={vendor.gallery[index]} alt={`${vendor.name} photo ${index + 1}`} category={vendor.category} variant={index} iconSize={72} />
          </div>
          <IconButton onClick={() => onChange(null)} aria-label="Close" sx={{ ...round, right: 12, top: 12 }}>
            <X size={18} />
          </IconButton>
          {count > 1 && (
            <>
              <IconButton onClick={() => go(-1)} aria-label="Previous photo" sx={{ ...round, left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <ChevronLeft size={20} />
              </IconButton>
              <IconButton onClick={() => go(1)} aria-label="Next photo" sx={{ ...round, right: 12, top: "50%", transform: "translateY(-50%)" }}>
                <ChevronRight size={20} />
              </IconButton>
            </>
          )}
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[12px] tabular-nums text-white">
            {index + 1} / {count}
          </p>
        </div>
      )}
    </Dialog>
  );
}
