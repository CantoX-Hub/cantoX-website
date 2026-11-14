"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
} from "@mui/material";
import { CalendarDays, Check, Loader, MapPin, Search, Users, X } from "lucide-react";
import { EVENTS } from "@/app/data/dashboard";
import type { EventStatus, EventType, PlannerEvent } from "@/app/types/dashboard.types";
import { PageTitle, Panel } from "../ui";

const STATUS_TABS: { id: "all" | EventStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ongoing", label: "Ongoing" },
  { id: "upcoming", label: "Upcoming" },
];
const TYPES: ("All" | EventType)[] = ["All", "Wedding website", "Guest", "Wishlist"];

const STATUS_STYLE: Record<EventStatus, { label: string; bg: string; fg: string; icon: React.ReactNode }> = {
  upcoming: { label: "Upcoming", bg: "#FEF3E2", fg: "#B45309", icon: <span className="h-1.5 w-1.5 rounded-full bg-current" /> },
  ongoing: { label: "Ongoing", bg: "#ECFDF3", fg: "#15803D", icon: <Loader size={12} /> },
  done: { label: "Done", bg: "#EEF2FF", fg: "#4338CA", icon: <Check size={12} /> },
};

/** Text label + icon, so status never relies on colour alone */
export function StatusChip({ status }: { status: EventStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: s.bg, color: s.fg }}>
      {s.icon}
      {s.label}
    </span>
  );
}

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};

export default function EventsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialStatus = (params.get("status") as EventStatus | null) ?? "all";

  const [status, setStatus] = useState<"all" | EventStatus>(STATUS_TABS.some((t) => t.id === initialStatus) ? initialStatus : "all");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [open, setOpen] = useState<PlannerEvent | null>(null);

  const counts = useMemo(
    () => ({
      all: EVENTS.length,
      ongoing: EVENTS.filter((e) => e.status === "ongoing").length,
      upcoming: EVENTS.filter((e) => e.status === "upcoming").length,
      done: 0,
    }),
    []
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter((e) => status === "all" || e.status === status)
      .filter((e) => type === "All" || e.type === type)
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
      .sort((a, b) => (order === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [status, type, query, order]);

  const visible = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const changeStatus = (next: "all" | EventStatus) => {
    setStatus(next);
    setPage(0);
    router.replace(next === "all" ? "/dashboard/events" : `/dashboard/events?status=${next}`, { scroll: false });
  };

  return (
    <>
      <PageTitle>Events</PageTitle>
      <Panel className="overflow-hidden">
        <div className="px-4 pt-2 sm:px-5">
          <Tabs value={status} onChange={(_, v) => changeStatus(v)} aria-label="Event status">
            {STATUS_TABS.map((t) => (
              <Tab
                key={t.id}
                value={t.id}
                label={
                  <span className="flex items-center gap-2">
                    {t.label}
                    <span className={`rounded px-1.5 text-[12px] tabular-nums ${status === t.id ? "bg-[#FBF4E6] text-[#A87A22]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{counts[t.id]}</span>
                  </span>
                }
              />
            ))}
          </Tabs>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#F0F0F2] px-4 py-4 sm:px-5">
          <TextField
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
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
            sx={{ maxWidth: { sm: 360 } }}
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
            {TYPES.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                onClick={() => {
                  setType(t);
                  setPage(0);
                }}
                aria-pressed={type === t}
                variant={type === t ? "filled" : "outlined"}
                sx={type === t ? { bgcolor: "#060D18", color: "#fff", "&:hover": { bgcolor: "#1B2433" } } : { borderColor: "#E8E8EC" }}
              />
            ))}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="border-t border-[#F0F0F2] px-5 py-14 text-center">
            <p className="text-[15px] font-semibold">No events match</p>
            <p className="mt-1 text-[13px] text-[#6B7280]">Try another search or clear the filters.</p>
            <button
              type="button"
              className="mt-3 text-[14px] font-medium text-[#C99532] hover:underline"
              onClick={() => {
                setQuery("");
                setType("All");
                changeStatus("all");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table */}
            <TableContainer className="hidden border-t border-[#F0F0F2] md:block">
              <Table aria-label="Events">
                <TableHead>
                  <TableRow sx={{ "& th": { color: "#6B7280", fontSize: 13, fontWeight: 500, bgcolor: "#FAFAFB" } }}>
                    <TableCell>Event(s)</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell sortDirection={order}>
                      <TableSortLabel active direction={order} onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}>
                        Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visible.map((e) => (
                    <TableRow
                      key={e.id}
                      hover
                      tabIndex={0}
                      onClick={() => setOpen(e)}
                      onKeyDown={(k) => (k.key === "Enter" || k.key === " ") && (k.preventDefault(), setOpen(e))}
                      sx={{ cursor: "pointer", "& td": { py: 2.25, fontSize: 14 }, "&:focus-visible": { outline: "2px solid #C99532", outlineOffset: -2 } }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{e.name}</TableCell>
                      <TableCell>
                        <Chip label={e.type} size="small" sx={{ bgcolor: "#F3F4F6", height: 24 }} />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={e.status} />
                      </TableCell>
                      <TableCell sx={{ color: "#4B5563" }} className="tabular-nums">
                        {fmtDate(e.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile cards */}
            <ul className="divide-y divide-[#F0F0F2] border-t border-[#F0F0F2] md:hidden">
              {visible.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => setOpen(e)} className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left active:bg-[#F9FAFB]">
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium">{e.name}</span>
                      <span className="mt-1 block text-[13px] text-[#6B7280]">
                        {e.type}, {fmtDate(e.date)}
                      </span>
                    </span>
                    <StatusChip status={e.status} />
                  </button>
                </li>
              ))}
            </ul>

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[8, 16, 32]}
              sx={{ borderTop: "1px solid #F0F0F2" }}
            />
          </>
        )}
      </Panel>

      <Dialog open={!!open} onClose={() => setOpen(null)} fullWidth maxWidth="xs">
        {open && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              <span className="block text-[20px]" style={{ fontFamily: '"Cal Sans", sans-serif' }}>{open.name}</span>
              <IconButton onClick={() => setOpen(null)} aria-label="Close" sx={{ position: "absolute", right: 12, top: 12 }}>
                <X size={18} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-wrap gap-2">
                <StatusChip status={open.status} />
                <Chip label={open.type} size="small" sx={{ bgcolor: "#F3F4F6", height: 24 }} />
              </div>
              <dl className="mt-4 space-y-3 text-[14px]">
                {open.couple && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Couple</dt>
                    <Users size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                    <dd>{open.couple}</dd>
                  </div>
                )}
                <div className="flex gap-3">
                  <dt className="sr-only">Date</dt>
                  <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                  <dd>{new Date(open.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
                </div>
                {open.location && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Venue</dt>
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                    <dd>{open.location}</dd>
                  </div>
                )}
                {open.guests && (
                  <div className="flex gap-3">
                    <dt className="sr-only">Guests</dt>
                    <Users size={16} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
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
