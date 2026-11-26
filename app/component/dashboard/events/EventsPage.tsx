"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Skeleton, Tab, Tabs, TextField } from "@mui/material";
import { ArrowDown, ArrowUp, CalendarDays, ChevronDown, Hash, MapPin, Search, Users, X } from "lucide-react";
import { useGetEventsQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { EventStatus, EventType, PlannerEvent } from "@/app/types/dashboard.types";
import { PageTitle } from "../ui";

const PAGE = 10;
type StatusTab = "all" | "ongoing" | "upcoming";
const STATUS_TABS: { id: StatusTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ongoing", label: "Ongoing" },
  { id: "upcoming", label: "Upcoming" },
];
const TYPES: ("All" | EventType)[] = ["All", "Wedding website", "Guest", "Wishlist"];

const STATUS_STYLE: Record<EventStatus, { label: string; bg: string; fg: string }> = {
  upcoming: { label: "Upcoming", bg: "#FEF3C7", fg: "#C2410C" },
  ongoing: { label: "Ongoing", bg: "#DCFCE7", fg: "#15803D" },
  done: { label: "Done", bg: "#F1F4F8", fg: "#0F0F0F" },
};

/** Status pill: the label carries the meaning, colour is only a hint */
export function StatusChip({ status }: { status: EventStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[14px] leading-5" style={{ background: s.bg, color: s.fg }}>
      <Hash size={11} strokeWidth={3} aria-hidden />
      {s.label}
    </span>
  );
}

function TypeChip({ type }: { type: EventType }) {
  return <span className="inline-block whitespace-nowrap rounded-full bg-[#F1F4F8] px-3 py-1.5 text-[14px] leading-5 text-[#0F0F0F]">{type}</span>;
}

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};

