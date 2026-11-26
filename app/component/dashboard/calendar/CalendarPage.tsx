"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, MenuItem, Skeleton, Tab, Tabs, TextField } from "@mui/material";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import {
  useConnectGoogleCalendarMutation,
  useDeleteCalendarEventMutation,
  useDisconnectGoogleCalendarMutation,
  useGetCalendarEventsQuery,
  useGetGoogleCalendarStatusQuery,
  useRestoreCalendarEventMutation,
  useSetCalendarEventSyncedMutation,
} from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { CalendarCategory, CalendarEvent } from "@/app/types/calendar.types";
import { useToast } from "../Toast";
import { PageTitle } from "../ui";
import EventPanel from "./EventPanel";
import {
  AgendaCard,
  CATEGORIES,
  CATEGORY_META,
  EventCard,
  EventDot,
  EventPill,
  WEEKDAYS,
  addDays,
  addMonths,
  formatLong,
  fromKey,
  monthGrid,
  startOfWeek,
  toKey,
  type EventActions,
} from "./shared";

type View = "agenda" | "week" | "month";
type Filter = "all" | CalendarCategory;
const PILLS_PER_DAY = 3;
const AGENDA_MONTHS = 3;
const heading = { fontFamily: '"Cal Sans", "DM Sans", sans-serif' };

