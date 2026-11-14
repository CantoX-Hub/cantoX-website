"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Dialog,
  IconButton,
  Rating,
  TextField,
} from "@mui/material";
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  AtSign,
  Mail,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import { VENDORS } from "@/app/data/dashboard";
import type { Vendor, VendorReview } from "@/app/types/dashboard.types";
import { useDashboard } from "../DashboardContext";
import { useToast } from "../Toast";
import { Panel, Stars, VendorImage, naira } from "../ui";
import VendorCard, { useSavedVendors } from "./VendorCard";

const REVIEWS_PAGE = 2;

/** Takes an id (not the object) so it can later read from an RTK Query hook */
export default function VendorDetail({ vendorId }: { vendorId: string }) {
  const vendor = VENDORS.find((v) => v.id === vendorId) ?? VENDORS[0];
  const notify = useToast();
  const { profile, role } = useDashboard();
  const { saved, toggle } = useSavedVendors();
  const isSaved = saved.includes(vendor.id);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [reviews, setReviews] = useState<VendorReview[]>(vendor.reviews);
  const [reviewsShown, setReviewsShown] = useState(REVIEWS_PAGE);
  const [draft, setDraft] = useState("");
  const [draftRating, setDraftRating] = useState<number | null>(null);
  const [reviewError, setReviewError] = useState("");

  const more = VENDORS.filter((v) => v.id !== vendor.id && (v.category === vendor.category || v.verified)).slice(0, 4);
  // Fold reviews written in this session into the stored average
  const added = reviews.filter((r) => r.id.startsWith("local-"));
  const totalReviews = vendor.reviewCount + added.length;
  const avg = (vendor.rating * vendor.reviewCount + added.reduce((s, r) => s + r.rating, 0)) / Math.max(totalReviews, 1);
  const waLink = `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(`Hi ${vendor.name}, I found you on canto and I'd like to make an enquiry.`)}`;
  const mailLink = `mailto:${vendor.email}?subject=${encodeURIComponent("Enquiry from canto")}`;

  const submitReview = () => {
    if (!draftRating) return setReviewError("Choose a star rating before submitting.");
    if (draft.trim().length < 10) return setReviewError("Write at least 10 characters about your experience.");
    // TODO(backend): POST /vendors/:id/reviews
    setReviews((prev) => [
      { id: `local-${Date.now()}`, author: profile.fullName, rating: draftRating, body: draft.trim(), date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setReviewsShown((n) => Math.max(n, REVIEWS_PAGE));
    setDraft("");
    setDraftRating(null);
    setReviewError("");
    notify("Review submitted. Thank you!");
  };

  const handleSave = () => {
    const nowSaved = toggle(vendor.id);
    notify(nowSaved ? `${vendor.name} saved` : `${vendor.name} removed from saved`, { severity: nowSaved ? "success" : "info" });
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] sm:text-[24px]">Vendor</h1>
        <Link href="/dashboard/vendors" className="flex items-center gap-1 text-[14px] text-[#6B7280] hover:text-[#0F0F0F]">
          <ChevronLeft size={16} /> All vendors
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ---------- Profile ---------- */}
        <Panel className="h-fit p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-lg border border-[#F0F0F2]">
              <VendorImage src={vendor.image} alt={`${vendor.name} logo`} category={vendor.category} iconSize={28} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-[20px]">{vendor.name}</h2>
                {vendor.verified && <BadgeCheck size={17} className="shrink-0 text-[#C99532]" aria-label="Verified" />}
              </div>
              <Chip label={vendor.category} size="small" sx={{ mt: 0.75, bgcolor: "#F3F4F6", height: 22, fontSize: 12 }} />
              <div className="mt-1.5 flex items-center gap-1.5">
                <Stars value={Math.round(avg * 2) / 2} />
                <span className="text-[12px] text-[#6B7280]">
                  {avg.toFixed(1)} ({totalReviews})
                </span>
              </div>
            </div>
            {role !== "vendor" && (
              <IconButton onClick={handleSave} aria-pressed={isSaved} aria-label={isSaved ? "Remove from saved" : "Save vendor"} sx={{ border: "1px solid #E8E8EC" }}>
                <Heart size={18} className={isSaved ? "fill-[#E5484D] text-[#E5484D]" : ""} />
              </IconButton>
            )}
          </div>

          <h3 className="mt-5 text-[14px] font-semibold" style={{ fontFamily: "inherit" }}>About</h3>
          <p className="mt-1 text-[14px] leading-6 text-[#4B5563]">{vendor.about}</p>

          {vendor.moq && (
            <div className="mt-4 flex items-center gap-2 text-[14px]">
              <span className="font-semibold">MOQ</span>
              <Chip label={vendor.moq} size="small" sx={{ bgcolor: "#F3F4F6", height: 22, fontSize: 12 }} />
            </div>
          )}

          {!!(vendor.products?.length || vendor.services?.length) && (
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ mt: 2, border: "1px solid #F0F0F2", borderRadius: "8px !important", "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 44, "& .MuiAccordionSummary-content": { my: 1 } }}>
                <span className="text-[14px] font-semibold">{vendor.products ? "Product(s)" : "Service(s)"}</span>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <ol className="space-y-2 text-[14px]">
                  {vendor.products?.map((p, i) => (
                    <li key={p.name} className="flex justify-between gap-3">
                      <span className="text-[#374151]">{i + 1}. {p.name}</span>
                      <span className="shrink-0 font-medium tabular-nums">{naira(p.price)}</span>
                    </li>
                  ))}
                  {vendor.services?.map((s, i) => (
                    <li key={s} className="text-[#374151]">{i + 1}. {s}</li>
                  ))}
                </ol>
              </AccordionDetails>
            </Accordion>
          )}

          <h3 className="mt-5 text-[14px] font-semibold" style={{ fontFamily: "inherit" }}>Contact info</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="contained" href={waLink} target="_blank" rel="noopener noreferrer" startIcon={<MessageCircle size={16} />}>
              WhatsApp
            </Button>
            <Button variant="outlined" color="inherit" href={mailLink} startIcon={<Mail size={16} />} sx={{ borderColor: "#E8E8EC" }}>
              Send mail
            </Button>
          </div>
          <ul className="mt-4 space-y-2 text-[14px] text-[#374151]">
            {vendor.instagram && (
              <li>
                <a href={`https://instagram.com/${vendor.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C99532]">
                  <AtSign size={15} className="text-[#9CA3AF]" /> @{vendor.instagram}
                </a>
              </li>
            )}
            {vendor.website && (
              <li>
                <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C99532]">
                  <Globe size={15} className="text-[#9CA3AF]" /> {vendor.website}
                </a>
              </li>
            )}
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-[#9CA3AF]" /> {vendor.location}
            </li>
          </ul>
        </Panel>

        {/* ---------- Gallery + reviews ---------- */}
        <div className="flex min-w-0 flex-col gap-4">
          <Panel className="p-3">
            <ul className="grid grid-cols-3 gap-2" aria-label="Gallery">
              {vendor.gallery.map((src, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="block aspect-square w-full overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99532]"
                    aria-label={`Open photo ${i + 1} of ${vendor.gallery.length}`}
                  >
                    <VendorImage src={src} alt="" category={vendor.category} variant={i} className="transition-transform duration-300 hover:scale-105" iconSize={24} />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-4 sm:p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[16px]">Reviews &amp; ratings</h2>
              <span className="text-[13px] text-[#6B7280]">{reviews.length} shown</span>
            </div>

            {reviews.length === 0 ? (
              <p className="mt-3 rounded-lg bg-[#F9FAFB] p-4 text-[14px] text-[#6B7280]">No reviews yet. Worked with {vendor.name}? Be the first to review them.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {reviews.slice(0, reviewsShown).map((r) => (
                  <li key={r.id} className="rounded-lg bg-[#F9FAFB] p-3.5">
                    <p className="text-[14px] leading-6 text-[#374151]">{r.body}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[13px] font-medium">{r.author}</span>
                      <span className="flex items-center gap-2">
                        <Stars value={r.rating} />
                        <span className="text-[12px] text-[#9CA3AF]">{new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {reviews.length > REVIEWS_PAGE && (
              <Button
                fullWidth
                color="inherit"
                onClick={() => setReviewsShown((n) => (n >= reviews.length ? REVIEWS_PAGE : n + REVIEWS_PAGE))}
                endIcon={<ChevronDown size={16} className={reviewsShown >= reviews.length ? "rotate-180" : ""} />}
                sx={{ mt: 2, bgcolor: "#F3F4F6", "&:hover": { bgcolor: "#E9EAEE" } }}
              >
                {reviewsShown >= reviews.length ? "Show less" : "See more"}
              </Button>
            )}

            {role !== "vendor" && (
              <form
                className="mt-5 border-t border-[#F0F0F2] pt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitReview();
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="review" className="text-[14px] font-semibold">Write a review</label>
                  <Rating
                    value={draftRating}
                    onChange={(_, v) => {
                      setDraftRating(v);
                      setReviewError("");
                    }}
                    sx={{ color: "#C99532" }}
                    aria-label="Your rating"
                  />
                </div>
                <TextField
                  id="review"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setReviewError("");
                  }}
                  placeholder="Tell other couples what it was like working with them"
                  multiline
                  minRows={3}
                  fullWidth
                  error={!!reviewError}
                  helperText={reviewError || " "}
                  sx={{ mt: 1 }}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ py: 1.25 }}>
                  Submit
                </Button>
              </form>
            )}
          </Panel>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px]">More vendors</h2>
            <Link href="/dashboard/vendors" className="flex items-center gap-1 text-[14px] font-medium text-[#C99532] hover:underline">
              See more <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {more.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </section>
      )}

      <Gallery vendor={vendor} index={lightbox} onChange={setLightbox} />
    </>
  );
}

function Gallery({ vendor, index, onChange }: { vendor: Vendor; index: number | null; onChange: (i: number | null) => void }) {
  const count = vendor.gallery.length;
  const go = (delta: number) => index !== null && onChange((index + delta + count) % count);

  return (
    <Dialog
      open={index !== null}
      onClose={() => onChange(null)}
      maxWidth="md"
      fullWidth
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
          <IconButton onClick={() => onChange(null)} aria-label="Close" sx={{ position: "absolute", right: 12, top: 12, bgcolor: "rgba(0,0,0,0.45)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.65)" } }}>
            <X size={18} />
          </IconButton>
          <IconButton onClick={() => go(-1)} aria-label="Previous photo" sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.45)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.65)" } }}>
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton onClick={() => go(1)} aria-label="Next photo" sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(0,0,0,0.45)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.65)" } }}>
            <ChevronRight size={20} />
          </IconButton>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[12px] text-white tabular-nums">
            {index + 1} / {count}
          </p>
        </div>
      )}
    </Dialog>
  );
}
