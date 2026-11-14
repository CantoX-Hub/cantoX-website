"use client";

import Link from "next/link";
import { CalendarClock, CalendarRange, Loader, type LucideIcon } from "lucide-react";
import { EVENTS } from "@/app/data/dashboard";

export interface Stat {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  /** Icon tile colours */
  tone: { bg: string; fg: string };
  href?: string;
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((s) => {
        const body = (
          <>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-semibold sm:text-[24px] tabular-nums leading-none text-[#0F0F0F]">{s.value}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: s.tone.bg, color: s.tone.fg }}>
                <s.icon size={14} />
              </span>
            </div>
            <p className="mt-3 text-[12px] font-semibold leading-4 text-[#0F0F0F] sm:text-[14px] sm:leading-5">{s.label}</p>
            <p className="mt-0.5 hidden text-[13px] text-[#6B7280] sm:block">{s.hint}</p>
          </>
        );
        const cls = "block rounded-xl border border-[#E8E8EC] bg-white p-3 sm:p-5";
        return s.href ? (
          <Link key={s.label} href={s.href} className={`${cls} transition-colors hover:border-[#D9C08E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]`}>
            {body}
          </Link>
        ) : (
          <div key={s.label} className={cls}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

/** Planner: counts come from the same list the Events page shows */
export function PlannerStats() {
  const ongoing = EVENTS.filter((e) => e.status === "ongoing").length;
  const upcoming = EVENTS.filter((e) => e.status === "upcoming").length;
  return (
    <StatGrid
      stats={[
        { label: "Total events", value: EVENTS.length, hint: "Every event on your account", icon: CalendarRange, tone: { bg: "#ECFDF3", fg: "#16A34A" }, href: "/dashboard/events" },
        { label: "Ongoing events", value: ongoing, hint: "Events in progress right now", icon: Loader, tone: { bg: "#FEF3E2", fg: "#D97706" }, href: "/dashboard/events?status=ongoing" },
        { label: "Upcoming events", value: upcoming, hint: "Events yet to happen", icon: CalendarClock, tone: { bg: "#EAF2FF", fg: "#2563EB" }, href: "/dashboard/events?status=upcoming" },
      ]}
    />
  );
}
