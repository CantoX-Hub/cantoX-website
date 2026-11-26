"use client";

import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import { CalendarCheck2 } from "lucide-react";
import { useConnectGoogleCalendarMutation, useDisconnectGoogleCalendarMutation, useGetGoogleCalendarStatusQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import { useToast } from "../Toast";

/**
 * Same Google Calendar connection as the Calendar page.
 * TODO(backend): Connect becomes a redirect to GOOGLE_CALENDAR_CONNECT_URL (see services/api.ts).
 */
export default function CalendarBanner() {
  const notify = useToast();
  const { data: status } = useGetGoogleCalendarStatusQuery();
  const [connectGoogle, { isLoading: busy }] = useConnectGoogleCalendarMutation();
  const [disconnectGoogle] = useDisconnectGoogleCalendarMutation();
  const connected = !!status?.connected;

  const connect = async () => {
    try {
      await connectGoogle().unwrap();
      notify("Google Calendar connected");
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  const disconnect = async () => {
    try {
      await disconnectGoogle().unwrap();
      notify("Google Calendar disconnected", { severity: "info" });
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-[#060D18] px-5 py-6 sm:px-8 sm:py-7">
      <BannerRibbons />
      <div className="relative z-10 max-w-[560px]">
        {connected ? (
          <>
            <div className="flex items-center gap-2">
              <CalendarCheck2 size={20} className="text-[#C99532]" />
              <h2 className="text-[20px] text-white sm:text-[22px]">Your Google Calendar is connected</h2>
            </div>
            <p className="mt-1.5 text-[14px] text-white/60">
              Choose which dates to sync from your{" "}
              <Link href="/dashboard/calendar" className="text-white underline">
                calendar
              </Link>
              .
            </p>
            <Button onClick={disconnect} size="small" sx={{ mt: 2, color: "rgba(255,255,255,0.75)", px: 0, "&:hover": { color: "#fff", bgcolor: "transparent" } }}>
              Disconnect
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <h2 className="text-[20px] text-white sm:text-[22px]">Connect your calendar with Google</h2>
              <Button
                variant="contained"
                onClick={connect}
                disabled={busy}
                startIcon={busy ? <CircularProgress size={14} color="inherit" /> : undefined}
                sx={{ "&.Mui-disabled": { bgcolor: "#8E6A24", color: "#fff" } }}
              >
                {busy ? "Connecting…" : "Connect"}
              </Button>
            </div>
            <p className="mt-2 text-[14px] text-white/60">Your schedules stay in one place once connected.</p>
          </>
        )}
      </div>
    </section>
  );
}

/** Same textured gold ribbons as the onboarding background */
function BannerRibbons() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-y-0 right-0 h-full w-[70%] opacity-35 sm:w-[55%] sm:opacity-100" viewBox="0 0 600 160" preserveAspectRatio="xMaxYMid slice" fill="none">
      <defs>
        <filter id="banner-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3" result="a" />
          <feColorMatrix in="a" type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.28  0 0 0 0 0.08  0 0 0 9 -4.4" result="dark" />
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" result="b" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.70  0 0 0 0 0.40  0 0 0 9 -6.2" result="light" />
          <feMerge result="specks">
            <feMergeNode in="dark" />
            <feMergeNode in="light" />
          </feMerge>
          <feComposite in="specks" in2="SourceGraphic" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
        <linearGradient id="banner-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="banner-mask">
          <rect width="600" height="160" fill="url(#banner-fade)" />
        </mask>
      </defs>
      <g filter="url(#banner-grain)" mask="url(#banner-mask)">
        <path d="M 250 190 C 330 110, 400 40, 470 -30" stroke="#C99532" strokeWidth="26" strokeLinecap="round" />
        <path d="M 380 200 C 450 120, 520 60, 640 10" stroke="#C99532" strokeWidth="26" strokeLinecap="round" />
        <path d="M 470 -20 C 520 40, 560 90, 640 120" stroke="#C99532" strokeWidth="18" strokeLinecap="round" opacity="0.85" />
      </g>
    </svg>
  );
}
