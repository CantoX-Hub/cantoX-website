"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Menu, MenuItem, Skeleton, TextField } from "@mui/material";
import { ChevronDown, MoreVertical, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useDeleteGuestListMutation, useGetGuestListsQuery, useUpdateGuestListMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { GuestList } from "@/app/types/guest.types";
import { useToast } from "../Toast";
import { PageTitle } from "../ui";
import { longDate } from "../wishlist/shared";
import GuestListPanel from "./GuestListPanel";

const PAGE = 4;
const GRID = "grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const detailHref = (id: string) => `/dashboard/guests/${encodeURIComponent(id)}`;
const heading = { fontFamily: '"Cal Sans", "DM Sans", sans-serif' };

function ListCard({ list, meta, onRename, onEdit, onDelete }: { list: GuestList; meta: string; onRename: () => void; onEdit: () => void; onDelete: () => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const run = (fn: () => void) => () => {
    setAnchor(null);
    fn();
  };
  return (
    <div className="group relative rounded-lg border-2 border-[#E2E5EA] bg-white p-4 transition-shadow focus-within:shadow-[0_8px_24px_rgba(6,13,24,0.07)] hover:shadow-[0_8px_24px_rgba(6,13,24,0.07)]">
      <div aria-hidden className="flex h-[116px] items-center justify-center rounded-md bg-[#F3EAD9]">
        <Image src="/guest-file.svg" alt="" width={64} height={64} />
      </div>
      <h3 className="mt-4 text-[#0F0F0F]">
        <Link href={detailHref(list.id)} className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none group-focus-within:after:outline group-focus-within:after:outline-2 group-focus-within:after:outline-[#C99532]">
          {list.name}
        </Link>
      </h3>
      <div className="mt-1 flex items-center justify-between">
        <p className="text-[13px] text-[#6B7280]">{meta}</p>
        <IconButton size="small" aria-label={`More actions for ${list.name}`} aria-haspopup="menu" onClick={(e) => setAnchor(e.currentTarget)} sx={{ position: "relative", zIndex: 1, mr: -0.5 }}>
          <MoreVertical size={16} />
        </IconButton>
      </div>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { minWidth: 140 } } }}>
        <MenuItem onClick={run(onRename)}>Rename</MenuItem>
        <MenuItem onClick={run(onEdit)}>Edit</MenuItem>
        <MenuItem onClick={run(onDelete)} sx={{ color: "#E10600" }}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default function GuestListsPage() {
  const router = useRouter();
  const notify = useToast();
  const { data: lists = [], isLoading, error, refetch } = useGetGuestListsQuery();
  const [updateList, { isLoading: renaming }] = useUpdateGuestListMutation();
  const [deleteList, { isLoading: deleting }] = useDeleteGuestListMutation();

  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState<{ open: boolean; list?: GuestList }>({ open: false });
  const [renameTarget, setRenameTarget] = useState<GuestList | null>(null);
  const [newName, setNewName] = useState("");
  const [toDelete, setToDelete] = useState<GuestList | null>(null);

  /** Matches list names and the guests inside them */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lists
      .map((l) => ({ list: l, hits: q ? l.guests.filter((g) => g.name.toLowerCase().includes(q)).length : 0 }))
      .filter(({ list, hits }) => !q || hits > 0 || list.name.toLowerCase().includes(q));
  }, [lists, query]);

  const rename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !newName.trim()) return;
    try {
      await updateList({ id: renameTarget.id, input: { name: newName.trim() } }).unwrap();
      notify("Guest list renamed");
      setRenameTarget(null);
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteList(toDelete.id).unwrap();
      notify(`Deleted “${toDelete.name}”`);
      setToDelete(null);
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  let recent: React.ReactNode;
  if (error) {
    recent = (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load your guest lists.")}</p>
        <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
          Try again
        </Button>
      </div>
    );
  } else if (isLoading) {
    recent = (
      <div className={GRID} aria-busy="true" aria-label="Loading guest lists">
        {Array.from({ length: PAGE }, (_, i) => (
          <div key={i} className="rounded-lg border border-[#E2E5EA] p-3">
            <Skeleton variant="rounded" height={116} />
            <Skeleton width="70%" sx={{ mt: 1.5 }} />
            <Skeleton width="50%" />
          </div>
        ))}
      </div>
    );
  } else if (lists.length === 0) {
    recent = <p className="py-10 text-center text-[14px] text-[#6B7280]">No guest lists yet. Start one above.</p>;
  } else if (results.length === 0) {
    recent = <p className="py-10 text-center text-[14px] text-[#6B7280]">No guests or lists match “{query}”.</p>;
  } else {
    recent = (
      <>
        <div className={GRID}>
          {results.slice(0, shown).map(({ list, hits }) => (
            <ListCard
              key={list.id}
              list={list}
              meta={hits ? `${hits} matching guest${hits === 1 ? "" : "s"}` : `Opened ${longDate(list.openedAt)}`}
              onRename={() => {
                setRenameTarget(list);
                setNewName(list.name);
              }}
              onEdit={() => setPanel({ open: true, list })}
              onDelete={() => setToDelete(list)}
            />
          ))}
        </div>
        {results.length > shown && (
          <Button fullWidth onClick={() => setShown((n) => n + PAGE * 2)} endIcon={<ChevronDown size={16} />} sx={{ mt: 6, py: 1.1, bgcolor: "#F1F4F8", color: "#0F0F0F", "&:hover": { bgcolor: "#E5EAF1" } }}>
            See more
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <PageTitle>Guests</PageTitle>

      <TextField
        fullWidth
        size="small"
        placeholder="Search for an guest[s]"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShown(PAGE);
        }}
        slotProps={{
          htmlInput: { "aria-label": "Search guests and guest lists" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
          },
        }}
      />

      <h2 className="mb-4 mt-10 text-[#0F0F0F]" style={heading}>
        Start a new Guest record
      </h2>
      <button
        type="button"
        onClick={() => setPanel({ open: true })}
        aria-label="Create guest list"
        className="flex w-full flex-col rounded-lg border border-[#E2E5EA] bg-white p-3 transition-shadow hover:shadow-[0_8px_24px_rgba(6,13,24,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] min-[460px]:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)] xl:w-[calc(25%-9px)]"
      >
        <span className="flex h-[176px] w-full items-center justify-center rounded-md bg-[#F8F9FB] text-[#0F0F0F]">
          <Plus size={28} strokeWidth={1.5} />
        </span>
      </button>

      <h2 className="mb-4 mt-10  text-[#0F0F0F]" style={heading}>
        {query.trim() ? "Results" : "Recent guests"}
      </h2>
      {recent}

      <GuestListPanel
        open={panel.open}
        list={panel.list}
        onClose={() => setPanel((p) => ({ ...p, open: false }))}
        onSaved={(saved) => !panel.list && router.push(detailHref(saved.id))}
      />

      {/* Rename */}
      <Dialog open={!!renameTarget} onClose={() => !renaming && setRenameTarget(null)} maxWidth="xs" fullWidth>
        <form onSubmit={rename}>
          <DialogTitle>Rename guest list</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 60, "aria-label": "Guest list name" } }}
              sx={{ mt: 0.5 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRenameTarget(null)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={renaming || !newName.trim()}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete list */}
      <Dialog open={!!toDelete} onClose={() => !deleting && setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this guest list?</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-[#4B5563]">
            “{toDelete?.name}” and its {toDelete?.guests.length ?? 0} guest{toDelete?.guests.length === 1 ? "" : "s"} will be removed, and its RSVP link will stop working. This can&apos;t be undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)} color="inherit" disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
