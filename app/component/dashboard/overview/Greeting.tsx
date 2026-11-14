"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Chip, Tooltip } from "@mui/material";
import { BadgeCheck, CalendarDays, Clock3, ShieldAlert } from "lucide-react";
import { planLabel, useDashboard } from "../DashboardContext";

function partOfDay(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Live clock; renders nothing on the server so there is no hydration mismatch */
function useNow(intervalMs = 15_000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

const SUBTITLE = {
  couple: "Today is a great day to plan ahead of your great day.",
  planner: "Today is a great day to plan ahead of your clients' great day.",
  vendor: "Here's how couples and planners are finding your business.",
} as const;

export default function Greeting() {
  const { profile, role } = useDashboard();
  const now = useNow();
  const plan = planLabel(profile.planId, role);
  const heading = role === "couple" ? profile.fullName : profile.businessName ?? profile.fullName;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-[#C99532]" suppressHydrationWarning>
          {now ? partOfDay(now.getHours()) : " "}
        </p>
        <h1 className="mt-1 truncate text-[28px] leading-tight text-[#0F0F0F] sm:text-[32px]">{heading}</h1>
        <p className="mt-1 text-[14px] text-[#6B7280]">{SUBTITLE[role]}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-[#6B7280]">
          <span>Plan:</span>
          <Chip label={plan.label} size="small" sx={{ bgcolor: "#F3F4F6", fontWeight: 600, height: 24 }} />
          {plan.free && (
            <Link href="/pricing" className="font-medium text-[#C99532] underline-offset-2 hover:underline">
              Upgrade
            </Link>
          )}
          {role !== "couple" &&
            (profile.verified ? (
              <Chip
                icon={<BadgeCheck size={14} />}
                label="Verified"
                size="small"
                sx={{ height: 24, bgcolor: "#E8F7EE", color: "#15803D", "& .MuiChip-icon": { color: "#15803D" } }}
              />
            ) : (
              <Tooltip title="We're checking your documents. This usually takes 1–2 working days.">
                <Chip
                  icon={<ShieldAlert size={14} />}
                  label="Verification pending"
                  size="small"
                  sx={{ height: 24, bgcolor: "#FEF3C7", color: "#92400E", "& .MuiChip-icon": { color: "#92400E" } }}
                />
              </Tooltip>
            ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 text-[13px] text-[#4B5563]" aria-live="off">
        <span className="flex items-center gap-1.5">
          <Clock3 size={15} className="text-[#9CA3AF]" />
          <span className="tabular-nums" suppressHydrationWarning>
            {now ? now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
          </span>
          <NigeriaFlag />
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={15} className="text-[#9CA3AF]" />
          <span suppressHydrationWarning>
            {now ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""}
          </span>
        </span>
      </div>
    </div>
  );
}

function NigeriaFlag() {
  return (
    <svg aria-label="Nigeria" role="img" width="18" height="12" viewBox="0 0 3 2" className="rounded-[2px] ring-1 ring-black/5">
      <rect width="1" height="2" fill="#008751" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#008751" />
    </svg>
  );
}
