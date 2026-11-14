"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Checkbox, Chip } from "@mui/material";
import { BadgeCheck } from "lucide-react";
import { SPOTLIGHT_TEMPLATE, VENDORS } from "@/app/data/dashboard";
import { useTodos } from "../useTodos";
import { CardAction, EmptyState, Panel, Stars, VendorImage } from "../ui";

/* ---------- To-do preview ---------- */

export function TodoPreviewCard() {
  const { items, loaded, toggle } = useTodos();
  const open = items.filter((t) => !t.done);

  return (
    <Panel className="flex min-h-[340px] flex-col p-4">
      {loaded && open.length > 0 ? (
        <div className="flex-1">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[16px]">To-do list</h2>
            <span className="text-[13px] text-[#6B7280]">{open.length} open</span>
          </div>
          <ul className="mt-3 divide-y divide-[#F0F0F2]">
            {open.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-1 py-1.5">
                <Checkbox size="small" checked={t.done} onChange={() => toggle(t.id)} slotProps={{ input: { "aria-label": `Mark "${t.title}" as done` } }} sx={{ ml: -1 }} />
                <span className="min-w-0 flex-1 truncate text-[14px]">{t.title}</span>
                {t.due && (
                  <span className="shrink-0 text-[12px] text-[#9CA3AF]">
                    {new Date(t.due).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          title="It's empty here"
          body={
            <>
              You don&apos;t have any upcoming tasks yet. Go to <span className="text-[#C99532]">To-do list</span> to get started.
            </>
          }
        />
      )}
      <div className="mt-4">
        <CardAction href="/dashboard/todo" tone="soft">
          Go to To-do list
        </CardAction>
      </div>
    </Panel>
  );
}

/* ---------- Couple: templates empty state ---------- */

export function TemplatesEmptyCard() {
  return (
    <Panel className="flex min-h-[340px] flex-col p-4">
      <EmptyState
        title="It's empty here"
        body={
          <>
            You don&apos;t have any website templates yet. Go to <span className="text-[#C99532]">Templates</span> to get started.
          </>
        }
      />
      <CardAction href="/dashboard/templates">View templates</CardAction>
    </Panel>
  );
}

/* ---------- Planner: promo ---------- */

export function PromoCard() {
  return (
    <section className="relative min-h-[340px] overflow-hidden rounded-xl bg-[#060D18]">
      {/* Uses the couple photo already in /public from the get-started page */}
      <Image src="/get-started-couple.jpg" alt="" fill loading="eager" sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060D18] via-[#060D18]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[20px] leading-tight text-white" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
          Couples who use canto
        </p>
        <p className="mt-1 text-[13px] text-white/70">Celebrate the moments that change everything.</p>
        <div className="mt-4 flex gap-1.5" aria-hidden>
          <span className="h-1 w-8 rounded-full bg-[#C99532]" />
          <span className="h-1 w-3 rounded-full bg-white/30" />
          <span className="h-1 w-3 rounded-full bg-white/30" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Spotlight: templates and vendors in one card ---------- */

type SpotlightTab = "template" | "vendor";

export function SpotlightCard({ initial }: { initial: SpotlightTab }) {
  const [tab, setTab] = useState<SpotlightTab>(initial);
  const vendor = VENDORS[0];

  const tabBtn = (id: SpotlightTab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={`rounded text-[14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] ${
        tab === id ? "font-semibold text-[#0F0F0F]" : "text-[#9CA3AF] hover:text-[#4B5563]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <Panel className="flex min-h-[340px] flex-col p-4">
      <div role="tablist" aria-label="Spotlight" className="flex gap-4">
        {tabBtn("template", "Template spotlight")}
        {tabBtn("vendor", "Vendor spotlight")}
      </div>

      {tab === "template" ? (
        <div role="tabpanel" className="mt-1 flex flex-1 flex-col">
          <p className="text-[13px] text-[#6B7280]">Get access to our spotlight templates.</p>
          <InvitationPreview names={SPOTLIGHT_TEMPLATE.previewNames} />
          <div className="mt-3 flex items-center justify-between gap-2">
            <h3 className="text-[18px]">{SPOTLIGHT_TEMPLATE.name}</h3>
            <span className="text-[18px]" aria-hidden>👑</span>
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] text-[#6B7280]">{SPOTLIGHT_TEMPLATE.description}</p>
          <div className="mb-4 mt-2">
            <Stars value={SPOTLIGHT_TEMPLATE.rating} />
          </div>
          <div className="mt-auto">
            <CardAction href="/dashboard/templates">Go to Templates</CardAction>
          </div>
        </div>
      ) : (
        <div role="tabpanel" className="mt-1 flex flex-1 flex-col">
          <p className="text-[13px] text-[#6B7280]">Our recommended verified vendors.</p>
          <div className="mt-3 h-[150px] overflow-hidden rounded-lg">
            <VendorImage src={vendor.image} alt={vendor.name} category={vendor.category} iconSize={40} />
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <h3 className="text-[18px]">{vendor.name}</h3>
            {vendor.verified && <BadgeCheck size={16} className="text-[#C99532]" aria-label="Verified" />}
          </div>
          <div className="mt-1.5">
            <Chip label={vendor.category} size="small" sx={{ bgcolor: "#F3F4F6", height: 22, fontSize: 12 }} />
          </div>
          <div className="mb-4 mt-2">
            <Stars value={vendor.rating} />
          </div>
          <div className="mt-auto">
            <CardAction href={`/dashboard/vendors/${vendor.id}`}>View vendor</CardAction>
          </div>
        </div>
      )}
    </Panel>
  );
}

/** A small invitation drawn in CSS so it needs no image file */
function InvitationPreview({ names }: { names: string[] }) {
  return (
    <div className="relative mt-3 flex h-[150px] items-center justify-center overflow-hidden rounded-lg bg-[#F4EBDD]">
      <div aria-hidden className="absolute inset-3 rounded border border-[#C99532]/40" />
      <div className="text-center" style={{ fontFamily: '"Great Vibes", "Brush Script MT", cursive' }}>
        <p className="text-[34px] leading-none text-[#3A2A10]">{names[0]}</p>
        <p className="text-[18px] leading-none text-[#C99532]">&amp;</p>
        <p className="text-[34px] leading-none text-[#3A2A10]">{names[1]}</p>
      </div>
      <Link href="/dashboard/templates" className="absolute inset-0" aria-label="Preview the Gold & Black template" />
    </div>
  );
}
