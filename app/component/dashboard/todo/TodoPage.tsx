"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Checkbox, IconButton, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useTodos } from "../useTodos";
import { useToast } from "../Toast";
import { EmptyState, PageTitle, Panel } from "../ui";
import { useDashboard } from "../DashboardContext";

type Filter = "open" | "done" | "all";

const SUGGESTIONS = {
  couple: ["Pick a website template", "Send save-the-dates", "Book a caterer", "Confirm the venue"],
  planner: ["Send client the vendor shortlist", "Confirm décor with Petal House", "Share run-of-show", "Collect final guest count"],
  vendor: ["Upload 6 gallery photos", "Reply to new enquiries", "Update price list", "Add your Instagram"],
} as const;

export default function TodoPage() {
  const notify = useToast();
  const { role } = useDashboard();
  const { items, loaded, add, toggle, remove, restore, rename, clearDone } = useTodos();
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState<Filter>("open");
  const [editing, setEditing] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => ({ open: items.filter((t) => !t.done).length, done: items.filter((t) => t.done).length, all: items.length }), [items]);
  const visible = items
    .filter((t) => (filter === "all" ? true : filter === "done" ? t.done : !t.done))
    .sort((a, b) => (a.due ?? "9999").localeCompare(b.due ?? "9999") || b.createdAt - a.createdAt);

  const submit = (text = title) => {
    if (!text.trim()) return;
    add(text, due);
    setTitle("");
    setDue("");
    if (filter === "done") setFilter("open");
    inputRef.current?.focus();
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageTitle>To-do list</PageTitle>

      <Panel className="p-4 sm:p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <TextField
            inputRef={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task, e.g. Book the photographer"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { "aria-label": "New task", maxLength: 140 } }}
          />
          <div className="flex gap-3">
            <TextField
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              size="small"
              slotProps={{ htmlInput: { "aria-label": "Due date (optional)", min: today } }}
              sx={{ minWidth: 160, flex: 1 }}
            />
            <Button type="submit" variant="contained" startIcon={<Plus size={16} />} disabled={!title.trim()} sx={{ whiteSpace: "nowrap" }}>
              Add task
            </Button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#F0F0F2]">
          <Tabs value={filter} onChange={(_, v) => setFilter(v)} aria-label="Filter tasks">
            <Tab value="open" label={`To do (${counts.open})`} />
            <Tab value="done" label={`Done (${counts.done})`} />
            <Tab value="all" label={`All (${counts.all})`} />
          </Tabs>
          {counts.done > 0 && (
            <Button
              size="small"
              color="inherit"
              onClick={() => {
                const removed = items.filter((t) => t.done);
                clearDone();
                notify(`Cleared ${removed.length} done ${removed.length === 1 ? "task" : "tasks"}`, {
                  severity: "info",
                  actionLabel: "Undo",
                  onAction: () => removed.forEach(restore),
                });
              }}
              sx={{ color: "text.secondary", mb: 0.5 }}
            >
              Clear done
            </Button>
          )}
        </div>

        {loaded && visible.length === 0 ? (
          <div className="py-4">
            <EmptyState
              title={filter === "done" ? "Nothing done yet" : "It's empty here"}
              body={filter === "done" ? "Tasks you tick off will show up here." : "Add your first task above, or start with one of these."}
            />
            {filter !== "done" && (
              <div className="flex flex-wrap justify-center gap-2 pb-4">
                {SUGGESTIONS[role].map((s) => (
                  <Button key={s} size="small" variant="outlined" color="inherit" startIcon={<Plus size={14} />} onClick={() => add(s)} sx={{ borderColor: "#E8E8EC" }}>
                    {s}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-[#F0F0F2]">
            {visible.map((t) => {
              const overdue = !t.done && t.due && t.due < today;
              return (
                <li key={t.id} className="group flex items-center gap-2 py-2">
                  <Checkbox checked={t.done} onChange={() => toggle(t.id)} slotProps={{ input: { "aria-label": t.done ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done` } }} />
                  <div className="min-w-0 flex-1">
                    {editing === t.id ? (
                      <TextField
                        defaultValue={t.title}
                        size="small"
                        fullWidth
                        autoFocus
                        slotProps={{ htmlInput: { "aria-label": "Edit task", maxLength: 140 } }}
                        onBlur={(e) => {
                          if (e.target.value.trim()) rename(t.id, e.target.value);
                          setEditing(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          if (e.key === "Escape") setEditing(null);
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditing(t.id)}
                        className={`block w-full truncate rounded text-left text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] ${t.done ? "text-[#9CA3AF] line-through" : "text-[#0F0F0F]"}`}
                        title="Click to edit"
                      >
                        {t.title}
                      </button>
                    )}
                    {t.due && (
                      <span className={`mt-0.5 flex items-center gap-1 text-[12px] ${overdue ? "font-medium text-[#DC2626]" : "text-[#9CA3AF]"}`}>
                        <CalendarDays size={12} />
                        {overdue ? "Overdue, " : "Due "}
                        {new Date(t.due).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <Tooltip title="Delete task">
                    <IconButton
                      onClick={() => {
                        remove(t.id);
                        notify("Task deleted", { severity: "info", actionLabel: "Undo", onAction: () => restore(t) });
                      }}
                      aria-label={`Delete "${t.title}"`}
                      size="small"
                      className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
