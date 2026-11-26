"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Checkbox, CircularProgress, Dialog, IconButton, InputAdornment, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import { ChevronLeft, PencilLine, Plus, Search, Send, Share2, Trash2, Upload, X } from "lucide-react";
import { useDeleteGuestsMutation, useGetGuestListQuery, useInviteGuestsMutation, useOpenGuestListMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import type { Guest, GuestStatus } from "@/app/types/guest.types";
import { useToast } from "../Toast";
import { EmptyState, Panel } from "../ui";
import GuestListPanel from "./GuestListPanel";
import GuestPanel from "./GuestPanel";
import { CapacityBanner, GuestAvatar, STATUS_META, STATUS_ORDER, StatusChip, TableChip, inviteHref, rsvpPath } from "./shared";

type Filter = "all" | GuestStatus;

const canInvite = (g: Guest) => g.status === "not_invited" || g.status === "declined";

const checkboxSx = { p: 0.5, color: "#C9CED6", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C99532" } };

export default function GuestListDetail({ id }: { id: string }) {
  const notify = useToast();
  const { data: list, isLoading, error } = useGetGuestListQuery(id);
  const [markOpened] = useOpenGuestListMutation();
  const [invite, { isLoading: inviting }] = useInviteGuestsMutation();
  const [deleteGuests, { isLoading: deleting }] = useDeleteGuestsMutation();

  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [guestPanel, setGuestPanel] = useState<{ open: boolean; guest?: Guest }>({ open: false });
  const [listPanel, setListPanel] = useState(false);
  const [toDelete, setToDelete] = useState<Guest | null>(null);

  useEffect(() => {
    if (list) markOpened(id);
    // Once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!list, id]);

  const guests = useMemo(() => list?.guests ?? [], [list]);
  const tableName = (tableId?: string) => list?.tables.find((t) => t.id === tableId)?.name;

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: guests.length, confirmed: 0, pending: 0, declined: 0, not_invited: 0 };
    guests.forEach((g) => c[g.status]++);
    return c;
  }, [guests]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests.filter(
      (g) =>
        (filter === "all" || g.status === filter) &&
        (!q || g.name.toLowerCase().includes(q) || g.contact.toLowerCase().includes(q) || tableName(g.tableId)?.toLowerCase().includes(q))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests, filter, query]);

  // Drop selections that are no longer on screen
  useEffect(() => {
    setSelected((s) => {
      const keep = new Set(Array.from(s).filter((x) => visible.some((g) => g.id === x)));
      return keep.size === s.size ? s : keep;
    });
  }, [visible]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress size={28} aria-label="Loading guest list" />
      </div>
    );
  }
  if (!list) {
    return (
      <Panel className="flex flex-col items-center px-6 py-16 text-center">
        <p className="text-[16px] font-semibold">{hasStatus(error, 404) ? "This guest list doesn't exist" : getErrorMessage(error)}</p>
        <Button component={Link} href="/dashboard/guests" variant="contained" sx={{ mt: 3 }}>
          Back to guests
        </Button>
      </Panel>
    );
  }

  const allChecked = visible.length > 0 && visible.every((g) => selected.has(g.id));
  const someChecked = !allChecked && visible.some((g) => selected.has(g.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(visible.map((g) => g.id)));
  const toggle = (gid: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(gid)) next.delete(gid);
      else next.add(gid);
      return next;
    });

  const invitable = guests.filter((g) => selected.has(g.id) && canInvite(g));

  const sendOne = async (g: Guest) => {
    // Open WhatsApp / Messages / email first: it has to happen on the tap
    window.open(inviteHref(g, list), "_blank", "noopener");
    try {
      await invite({ id, guestIds: [g.id] }).unwrap();
      notify(`${g.name} is marked as invited`);
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  const sendSelected = async () => {
    try {
      await invite({ id, guestIds: invitable.map((g) => g.id) }).unwrap();
      setSelected(new Set());
      // TODO(backend): sending happens server-side; for now this only updates their status
      notify(`${invitable.length} guest${invitable.length === 1 ? "" : "s"} marked as invited. Automatic sending starts once the backend is connected.`, { severity: "info" });
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteGuests({ id, guestIds: [toDelete.id] }).unwrap();
      notify(`${toDelete.name} removed`);
      setToDelete(null);
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${rsvpPath(id)}`;
    try {
      await navigator.clipboard.writeText(url);
      notify("RSVP link copied. Guests use it to confirm or decline.");
    } catch {
      notify(`Copy this RSVP link: ${url}`, { severity: "info" });
    }
  };

  const openAdd = () => setGuestPanel({ open: true });
  const actionSx = { color: "#0F0F0F", "&.Mui-disabled": { color: "#D1D5DB" } };

  return (
    <>
      <Button component={Link} href="/dashboard/guests" startIcon={<ChevronLeft size={16} />} sx={{ bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}>
        Back
      </Button>

      <div className="mb-5 mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1">
          <h1 className="truncate text-[22px] text-[#0F0F0F] sm:text-[24px]">{list.name}</h1>
          <Tooltip title="Edit guest list">
            <IconButton size="small" onClick={() => setListPanel(true)} aria-label="Edit guest list">
              <PencilLine size={17} />
            </IconButton>
          </Tooltip>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button component={Link} href={`/dashboard/guests/${encodeURIComponent(id)}/upload`} variant="outlined" color="inherit" startIcon={<Upload size={16} />} sx={{ borderColor: "#D1D5DB" }}>
            Bulk upload guests
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<Plus size={16} />} onClick={openAdd} sx={{ borderColor: "#D1D5DB" }}>
            Add guest
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Share2 size={16} />} onClick={share}>
            Share
          </Button>
        </div>
      </div>

      <CapacityBanner count={guests.length} capacity={list.expectedGuests} onEdit={() => setListPanel(true)} />

      <div className="mt-6 border-b border-[#E8E8EC]">
        <Tabs value={filter} onChange={(_, v: Filter) => setFilter(v)} variant="scrollable" scrollButtons={false} aria-label="Filter guests by status" sx={{ "& .MuiTabs-indicator": { bgcolor: "#0F0F0F" }, "& .Mui-selected": { color: "#0F0F0F !important", fontWeight: 600 } }}>
          {(["all", ...STATUS_ORDER] as Filter[]).map((f) => (
            <Tab
              key={f}
              value={f}
              label={
                <span className="flex items-center gap-2">
                  {f === "all" ? "All" : STATUS_META[f].label}
                  <span className="rounded-full bg-[#F1F3F6] px-1.5 text-[11px] tabular-nums text-[#374151]">{counts[f]}</span>
                </span>
              }
            />
          ))}
        </Tabs>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <TextField
          size="small"
          placeholder="Search for an guest[s]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: "1 1 260px" }}
          slotProps={{
            htmlInput: { "aria-label": "Search guests" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
          }}
        />
        {invitable.length > 0 && (
          <Button variant="outlined" color="inherit" startIcon={<Send size={15} />} onClick={sendSelected} disabled={inviting} sx={{ borderColor: "#D1D5DB" }}>
            Send invites ({invitable.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F8F9FB] text-[14px] text-[#374151]">
              <th scope="col" className="w-12 px-4 py-4">
                <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} disabled={!visible.length} size="small" sx={checkboxSx} slotProps={{ input: { "aria-label": "Select all guests shown" } }} />
              </th>
              <th scope="col" className="px-2 py-4 font-medium">Guest[s]</th>
              <th scope="col" className="px-2 py-4 font-medium">Contact</th>
              <th scope="col" className="px-2 py-4 font-medium">Table</th>
              <th scope="col" className="px-2 py-4 font-medium">Status</th>
              <th scope="col" className="px-2 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((g) => (
              <tr key={g.id} className={`border-b border-[#E8E8EC] text-[14px] ${selected.has(g.id) ? "bg-[#FFFBF3]" : ""}`}>
                <td className="px-4 py-5">
                  <Checkbox checked={selected.has(g.id)} onChange={() => toggle(g.id)} size="small" sx={checkboxSx} slotProps={{ input: { "aria-label": `Select ${g.name}` } }} />
                </td>
                <td className="px-2 py-5">
                  <span className="flex items-center gap-3">
                    <GuestAvatar name={g.name} />
                    <span className="text-[#0F0F0F]">{g.name}</span>
                  </span>
                </td>
                <td className="px-2 py-5 text-[#0F0F0F]">{g.contact}</td>
                <td className="px-2 py-5">
                  <TableChip name={tableName(g.tableId)} />
                </td>
                <td className="px-2 py-5">
                  <StatusChip status={g.status} />
                </td>
                <td className="px-2 py-5">
                  <span className="flex gap-2">
                    <Tooltip title={canInvite(g) ? `Send invite on ${g.channel === "sms" ? "SMS" : g.channel === "email" ? "email" : "WhatsApp"}` : "Invite already sent"}>
                      <span>
                        <IconButton size="small" disabled={!canInvite(g)} onClick={() => sendOne(g)} aria-label={`Send invite to ${g.name}`} sx={actionSx}>
                          <Send size={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => setGuestPanel({ open: true, guest: g })} aria-label={`Edit ${g.name}`} sx={actionSx}>
                        <PencilLine size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setToDelete(g)} aria-label={`Delete ${g.name}`} sx={{ ...actionSx, "&:hover": { color: "#DC2626" } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {guests.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center">
            <EmptyState
              img="/empty-template.svg"
              title="It’s empty here"
              body={
                <>
                  You don&apos;t have any guests listed.{" "}
                  <button type="button" onClick={openAdd} className="text-[#C99532] underline-offset-2 hover:underline">
                    “Add guests”
                  </button>{" "}
                  to get started.
                </>
              }
            />
          </div>
        ) : (
          visible.length === 0 && <p className="py-14 text-center text-[14px] text-[#6B7280]">{query ? `No guests match “${query}”.` : `No ${STATUS_META[filter as GuestStatus].label.toLowerCase()} guests yet.`}</p>
        )}
      </div>

      <GuestPanel open={guestPanel.open} guest={guestPanel.guest} list={list} onClose={() => setGuestPanel((p) => ({ ...p, open: false }))} />
      <GuestListPanel open={listPanel} list={list} focus="capacity" onClose={() => setListPanel(false)} />

      {/* Delete guest */}
      <Dialog open={!!toDelete} onClose={() => !deleting && setToDelete(null)} maxWidth="xs" fullWidth aria-labelledby="delete-guest-title">
        <div className="flex items-center justify-between border-b border-[#E8E8EC] px-6 py-4">
          <h2 id="delete-guest-title" className="text-[17px] font-semibold">
            Delete guest
          </h2>
          <IconButton size="small" onClick={() => setToDelete(null)} aria-label="Close">
            <X size={18} />
          </IconButton>
        </div>
        <p className="border-b border-[#E8E8EC] px-6 py-5 text-center text-[15px] text-[#0F0F0F]">
          Are you sure you want to delete {toDelete ? <strong>{toDelete.name}</strong> : "this guest"}?
        </p>
        <div className="flex gap-3 px-6 py-4">
          <Button fullWidth variant="outlined" color="inherit" onClick={() => setToDelete(null)} disabled={deleting} sx={{ borderColor: "#D1D5DB" }}>
            Cancel
          </Button>
          <Button fullWidth variant="contained" color="error" onClick={confirmDelete} disabled={deleting} sx={{ bgcolor: "#E10600" }}>
            {deleting ? "Deleting…" : "Delete guest"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