const navButton =
  "flex h-10 w-12 items-center justify-center rounded-md border border-[#D1D5DB] bg-white text-[#0F0F0F] hover:bg-[#F8F9FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]";

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search for event[s]"
      size="small"
      fullWidth
      slotProps={{
        htmlInput: { "aria-label": "Search events" },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={16} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

function DayHeading({ date, label = "Events on this day" }: { date: Date; label?: string }) {
  return (
    <div className="mt-4">
      <p className="text-[14px] text-[#4B5563]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#0F0F0F]">{formatLong(date)}</p>
    </div>
  );
}

function EmptyDay() {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <Image src="/empty-template.svg" alt="" width={110} height={110} className="h-[110px] w-auto" />
      <p className="mt-4 text-[16px] text-[#0F0F0F]" style={heading}>
        It&apos;s empty here
      </p>
      <p className="mt-1 max-w-[260px] text-[13px] text-[#4B5563]">
        You don&apos;t have any events on this day. Use <span className="text-[#C99532]">&ldquo;Add event on this day&rdquo;</span> to get started.
      </p>
    </div>
  );
}

export default function CalendarPage() {
  const notify = useToast();
  const { data: events = [], isLoading, error, refetch } = useGetCalendarEventsQuery();
  const { data: google } = useGetGoogleCalendarStatusQuery();
  const [setSynced] = useSetCalendarEventSyncedMutation();
  const [deleteEvent] = useDeleteCalendarEventMutation();
  const [restoreEvent] = useRestoreCalendarEventMutation();
  const [connectGoogle, { isLoading: connecting }] = useConnectGoogleCalendarMutation();
  const [disconnectGoogle] = useDisconnectGoogleCalendarMutation();

  const [view, setView] = useState<View>("month");
  const [selected, setSelected] = useState(() => new Date());
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [panel, setPanel] = useState<{ open: boolean; event?: CalendarEvent }>({ open: false });
  const [busyId, setBusyId] = useState<string | null>(null);
  /** Set when the user tried to sync before connecting; synced right after connecting */
  const [connectPrompt, setConnectPrompt] = useState<{ open: boolean; pending?: CalendarEvent }>({ open: false });

  const connected = !!google?.connected;
  const selectedKey = toKey(selected);
  const todayKey = toKey(new Date());

  const visible = useMemo(() => events.filter((e) => filter === "all" || e.category === filter), [events, filter]);
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of visible) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, [visible]);
  const locations = useMemo(() => Array.from(new Set(events.map((e) => e.location).filter(Boolean))).sort(), [events]);

  const q = query.trim().toLowerCase();
  const matches = (e: CalendarEvent) => !q || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.notes?.toLowerCase().includes(q);

  /* ---------- Navigation ---------- */

  const step = (dir: 1 | -1) => setSelected((d) => (view === "week" ? addDays(d, 7 * dir) : addMonths(d, dir)));
  const stepLabel = view === "week" ? "week" : "month";

  /* ---------- Actions ---------- */

  const sync = async (e: CalendarEvent, synced: boolean) => {
    setBusyId(e.id);
    try {
      await setSynced({ id: e.id, synced }).unwrap();
      notify(synced ? `“${e.title}” added to your Google Calendar` : `“${e.title}” removed from your Google Calendar`, {
        severity: synced ? "success" : "info",
        ...(synced ? {} : { actionLabel: "Undo", onAction: () => setSynced({ id: e.id, synced: true }) }),
      });
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const actions: EventActions = {
    busyId,
    onEdit: (e) => setPanel({ open: true, event: e }),
    onToggleSync: (e) => {
      if (!connected) return setConnectPrompt({ open: true, pending: e });
      sync(e, !e.googleEventId);
    },
    onDelete: async (e) => {
      try {
        await deleteEvent(e.id).unwrap();
        notify(`Deleted “${e.title}”${e.googleEventId ? " (also from Google Calendar)" : ""}`, { severity: "info", actionLabel: "Undo", onAction: () => restoreEvent(e) });
      } catch (err) {
        notify(getErrorMessage(err), { severity: "error" });
      }
    },
  };

  /**
   * TODO(backend): replace with `window.location.href = GOOGLE_CALENDAR_CONNECT_URL`.
   * Google's consent screen redirects back to /dashboard/calendar when done.
   */
  const connect = async () => {
    try {
      await connectGoogle().unwrap();
      const pending = connectPrompt.pending;
      setConnectPrompt({ open: false });
      if (pending) await sync(pending, true);
      else notify("Google Calendar connected");
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  const disconnect = async () => {
    try {
      await disconnectGoogle().unwrap();
      notify("Google Calendar disconnected. Events already copied there stay on it.", { severity: "info" });
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  /* ---------- Views ---------- */

  const pills = (dayEvents: CalendarEvent[], date: Date, limit = PILLS_PER_DAY) => (
    <>
      <div className="mt-2 hidden flex-col gap-1.5 md:flex">
        {dayEvents.slice(0, limit).map((e) => (
          <EventPill key={e.id} event={e} onClick={() => setSelected(date)} />
        ))}
        {dayEvents.length > limit && <span className="px-1 text-[12px] text-[#6B7280]">+{dayEvents.length - limit} more</span>}
      </div>
      {dayEvents.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1 md:hidden">
          {dayEvents.slice(0, 4).map((e) => (
            <EventDot key={e.id} event={e} />
          ))}
        </div>
      )}
    </>
  );

  const dayButton = (date: Date, big = false) => {
    const key = toKey(date);
    const count = byDay.get(key)?.length ?? 0;
    return (
      <button
        type="button"
        onClick={() => setSelected(date)}
        aria-pressed={key === selectedKey}
        aria-current={key === todayKey ? "date" : undefined}
        aria-label={`${formatLong(date)}, ${count} ${count === 1 ? "event" : "events"}`}
        className={`rounded font-semibold leading-none after:absolute after:inset-0 after:content-[''] focus-visible:outline-none ${big ? "text-[28px]" : "text-[13px]"} ${
          key === todayKey ? "text-[#C99532]" : "text-[#0F0F0F]"
        }`}
        style={big ? heading : undefined}
      >
        {String(date.getDate()).padStart(2, "0")}
      </button>
    );
  };

  const cellClass = (key: string, outside = false) =>
    `relative rounded-md bg-[#F8F9FB] p-2 transition-shadow focus-within:ring-2 focus-within:ring-[#C99532] ${key === selectedKey ? "ring-2 ring-[#C99532]" : ""} ${outside ? "opacity-50" : ""}`;

  const weekdayHeader = (
    <div className="grid grid-cols-7 gap-1 sm:gap-2" aria-hidden>
      {WEEKDAYS.map((d) => (
        <div key={d} className="rounded-md border border-[#F0F1F4] bg-white py-3 text-center text-[12px] font-semibold text-[#0F0F0F] sm:py-4 sm:text-[14px]">
          {d}
        </div>
      ))}
    </div>
  );

  const monthView = (
    <div>
      {weekdayHeader}
      <div className="mt-1 grid grid-cols-7 gap-1 sm:mt-2 sm:gap-2">
        {monthGrid(selected).map((date) => {
          const key = toKey(date);
          const outside = date.getMonth() !== selected.getMonth();
          return (
            <div key={key} className={`${cellClass(key, outside)} min-h-[64px] md:min-h-[136px]`}>
              {dayButton(date)}
              {/* Pills sit above the stretched day button so they stay clickable */}
              <div className="relative">{!outside && pills(byDay.get(key) ?? [], date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const weekView = (
    <div>
      {weekdayHeader}
      <div className="mt-1 grid grid-cols-7 gap-1 sm:mt-2 sm:gap-2">
        {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selected), i)).map((date) => {
          const key = toKey(date);
          return (
            <div key={key} className={`${cellClass(key)} min-h-[280px] md:min-h-[640px]`}>
              {dayButton(date, true)}
              <div className="relative mt-4">{pills(byDay.get(key) ?? [], date, 12)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const dayPanel = (() => {
    const list = q ? visible.filter(matches) : (byDay.get(selectedKey) ?? []);
    return (
      <aside className="h-fit rounded-lg border border-[#E2E5EA] p-2" aria-label="Events on the selected day">
        <SearchBox value={query} onChange={setQuery} />
        {q ? (
          <p className="mt-4 text-[14px] text-[#4B5563]" aria-live="polite">
            {list.length} {list.length === 1 ? "event matches" : "events match"} “{query.trim()}”
          </p>
        ) : (
          <DayHeading date={selected} />
        )}
        {list.length === 0 ? (
          q ? null : <EmptyDay />
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {list.map((e) => (
              <div key={e.id}>
                {q && <p className="mb-1 text-[12px] text-[#6B7280]">{formatLong(fromKey(e.date))}</p>}
                <EventCard event={e} {...actions} />
              </div>
            ))}
          </div>
        )}
        <Button fullWidth variant="contained" startIcon={<Plus size={16} />} onClick={() => setPanel({ open: true })} sx={{ mt: 2, py: 1.1, fontWeight: 600 }}>
          Add event on this day
        </Button>
      </aside>
    );
  })();

  const agendaView = (() => {
    const end = toKey(addMonths(selected, AGENDA_MONTHS));
    const list = visible.filter((e) => e.date >= selectedKey && e.date < end).filter((e) => location === "all" || e.location === location).filter(matches);
    const days = Array.from(new Set(list.map((e) => e.date)));
    return (
      <section className="rounded-lg border border-[#E2E5EA] p-2" aria-label="Agenda">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SearchBox value={query} onChange={setQuery} />
          <TextField select size="small" value={location} onChange={(e) => setLocation(e.target.value)} slotProps={{ htmlInput: { "aria-label": "Filter by location" } }}>
            <MenuItem value="all">All locations</MenuItem>
            {locations.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {days.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[15px] font-semibold text-[#0F0F0F]">Nothing coming up</p>
            <p className="mt-1 text-[13px] text-[#6B7280]">No events from {formatLong(selected)} over the next {AGENDA_MONTHS} months match.</p>
          </div>
        ) : (
          days.map((d) => (
            <div key={d}>
              <DayHeading date={fromKey(d)} />
              <div className="mt-2 flex flex-col gap-2">
                {list
                  .filter((e) => e.date === d)
                  .map((e) => (
                    <AgendaCard key={e.id} event={e} {...actions} />
                  ))}
              </div>
            </div>
          ))
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setPanel({ open: true })} sx={{ fontWeight: 600 }}>
            Add event
          </Button>
        </div>
      </section>
    );
  })();

  /* ---------- Page ---------- */

  return (
    <>
      <PageTitle>Calendar</PageTitle>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" className={navButton} onClick={() => step(-1)} aria-label={`Previous ${stepLabel}`}>
            <ChevronLeft size={18} />
          </button>
          <p className="min-w-[200px] text-center text-[14px] font-semibold text-[#0F0F0F]" aria-live="polite">
            {formatLong(selected)}
          </p>
          <button type="button" className={navButton} onClick={() => step(1)} aria-label={`Next ${stepLabel}`}>
            <ChevronRight size={18} />
          </button>
          {selectedKey !== todayKey && (
            <button type="button" onClick={() => setSelected(new Date())} className="rounded text-[13px] font-medium text-[#C99532] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
              Today
            </button>
          )}
        </div>
        <div className="flex gap-2" role="group" aria-label="Calendar view">
          {(["agenda", "week", "month"] as View[]).map((v) => (
            <Button
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              variant={view === v ? "contained" : "outlined"}
              color={view === v ? "primary" : "inherit"}
              sx={{ textTransform: "capitalize", fontWeight: 600, px: 2, py: 1, ...(view === v ? {} : { borderColor: "#D1D5DB", bgcolor: "#fff" }) }}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>

      {/* Google Calendar connection */}
      <p className="mt-3 text-[13px] text-[#4B5563]">
        {connected ? (
          <>
            Syncing with Google Calendar{google?.email ? ` (${google.email})` : ""}.{" "}
            <button type="button" onClick={disconnect} className="font-medium text-[#6B7280] underline hover:text-[#0F0F0F]">
              Disconnect
            </button>
          </>
        ) : (
          <>
            Want these on your phone?{" "}
            <button type="button" onClick={() => setConnectPrompt({ open: true })} className="font-semibold text-[#C99532] hover:underline">
              Connect Google Calendar
            </button>
          </>
        )}
      </p>

      <div className="mt-8 border-b border-[#E2E5EA]">
        <Tabs
          value={filter}
          onChange={(_, v) => setFilter(v)}
          aria-label="Event type"
          variant="scrollable"
          scrollButtons={false}
          sx={{ "& .MuiTabs-indicator": { bgcolor: "#0F0F0F" }, "& .MuiTab-root": { textTransform: "none", fontSize: 15, color: "#6B7280", minHeight: 64, px: 2 }, "& .Mui-selected": { color: "#0F0F0F !important", fontWeight: 600 } }}
        >
          <Tab value="all" label="All" />
          {CATEGORIES.map((c) => (
            <Tab key={c} value={c} label={CATEGORY_META[c].label} />
          ))}
        </Tabs>
      </div>

      <div className="mt-6">
        {error ? (
          <div className="flex flex-col items-center py-14 text-center">
            <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load your calendar.")}</p>
            <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <Skeleton variant="rounded" height={520} aria-label="Loading calendar" />
        ) : view === "agenda" ? (
          agendaView
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_336px]">
            <div className="rounded-lg border border-[#E2E5EA] p-1.5 sm:p-2">{view === "month" ? monthView : weekView}</div>
            {dayPanel}
          </div>
        )}
      </div>

      <EventPanel
        open={panel.open}
        event={panel.event}
        date={selectedKey}
        googleConnected={connected}
        onConnectGoogle={() => setConnectPrompt({ open: true })}
        onClose={() => setPanel((p) => ({ ...p, open: false }))}
      />

      <Dialog open={connectPrompt.open} onClose={() => !connecting && setConnectPrompt({ open: false })} maxWidth="xs" fullWidth>
        <DialogTitle>Connect Google Calendar</DialogTitle>
        <DialogContent>
          <p className="text-[14px] leading-6 text-[#4B5563]">
            {connectPrompt.pending ? `To add “${connectPrompt.pending.title}” to Google Calendar, connect your Google account first. ` : ""}
            Google will ask you to allow canto to add and update the events you choose to sync. We don&apos;t read your other events.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConnectPrompt({ open: false })} color="inherit" disabled={connecting}>
            Not now
          </Button>
          <Button onClick={connect} variant="contained" disabled={connecting} startIcon={connecting ? <CircularProgress size={14} color="inherit" /> : undefined}>
            {connecting ? "Connecting…" : "Connect"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
