"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Checkbox, LinearProgress } from "@mui/material";
import { Eye, MessageSquareText, Star } from "lucide-react";
import { OWN_VENDOR_ID, VENDORS, VENDOR_STATS } from "@/app/data/dashboard";
import { CardAction, Panel, Stars } from "../ui";
import { StatGrid } from "./StatCards";

/**
 * There's no design for the vendor dashboard yet. This mirrors the planner
 * layout: stats, the calendar banner, then three working cards.
 */
const own = VENDORS.find((v) => v.id === OWN_VENDOR_ID) ?? VENDORS[0];

export function VendorStats() {
  return (
    <StatGrid
      stats={[
        { label: "Profile views", value: VENDOR_STATS.profileViews.toLocaleString("en-NG"), hint: `Up ${VENDOR_STATS.profileViewsChange}% on last month`, icon: Eye, tone: { bg: "#EAF2FF", fg: "#2563EB" } },
        { label: "Enquiries", value: VENDOR_STATS.enquiries, hint: `${VENDOR_STATS.enquiriesChange} new this week`, icon: MessageSquareText, tone: { bg: "#ECFDF3", fg: "#16A34A" }, href: "/dashboard/enquiries" },
        { label: "Average rating", value: own.rating.toFixed(1), hint: `From ${own.reviewCount} reviews`, icon: Star, tone: { bg: "#FBF4E6", fg: "#C99532" }, href: "/dashboard/reviews" },
      ]}
    />
  );
}

const CHECKLIST = [
  { id: "logo", label: "Upload your logo" },
  { id: "gallery", label: "Add 6 gallery photos" },
  { id: "products", label: "List your products or services" },
  { id: "contact", label: "Add WhatsApp and email" },
  { id: "socials", label: "Link your Instagram" },
];
const CHECK_KEY = "cantox:storefront-checklist";

export function StorefrontChecklist() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      setDone(JSON.parse(window.localStorage.getItem(CHECK_KEY) ?? '["logo","contact"]'));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(CHECK_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  const pct = Math.round((done.length / CHECKLIST.length) * 100);

  return (
    <Panel className="flex min-h-[340px] flex-col p-4">
      <h2 className="text-[16px]">Finish your storefront</h2>
      <p className="mt-0.5 text-[13px] text-[#6B7280]">Complete storefronts get more enquiries.</p>
      <div className="mt-3 flex items-center gap-3">
        <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#F3F4F6" }} aria-label="Storefront completion" />
        <span className="text-[13px] font-semibold tabular-nums">{pct}%</span>
      </div>
      <ul className="mt-2 flex-1">
        {CHECKLIST.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-1 py-0.5 text-[14px]">
              <Checkbox size="small" checked={done.includes(item.id)} onChange={() => toggle(item.id)} sx={{ ml: -1 }} />
              <span className={done.includes(item.id) ? "text-[#9CA3AF] line-through" : ""}>{item.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <CardAction href="/dashboard/storefront">Edit storefront</CardAction>
    </Panel>
  );
}

export function LatestReviews() {
  return (
    <Panel className="flex min-h-[340px] flex-col p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[16px]">Latest reviews</h2>
        <Stars value={own.rating} showValue />
      </div>
      <ul className="mt-3 flex-1 space-y-3">
        {own.reviews.slice(0, 2).map((r) => (
          <li key={r.id} className="rounded-lg bg-[#F9FAFB] p-3">
            <p className="line-clamp-3 text-[13px] leading-5 text-[#374151]">{r.body}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[12px] font-medium">{r.author}</span>
              <Stars value={r.rating} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <CardAction href="/dashboard/reviews" tone="soft">See all reviews</CardAction>
      </div>
    </Panel>
  );
}

export function StorefrontPreview() {
  return (
    <Panel className="flex min-h-[340px] flex-col p-4">
      <h2 className="text-[16px]">Your storefront</h2>
      <p className="mt-0.5 text-[13px] text-[#6B7280]">This is how couples and planners see you.</p>
      <div className="mt-3 flex-1 rounded-lg border border-dashed border-[#E2D3B3] bg-[#FDFAF4] p-4">
        <p className="text-[18px]" style={{ fontFamily: '"Cal Sans", sans-serif' }}>{own.name}</p>
        <p className="text-[13px] text-[#6B7280]">{own.category}</p>
        <p className="mt-2 line-clamp-3 text-[13px] text-[#4B5563]">{own.about}</p>
        <p className="mt-3 text-[12px] text-[#6B7280]">{own.location}</p>
      </div>
      <div className="mt-4">
        <CardAction href={`/dashboard/vendors/${own.id}`}>View as a customer</CardAction>
      </div>
    </Panel>
  );
}
