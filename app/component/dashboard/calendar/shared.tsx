"use client";

import type { CalendarCategory, CalendarEvent } from "@/app/types/calendar.types";

export const CATEGORY_META: Record<CalendarCategory, { label: string; card: string; edge: string; ink: string; pillBg: string; pillInk: string; pillBorder?: string }> = {
  ceremony: { label: "Ceremony", card: "#F7D5EE", edge: "#7A1F5C", ink: "#5E1747", pillBg: "#F9D5EC", pillInk: "#9D2A74" },
  reception: { label: "Reception", card: "#DDD7F6", edge: "#3B2A7A", ink: "#33246B", pillBg: "#DDD6F7", pillInk: "#4C3A99" },
  vendor: { label: "Vendor", card: "#D7EAF7", edge: "#0B3B5C", ink: "#0B3654", pillBg: "#D6EBF7", pillInk: "#0B4F75" },
  task: { label: "Task", card: "#FFFFFF", edge: "#D1D5DB", ink: "#0F2B46", pillBg: "#FFFFFF", pillInk: "#0F0F0F", pillBorder: "#D1D5DB" },
};
export const CATEGORIES: CalendarCategory[] = ["ceremony", "reception", "vendor", "task"];

/* ---------- Dates (all local time, keys are yyyy-mm-dd) ---------- */

const pad = (n: number) => String(n).padStart(2, "0");
export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Same day of month in another month, clamped (31 Jan + 1 month → 28/29 Feb) */
export function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
}
export const startOfWeek = (d: Date) => addDays(d, -d.getDay());

/** 5 or 6 rows of 7 days covering the month, starting on Sunday */
export function monthGrid(d: Date) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(first);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const rows = Math.ceil((first.getDay() + daysInMonth) / 7);
  return Array.from({ length: rows * 7 }, (_, i) => addDays(start, i));
}

export const formatLong = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** "10:00am" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)}${h < 12 ? "am" : "pm"}`;
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

/* ---------- Small pieces ---------- */

export function EventPill({ event, onClick }: { event: CalendarEvent; onClick?: () => void }) {
  const m = CATEGORY_META[event.category];
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${formatTime(event.time)} · ${event.title}`}
      aria-label={`${m.label}: ${event.title}, ${formatTime(event.time)}`}
      className="block w-full truncate rounded-full border px-3 py-1.5 text-left text-[14px] leading-5 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C99532]"
      style={{ background: m.pillBg, color: m.pillInk, borderColor: m.pillBorder ?? "transparent" }}
    >
      {m.label}
    </button>
  );
}

/** Coloured dot used instead of pills on narrow screens */
export function EventDot({ event }: { event: CalendarEvent }) {
  const m = CATEGORY_META[event.category];
  return <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: event.category === "task" ? "#6B7280" : m.edge }} />;
}

export interface EventActions {
  onEdit: (e: CalendarEvent) => void;
  onToggleSync: (e: CalendarEvent) => void;
  onDelete: (e: CalendarEvent) => void;
  busyId?: string | null;
}

function SyncButton({ event, onToggleSync, busy }: { event: CalendarEvent; onToggleSync: (e: CalendarEvent) => void; busy: boolean }) {
  const synced = !!event.googleEventId;
  return (
    <button
      type="button"
      onClick={() => onToggleSync(event)}
      disabled={busy}
      aria-pressed={synced}
      aria-label={synced ? `${event.title} is on your Google Calendar. Remove it from Google Calendar` : `${event.title} is not on Google Calendar. Add it to Google Calendar`}
      title={synced ? "On your Google Calendar. Click to remove it there." : "Click to add to your Google Calendar"}
      className={`whitespace-nowrap rounded-md border px-4 py-2 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99532] disabled:opacity-60 ${
        synced ? "border-[#060D18] bg-[#060D18] text-white hover:bg-[#1B2433]" : "border-[#D1D5DB] bg-white text-[#0F0F0F] hover:bg-[#F8F9FB]"
      }`}
    >
      {busy ? "Syncing…" : synced ? "Google synced" : "Not synced"}
    </button>
  );
}

function DeleteButton({ event, onDelete }: { event: CalendarEvent; onDelete: (e: CalendarEvent) => void }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(event)}
      aria-label={`Delete ${event.title}`}
      className="rounded-md px-3 py-2 text-[14px] font-semibold text-[#0F0F0F] hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
    >
      Delete
    </button>
  );
}

/** Card in the day panel (month / week views) */
export function EventCard({ event, onEdit, onToggleSync, onDelete, busyId }: { event: CalendarEvent } & EventActions) {
  const m = CATEGORY_META[event.category];
  return (
    <article className="rounded-md border-l-[3px] px-3 pb-3 pt-3" style={{ background: m.card, borderLeftColor: m.edge, boxShadow: event.category === "task" ? "inset 0 0 0 1px #E8E8EC" : undefined }}>
      <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-x-2 gap-y-3 text-[14px]" style={{ color: m.ink }}>
        <span>{formatTime(event.time)}</span>
        <h3 className="min-w-0">
          <button type="button" onClick={() => onEdit(event)} className="text-left font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
            {event.title}
          </button>
        </h3>
        <span>{m.label}</span>
        <span className="min-w-0 truncate">{event.location || "No location"}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <SyncButton event={event} onToggleSync={onToggleSync} busy={busyId === event.id} />
        <DeleteButton event={event} onDelete={onDelete} />
      </div>
    </article>
  );
}

/** Wide card in the agenda */
export function AgendaCard({ event, onEdit, onToggleSync, onDelete, busyId }: { event: CalendarEvent } & EventActions) {
  const m = CATEGORY_META[event.category];
  return (
    <article
      className="flex flex-col gap-3 rounded-md border-l-[3px] px-3 py-3 sm:flex-row sm:items-start sm:justify-between"
      style={{ background: m.card, borderLeftColor: m.edge, color: m.ink, boxShadow: event.category === "task" ? "inset 0 0 0 1px #E8E8EC" : undefined }}
    >
      <div className="min-w-0">
        <p className="text-[20px] leading-tight" style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif' }}>
          {formatTime(event.time)}
        </p>
        <h3 className="mt-1 text-[14px] font-semibold">
          <button type="button" onClick={() => onEdit(event)} className="text-left hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
            {event.title}
          </button>
        </h3>
        <p className="mt-4 flex gap-5 text-[14px]">
          <span className="w-[64px] shrink-0">{m.label}</span>
          <span className="min-w-0 truncate">{event.location || "No location"}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SyncButton event={event} onToggleSync={onToggleSync} busy={busyId === event.id} />
        <DeleteButton event={event} onDelete={onDelete} />
      </div>
    </article>
  );
}
