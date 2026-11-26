"use client";

import { useMemo, useState } from "react";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Menu, MenuItem, Skeleton, TextField } from "@mui/material";
import { ChevronDown, Clock3, MoreVertical, PencilLine, Search } from "lucide-react";
import { useDeleteTodoListMutation, useGetTodoListsQuery, useToggleTodoTaskMutation, useUpdateTodoListMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { TodoList } from "@/app/types/todo.types";
import { useToast } from "../Toast";
import { EmptyState, PageTitle } from "../ui";
import TodoListPanel from "./TodoListPanel";
import { formatReminder } from "./reminders";

const PAGE = 8;
const ITEMS_ON_CARD = 4;
const GRID = "grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const heading = { fontFamily: '"Cal Sans", "DM Sans", sans-serif' };
const checkboxSx = { p: 0.5, ml: -0.5, color: "#9CA3AF", "&.Mui-checked": { color: "#C5CBD3" } };

function TodoCard({ list, onEdit, onArchive, onDelete }: { list: TodoList; onEdit: () => void; onArchive: () => void; onDelete: () => void }) {
  const notify = useToast();
  const [toggle] = useToggleTodoTaskMutation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  // Open tasks first, in the user's order; done ones after
  const tasks = [...list.tasks.filter((t) => !t.done), ...list.tasks.filter((t) => t.done)];
  const shown = tasks.slice(0, ITEMS_ON_CARD);
  const hidden = tasks.length - shown.length;
  const hasOpen = list.tasks.some((t) => !t.done);
  const overdue = !!list.remindAt && hasOpen && Date.parse(list.remindAt) < Date.now();

  const run = (fn: () => void) => () => {
    setAnchor(null);
    fn();
  };

  return (
    <article className="flex flex-col rounded-lg border border-[#E2E5EA] bg-white px-4 pb-4 pt-3">
      <div className="flex items-center justify-between gap-2 border-b border-[#E2E5EA] pb-3">
        <h3 className="min-w-0 text-[16px] tracking-[-0.01em] text-[#0F0F0F]" style={heading}>
          <button type="button" onClick={onEdit} className="block max-w-full truncate rounded text-left hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]">
            {list.title}
          </button>
        </h3>
        <IconButton size="small" onClick={onEdit} aria-label={`Edit ${list.title}`} sx={{ color: "#6B7280", mr: -0.5 }}>
          <PencilLine size={18} />
        </IconButton>
      </div>

      {shown.length === 0 ? (
        <p className="flex-1 py-6 text-[14px] text-[#9CA3AF]">No items yet</p>
      ) : (
        <ul className="flex-1 pt-2">
          {shown.map((t) => (
            <li key={t.id} className="flex min-h-[48px] items-center gap-3">
              <Checkbox
                size="small"
                checked={t.done}
                disabled={list.archived}
                onChange={async () => {
                  try {
                    await toggle({ id: list.id, taskId: t.id }).unwrap();
                  } catch (e) {
                    notify(getErrorMessage(e), { severity: "error" });
                  }
                }}
                sx={checkboxSx}
                slotProps={{ input: { "aria-label": t.done ? `Mark “${t.text}” as not done` : `Mark “${t.text}” as done` } }}
              />
              <span className={`min-w-0 flex-1 truncate text-[14px] ${t.done ? "text-[#9CA3AF] line-through" : "text-[#0F0F0F]"}`} title={t.text}>
                {t.text}
              </span>
            </li>
          ))}
          {hidden > 0 && (
            <li>
              <button type="button" onClick={onEdit} className="rounded pl-[38px] text-[13px] text-[#6B7280] hover:text-[#0F0F0F] hover:underline">
                +{hidden} more
              </button>
            </li>
          )}
        </ul>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        {list.remindAt ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] ${overdue ? "bg-[#FDE8E8] text-[#B91C1C]" : "bg-[#F1F4F8] text-[#0F0F0F]"}`}
            title={overdue ? "Reminder time has passed" : "Reminder"}
          >
            <Clock3 size={15} aria-hidden />
            <span className="sr-only">{overdue ? "Reminder passed:" : "Reminder:"}</span>
            {formatReminder(list.remindAt)}
          </span>
        ) : (
          <span className="text-[13px] text-[#9CA3AF]">No reminder</span>
        )}
        <IconButton size="small" aria-label={`More actions for ${list.title}`} aria-haspopup="menu" onClick={(e) => setAnchor(e.currentTarget)} sx={{ mr: -0.75 }}>
          <MoreVertical size={16} />
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { minWidth: 140 } } }}>
          <MenuItem onClick={run(onEdit)}>Edit</MenuItem>
          <MenuItem onClick={run(onArchive)}>{list.archived ? "Unarchive" : "Archive"}</MenuItem>
          <MenuItem onClick={run(onDelete)} sx={{ color: "#E10600" }}>
            Delete
          </MenuItem>
        </Menu>
      </div>
    </article>
  );
}

export default function TodoPage() {
  const notify = useToast();
  const { data: lists = [], isLoading, error, refetch } = useGetTodoListsQuery();
  const [updateList] = useUpdateTodoListMutation();
  const [deleteList, { isLoading: deleting }] = useDeleteTodoListMutation();

  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState<{ open: boolean; list?: TodoList }>({ open: false });
  const [toDelete, setToDelete] = useState<TodoList | null>(null);

  const archivedCount = lists.filter((l) => l.archived).length;
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lists
      .filter((l) => l.archived === showArchived)
      .filter((l) => !q || l.title.toLowerCase().includes(q) || l.tasks.some((t) => t.text.toLowerCase().includes(q)));
  }, [lists, query, showArchived]);

  const archive = async (list: TodoList) => {
    const archived = !list.archived;
    try {
      await updateList({ id: list.id, input: { archived } }).unwrap();
      notify(archived ? `Archived “${list.title}”` : "Moved back to your lists", {
        severity: "info",
        actionLabel: "Undo",
        onAction: () => updateList({ id: list.id, input: { archived: !archived } }),
      });
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteList(toDelete.id).unwrap();
      notify(`Deleted “${toDelete.title}”`);
      setToDelete(null);
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  let body: React.ReactNode;
  if (error) {
    body = (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load your to-do lists.")}</p>
        <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
          Try again
        </Button>
      </div>
    );
  } else if (isLoading) {
    body = (
      <div className={GRID} aria-busy="true" aria-label="Loading to-do lists">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-lg border border-[#E2E5EA] p-4">
            <Skeleton width="60%" height={28} />
            {Array.from({ length: 4 }, (_, j) => (
              <Skeleton key={j} width="85%" sx={{ mt: 1.5 }} />
            ))}
            <Skeleton variant="rounded" width={140} height={32} sx={{ mt: 2, borderRadius: 99 }} />
          </div>
        ))}
      </div>
    );
  } else if (results.length === 0) {
    body = query.trim() ? (
      <p className="py-10 text-center text-[14px] text-[#6B7280]">No to-do lists match “{query}”.</p>
    ) : showArchived ? (
      <p className="py-10 text-center text-[14px] text-[#6B7280]">No archived lists.</p>
    ) : (
      <EmptyState img="/empty-todo.svg" title="It's empty here" body="Create your first to-do list to keep track of everything for the big day." />
    );
  } else {
    body = (
      <>
        <div className={GRID}>
          {results.slice(0, shown).map((list) => (
            <TodoCard key={list.id} list={list} onEdit={() => setPanel({ open: true, list })} onArchive={() => archive(list)} onDelete={() => setToDelete(list)} />
          ))}
        </div>
        {results.length > shown && (
          <Button fullWidth onClick={() => setShown((n) => n + PAGE)} endIcon={<ChevronDown size={16} />} sx={{ mt: 7, py: 1.1, bgcolor: "#F1F4F8", color: "#0F0F0F", fontWeight: 600, "&:hover": { bgcolor: "#E5EAF1" } }}>
            See more
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <PageTitle>To-do list</PageTitle>

      <TextField
        fullWidth
        size="small"
        placeholder="Search for to-do list"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShown(PAGE);
        }}
        slotProps={{
          htmlInput: { "aria-label": "Search to-do lists and items" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
          },
        }}
      />

      <div className="mt-9 flex justify-end">
        <Button variant="contained" onClick={() => setPanel({ open: true })} sx={{ px: 2, py: 1.1, fontWeight: 600 }}>
          Create To-do list
        </Button>
      </div>

      <div className="mb-3 mt-7 flex items-baseline justify-between gap-3">
        <h2 className="text-[16px] tracking-[-0.01em] text-[#0F0F0F]" style={heading}>
          {showArchived ? "Archived to-do list" : query.trim() ? "Results" : "Recent to-do list"}
        </h2>
        {(archivedCount > 0 || showArchived) && (
          <button
            type="button"
            onClick={() => {
              setShowArchived((v) => !v);
              setShown(PAGE);
            }}
            className="rounded text-[13px] font-medium text-[#C99532] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
          >
            {showArchived ? "Back to my lists" : `View archived (${archivedCount})`}
          </button>
        )}
      </div>
      {body}

      <TodoListPanel open={panel.open} list={panel.list} onClose={() => setPanel((p) => ({ ...p, open: false }))} />

      <Dialog open={!!toDelete} onClose={() => !deleting && setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this to-do list?</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-[#4B5563]">
            “{toDelete?.title}” and its {toDelete?.tasks.length ?? 0} item{toDelete?.tasks.length === 1 ? "" : "s"} will be removed. This can&apos;t be undone. To keep it out of the way instead, archive it.
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