export default function EventsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const fromUrl = params.get("status");
  const { data: events = [], isLoading, error, refetch } = useGetEventsQuery();

  const [status, setStatus] = useState<StatusTab>(STATUS_TABS.some((t) => t.id === fromUrl) ? (fromUrl as StatusTab) : "all");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<PlannerEvent | null>(null);

  const counts: Record<StatusTab, number> = useMemo(
    () => ({
      all: events.length,
      ongoing: events.filter((e) => e.status === "ongoing").length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
    }),
    [events]
  );

  // TODO(backend): send status, type, search and order as query params
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => status === "all" || e.status === status)
      .filter((e) => type === "All" || e.types.includes(type))
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.couple?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
      .sort((a, b) => (order === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [events, status, type, query, order]);

  const visible = rows.slice(0, shown);

  const changeStatus = (next: StatusTab) => {
    setStatus(next);
    setShown(PAGE);
    router.replace(next === "all" ? "/dashboard/events" : `/dashboard/events?status=${next}`, { scroll: false });
  };

  const clearFilters = () => {
    setQuery("");
    setType("All");
    changeStatus("all");
  };

  let body: React.ReactNode;
  if (error) {
    body = (
      <div className="flex flex-col items-center py-14 text-center">
        <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load your events.")}</p>
        <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
          Try again
        </Button>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div aria-busy="true" aria-label="Loading events">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} height={72} />
        ))}
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <div className="px-5 py-14 text-center">
        <p className="text-[15px] font-semibold">{events.length ? "No events match" : "No events yet"}</p>
        {events.length > 0 && (
          <>
            <p className="mt-1 text-[13px] text-[#6B7280]">Try another search or clear the filters.</p>
            <button type="button" className="mt-3 rounded text-[14px] font-medium text-[#C99532] hover:underline" onClick={clearFilters}>
              Clear filters
            </button>
          </>
        )}
      </div>
    );
  } else {
    body = (
      <>
        {/* Tablet / desktop table */}
        <div className="hidden md:block">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Events. Select an event name to see its details.</caption>
            <thead>
              <tr className="bg-[#F8F9FB] text-[14px] text-[#4B5563]">
                <th scope="col" className="px-4 py-7 font-medium">
                  Event[s]
                </th>
                <th scope="col" className="px-4 py-7 font-medium">
                  Type
                </th>
                <th scope="col" className="px-4 py-7 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-7 font-medium" aria-sort={order === "asc" ? "ascending" : "descending"}>
                  <button
                    type="button"
                    onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
                    className="inline-flex items-center gap-1 rounded hover:text-[#0F0F0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
                  >
                    Date
                    {order === "asc" ? <ArrowUp size={14} aria-hidden /> : <ArrowDown size={14} aria-hidden />}
                    <span className="sr-only">, sorted {order === "asc" ? "oldest first" : "newest first"}</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={e.id} onClick={() => setOpen(e)} className="h-[116px] cursor-pointer border-b border-[#E8E8EC] text-[14px] text-[#0F0F0F] transition-colors hover:bg-[#FAFBFC]">
                  <td className="px-4">
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setOpen(e);
                      }}
                      className="max-w-full truncate rounded text-left hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
                    >
                      {e.name}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex max-w-[160px] flex-wrap gap-1">
                      {e.types.map((t) => (
                        <TypeChip key={t} type={t} />
                      ))}
                    </span>
                  </td>
                  <td className="px-4">
                    <StatusChip status={e.status} />
                  </td>
                  <td className="px-4 tabular-nums">{fmtDate(e.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: cards */}
        <ul className="divide-y divide-[#E8E8EC] border-y border-[#E8E8EC] md:hidden">
          {visible.map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => setOpen(e)} className="flex w-full flex-col gap-2 px-1 py-4 text-left active:bg-[#F9FAFB]">
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="min-w-0 truncate text-[15px] font-medium">{e.name}</span>
                  <StatusChip status={e.status} />
                </span>
                <span className="text-[13px] tabular-nums text-[#6B7280]">{fmtDate(e.date)}</span>
                <span className="flex flex-wrap gap-1">
                  {e.types.map((t) => (
                    <TypeChip key={t} type={t} />
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {rows.length > shown && (
          <Button fullWidth onClick={() => setShown((n) => n + PAGE)} endIcon={<ChevronDown size={16} />} sx={{ mt: 4, py: 1.1, fontWeight: 600, bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}>
            See more
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <div className="pt-4">
        <PageTitle>Events</PageTitle>
      </div>

      <div className="mt-8 border-b border-[#E2E5EA]">
        <Tabs
          value={status}
          onChange={(_, v) => changeStatus(v)}
          aria-label="Event status"
          variant="scrollable"
          scrollButtons={false}
          sx={{ "& .MuiTabs-indicator": { bgcolor: "#0F0F0F", height: 2 }, "& .MuiTab-root": { textTransform: "none", fontSize: 15, color: "#6B7280", minHeight: 64, px: 2 }, "& .Mui-selected": { color: "#0F0F0F !important", fontWeight: 600 } }}
        >
          {STATUS_TABS.map((t) => (
            <Tab
              key={t.id}
              value={t.id}
              label={
                <span className="flex items-center gap-2">
                  {t.label}
                  <span className="rounded-full bg-[#F1F4F8] px-2 py-px text-[11px] font-semibold tabular-nums text-[#0F0F0F]">{counts[t.id]}</span>
                </span>
              }
            />
          ))}
        </Tabs>
      </div>

      <div className="mt-6">
        <TextField
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShown(PAGE);
          }}
          placeholder="Search for an event"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery("")} aria-label="Clear search">
                    <X size={14} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
            htmlInput: { "aria-label": "Search events" },
          }}
        />
        <div className="mt-2 flex flex-wrap gap-2 sm:ml-2" role="group" aria-label="Filter by type">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => {
                setType(t);
                setShown(PAGE);
              }}
              className={`rounded-full border px-3 py-1.5 text-[14px] text-[#0F0F0F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99532] ${
                type === t ? "border-[#C5CBD3] bg-white" : "border-transparent bg-[#F1F4F8] hover:bg-[#E5EAF1]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {isLoading ? "" : `${rows.length} ${rows.length === 1 ? "event" : "events"}`}
      </p>

      <div className="mt-8">{body}</div>

      <Dialog open={!!open} onClose={() => setOpen(null)} fullWidth maxWidth="xs">
        {open && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              <span className="block text-[20px]" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
                {open.name}
              </span>
              <IconButton onClick={() => setOpen(null)} aria-label="Close" sx={{ position: "absolute", right: 12, top: 12 }}>
                <X size={18} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-wrap gap-1.5">
                <StatusChip status={open.status} />
                {open.types.map((t) => (
                  <TypeChip key={t} type={t} />
                ))}
              </div>
              <dl className="mt-4 space-y-3 text-[14px]">
                {open.couple && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Couple</dt>
                    <Users size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" aria-hidden />
                    <dd>{open.couple}</dd>
                  </div>
                )}
                <div className="flex gap-3">
                  <dt className="sr-only">Date</dt>
                  <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" aria-hidden />
                  <dd>{new Date(`${open.date}T00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
                </div>
                {open.location && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Venue</dt>
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" aria-hidden />
                    <dd>{open.location}</dd>
                  </div>
                )}
                {open.guests && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Guests</dt>
                    <Users size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" aria-hidden />
                    <dd>{open.guests} guests expected</dd>
                  </div>
                )}
              </dl>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
