"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import { ChevronDown, Clock3, GripVertical, PencilLine, Plus, X } from "lucide-react";
import { useCreateTodoListMutation, useUpdateTodoListMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { TodoList, TodoListInput } from "@/app/types/todo.types";
import { useToast } from "../Toast";
import { REMINDER_PRESETS, formatDay, formatTime, fromFields, presetFor, timeOptions, toDateValue, toTimeValue } from "./reminders";

interface Row {
  /** Stable React key; also the task id for saved tasks */
  key: string;
  id?: string;
  text: string;
}

const heading = { fontFamily: '"Cal Sans", "DM Sans", sans-serif' };
const newKey = () => `new-${Math.random().toString(36).slice(2, 9)}`;
const emptyRow = (): Row => ({ key: newKey(), text: "" });
const checkboxSx = { p: 0.5, color: "#9CA3AF", "&.Mui-checked": { color: "#C5CBD3" } };

function initialState(list?: TodoList): { title: string; open: Row[]; done: Row[]; date: string; time: string } {
  const remind = list ? (list.remindAt ? new Date(list.remindAt) : null) : REMINDER_PRESETS[0].at();
  return {
    title: list?.title ?? "",
    open: list ? list.tasks.filter((t) => !t.done).map((t) => ({ key: t.id, id: t.id, text: t.text })) : [emptyRow()],
    done: list ? list.tasks.filter((t) => t.done).map((t) => ({ key: t.id, id: t.id, text: t.text })) : [],
    date: remind ? toDateValue(remind) : "",
    time: remind ? toTimeValue(remind) : "",
  };
}

const snapshot = (s: ReturnType<typeof initialState>) =>
  JSON.stringify([s.title.trim(), s.open.map((r) => r.text.trim()).filter(Boolean), s.done.map((r) => r.text.trim()), s.date, s.time]);

/**
 * Right-side drawer to create or edit a to-do list.
 * `list` undefined → create.
 */
export default function TodoListPanel({ open, list, onClose }: { open: boolean; list?: TodoList; onClose: () => void }) {
  const notify = useToast();
  const titleId = useId();
  const [createList, { isLoading: creating }] = useCreateTodoListMutation();
  const [updateList, { isLoading: updating }] = useUpdateTodoListMutation();
  const saving = creating || updating;

  const [state, setState] = useState(() => initialState(list));
  const [initial, setInitial] = useState(() => snapshot(initialState(list)));
  const [titleError, setTitleError] = useState("");
  const [remindError, setRemindError] = useState("");
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [focus, setFocus] = useState<{ key: string; part: "input" | "grip" } | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const rowEls = useRef(new Map<string, HTMLLIElement>());
  const inputEls = useRef(new Map<string, HTMLInputElement>());
  const gripEls = useRef(new Map<string, HTMLButtonElement>());

  // Reset whenever the drawer opens, or opens on another list
  useEffect(() => {
    if (!open) return;
    const s = initialState(list);
    setState(s);
    setInitial(snapshot(s));
    setTitleError("");
    setRemindError("");
  }, [open, list]);

  useEffect(() => {
    if (!focus) return;
    const el = focus.part === "grip" ? gripEls.current.get(focus.key) : inputEls.current.get(focus.key);
    el?.focus();
    setFocus(null);
  }, [focus]);

  const dirty = snapshot(state) !== initial;
  const remindAt = fromFields(state.date, state.time);
  const preset = presetFor(remindAt);
  const times = useMemo(() => timeOptions(state.time || undefined), [state.time]);
  const today = toDateValue(new Date());

  const setOpenRows = (fn: (rows: Row[]) => Row[]) => setState((s) => ({ ...s, open: fn(s.open) }));
  const setDoneRows = (fn: (rows: Row[]) => Row[]) => setState((s) => ({ ...s, done: fn(s.done) }));

  /* ---------- Items ---------- */

  const addRow = (after?: string) => {
    const row = emptyRow();
    setOpenRows((rows) => {
      const i = after ? rows.findIndex((r) => r.key === after) : rows.length - 1;
      return [...rows.slice(0, i + 1), row, ...rows.slice(i + 1)];
    });
    setFocus({ key: row.key, part: "input" });
  };

  const removeRow = (key: string, focusPrevious = false) => {
    const i = state.open.findIndex((r) => r.key === key);
    if (focusPrevious && i > 0) setFocus({ key: state.open[i - 1].key, part: "input" });
    setOpenRows((rows) => rows.filter((r) => r.key !== key));
    setDoneRows((rows) => rows.filter((r) => r.key !== key));
  };

  const check = (row: Row) => {
    setOpenRows((rows) => rows.filter((r) => r.key !== row.key));
    setDoneRows((rows) => [row, ...rows]);
  };
  const uncheck = (row: Row) => {
    setDoneRows((rows) => rows.filter((r) => r.key !== row.key));
    setOpenRows((rows) => [...rows, row]);
  };

  const move = (key: string, to: number) =>
    setOpenRows((rows) => {
      const from = rows.findIndex((r) => r.key === key);
      if (from < 0 || to < 0 || to >= rows.length || to === from) return rows;
      const next = rows.slice();
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });

  /** Index the dragged row should take, from where the pointer is */
  const dropIndex = (key: string, y: number) =>
    state.open.filter((r) => {
      if (r.key === key) return false;
      const rect = rowEls.current.get(r.key)?.getBoundingClientRect();
      return rect ? rect.top + rect.height / 2 < y : false;
    }).length;

  /* ---------- Reminder ---------- */

  const setReminder = (d: Date | null) => {
    setRemindError("");
    setState((s) => ({ ...s, date: d ? toDateValue(d) : "", time: d ? toTimeValue(d) : "" }));
  };

  const pickDateTime = () => {
    setMenuAnchor(null);
    setTimeout(() => {
      dateRef.current?.focus();
      try {
        dateRef.current?.showPicker();
      } catch {
        /* older browsers: the field is focused instead */
      }
    }, 0);
  };

  /* ---------- Save / close ---------- */

  const requestClose = () => (dirty && !saving ? setConfirmDiscard(true) : onClose());

  const toInput = (): TodoListInput => ({
    title: state.title,
    tasks: [...state.open.map((r) => ({ id: r.id, text: r.text, done: false })), ...state.done.map((r) => ({ id: r.id, text: r.text, done: true }))],
    remindAt: remindAt ? remindAt.toISOString() : null,
  });

  const validate = () => {
    let ok = true;
    if (!state.title.trim()) {
      setTitleError("Give your list a title.");
      titleRef.current?.focus();
      ok = false;
    }
    const remindChanged = list ? (remindAt?.toISOString() ?? null) !== (list.remindAt ? new Date(list.remindAt).toISOString() : null) : true;
    if (remindAt && remindChanged && remindAt.getTime() < Date.now()) {
      setRemindError("That time has already passed. Pick a later one.");
      ok = false;
    }
    return ok;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (list) await updateList({ id: list.id, input: toInput() }).unwrap();
      else await createList(toInput()).unwrap();
      notify(list ? "To-do list saved" : "To-do list created");
      onClose();
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  const toggleArchive = async () => {
    // New list: save it straight into the archive
    if (!list) {
      if (!validate()) return;
      try {
        await createList({ ...toInput(), archived: true }).unwrap();
        notify(`“${state.title.trim()}” saved to your archive`, { severity: "info" });
        onClose();
      } catch (err) {
        notify(getErrorMessage(err), { severity: "error" });
      }
      return;
    }
    if (dirty && !validate()) return;
    const archived = !list.archived;
    try {
      await updateList({ id: list.id, input: { ...(dirty ? toInput() : {}), archived } }).unwrap();
      notify(archived ? `Archived “${state.title.trim() || list.title}”` : "Moved back to your lists", {
        severity: "info",
        actionLabel: "Undo",
        onAction: () => updateList({ id: list.id, input: { archived: !archived } }),
      });
      onClose();
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={requestClose}
        slotProps={{ paper: { sx: { width: { xs: "100%", sm: 528 } }, "aria-labelledby": titleId } as object }}
      >
        <form onSubmit={save} noValidate className="flex h-full flex-col px-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E8EC] pb-5 pt-8">
            <h2 id={titleId} className="text-[18px] font-semibold text-[#0F0F0F]">
              {list ? "To-do list" : "Create to-do list"}
            </h2>
            <IconButton onClick={requestClose} aria-label="Close" sx={{ mr: 1, color: "#0F0F0F" }}>
              <X size={18} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto pb-6 pt-6">
            {/* Title: grows with the text, pencil sits right after it */}
            <label className="flex max-w-full items-center gap-2">
              <span className="sr-only">Title</span>
              <span className="inline-grid min-w-0 max-w-[calc(100%-32px)]">
                <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre text-[24px] font-semibold" style={heading}>
                  {state.title || "Title"}
                </span>
                <input
                  ref={titleRef}
                  value={state.title}
                  autoFocus={!list}
                  onChange={(e) => {
                    setTitleError("");
                    setState((s) => ({ ...s, title: e.target.value }));
                  }}
                  maxLength={80}
                  placeholder="Title"
                  aria-invalid={!!titleError}
                  aria-describedby={titleError ? "todo-title-error" : undefined}
                  className="col-start-1 row-start-1 w-full min-w-[3ch] bg-transparent text-[24px] font-semibold tracking-[-0.01em] text-[#0F0F0F] outline-none placeholder:text-[#C5D0DC]"
                  style={heading}
                />
              </span>
              {!state.title && <PencilLine size={20} className="shrink-0 text-[#C5D0DC]" aria-hidden />}
            </label>
            {titleError && (
              <p id="todo-title-error" role="alert" className="mt-1 text-[13px] text-[#D32F2F]">
                {titleError}
              </p>
            )}

            {/* Open items */}
            <ul className="mt-4" aria-label="Tasks">
              {state.open.map((row, i) => (
                <li
                  key={row.key}
                  ref={(el) => {
                    if (el) rowEls.current.set(row.key, el);
                    else rowEls.current.delete(row.key);
                  }}
                  className={`group flex h-11 items-center rounded-md ${dragKey === row.key ? "bg-[#F8F9FB] shadow-[0_4px_14px_rgba(6,13,24,0.10)]" : ""}`}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) gripEls.current.set(row.key, el);
                      else gripEls.current.delete(row.key);
                    }}
                    aria-label={`Move “${row.text || "empty item"}”. Use the up and down arrow keys.`}
                    onPointerDown={(e) => {
                      if (e.button !== 0) return;
                      e.preventDefault();
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragKey(row.key);
                    }}
                    onPointerMove={(e) => dragKey === row.key && move(row.key, dropIndex(row.key, e.clientY))}
                    onPointerUp={() => setDragKey(null)}
                    onPointerCancel={() => setDragKey(null)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                      e.preventDefault();
                      move(row.key, i + (e.key === "ArrowUp" ? -1 : 1));
                      setFocus({ key: row.key, part: "grip" });
                    }}
                    className={`flex h-9 w-9 shrink-0 touch-none items-center justify-center rounded text-[#0F0F0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] ${dragKey === row.key ? "cursor-grabbing" : "cursor-grab"}`}
                  >
                    <GripVertical size={26} strokeWidth={2.25} />
                  </button>
                  <span className="ml-4 shrink-0">
                    <Checkbox size="small" checked={false} onChange={() => check(row)} disabled={!row.text.trim()} sx={checkboxSx} slotProps={{ input: { "aria-label": `Mark “${row.text || "item"}” as done` } }} />
                  </span>
                  <input
                    ref={(el) => {
                      if (el) inputEls.current.set(row.key, el);
                      else inputEls.current.delete(row.key);
                    }}
                    value={row.text}
                    onChange={(e) => setOpenRows((rows) => rows.map((r) => (r.key === row.key ? { ...r, text: e.target.value } : r)))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRow(row.key);
                      } else if (e.key === "Backspace" && !row.text && state.open.length > 1) {
                        e.preventDefault();
                        removeRow(row.key, true);
                      }
                    }}
                    maxLength={200}
                    placeholder={i === state.open.length - 1 && !row.text ? "List item" : undefined}
                    aria-label={`Item ${i + 1}`}
                    className="ml-5 h-full min-w-0 flex-1 bg-transparent text-[15px] text-[#0F0F0F] outline-none placeholder:text-[#B8C1CC]"
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeRow(row.key)}
                    aria-label={`Remove “${row.text || "empty item"}”`}
                    className="opacity-100 lg:opacity-0 lg:focus-visible:opacity-100 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
                    sx={{ color: "#0F0F0F", mr: 0.5 }}
                  >
                    <X size={18} />
                  </IconButton>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => addRow()}
              className="mt-1 flex items-center gap-1.5 rounded-full bg-[#F1F4F8] px-3 py-1.5 text-[15px] text-[#0F0F0F] transition-colors hover:bg-[#E5EAF1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
            >
              <Plus size={18} /> List item
            </button>

            {/* Done items */}
            {state.done.length > 0 && (
              <ul className="mt-2" aria-label="Done">
                {state.done.map((row) => (
                  <li key={row.key} className="group flex h-11 items-center pl-[52px]">
                    <Checkbox size="small" checked onChange={() => uncheck(row)} sx={checkboxSx} slotProps={{ input: { "aria-label": `Mark “${row.text}” as not done` } }} />
                    <span className="ml-5 min-w-0 flex-1 truncate text-[15px] text-[#9CA3AF] line-through">{row.text}</span>
                    <IconButton
                      size="small"
                      onClick={() => removeRow(row.key)}
                      aria-label={`Remove “${row.text}”`}
                      className="opacity-100 lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover:opacity-100"
                      sx={{ color: "#9CA3AF", mr: 0.5 }}
                    >
                      <X size={16} />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}

            {/* Reminder */}
            <p id="remind-label" className="mt-6 text-[15px] font-medium text-[#0F0F0F]">
              Remind me later
            </p>
            <button
              type="button"
              aria-labelledby="remind-label remind-value"
              aria-haspopup="menu"
              aria-expanded={!!menuAnchor}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              className="mt-2 flex h-10 w-full items-center rounded-md border border-[#D1D5DB] bg-white px-4 text-left text-[14px] text-[#0F0F0F] focus-visible:border-[#C99532] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C99532]/20"
            >
              <Clock3 size={16} className="shrink-0" />
              <span id="remind-value" className="flex flex-1 items-center">
                {remindAt ? (
                  <>
                    <span className="ml-4 w-[150px] truncate">{preset?.label ?? formatDay(remindAt)}</span>
                    <span className="font-semibold">{formatTime(remindAt)}</span>
                  </>
                ) : (
                  <span className="ml-4 text-[#6B7280]">No reminder</span>
                )}
              </span>
              <ChevronDown size={18} className="shrink-0" />
            </button>
            <Menu
              anchorEl={menuAnchor}
              open={!!menuAnchor}
              onClose={() => setMenuAnchor(null)}
              slotProps={{
                paper: { sx: { width: menuAnchor?.offsetWidth, mt: 0.5, borderRadius: "8px", border: "1px solid #E2E5EA", boxShadow: "0 8px 24px rgba(6,13,24,0.08)" } },
                list: { sx: { py: 0 } },
              }}
            >
              {REMINDER_PRESETS.map((p) => (
                <MenuItem
                  key={p.id}
                  selected={preset?.id === p.id}
                  onClick={() => {
                    setReminder(p.at());
                    setMenuAnchor(null);
                  }}
                  sx={{ py: 1.4, px: 2, fontSize: 14, borderBottom: "1px solid #E8E8EC" }}
                >
                  <Clock3 size={16} />
                  <span className="ml-4 w-[150px]">{p.label}</span>
                  <span className="font-semibold">{formatTime(p.at())}</span>
                </MenuItem>
              ))}
              <MenuItem onClick={pickDateTime} sx={{ py: 1, px: 1.5, "&:hover": { bgcolor: "transparent" }, "&.Mui-focusVisible": { bgcolor: "transparent" } }}>
                <span className="flex items-center rounded-full bg-[#F1F4F8] px-3 py-1.5 text-[14px]">
                  <Clock3 size={16} />
                  <span className="ml-4">Pick a date &amp; time</span>
                </span>
              </MenuItem>
              {remindAt && (
                <MenuItem
                  onClick={() => {
                    setReminder(null);
                    setMenuAnchor(null);
                  }}
                  sx={{ py: 1.2, px: 2, fontSize: 14, color: "#6B7280", borderTop: "1px solid #E8E8EC" }}
                >
                  No reminder
                </MenuItem>
              )}
            </Menu>

            <p className="mt-5 text-[15px] font-medium text-[#0F0F0F]">Pick a date &amp; time</p>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <div className="relative">
                <input
                  ref={dateRef}
                  type="date"
                  value={state.date}
                  min={today}
                  onChange={(e) => {
                    const date = e.target.value;
                    setRemindError("");
                    setState((s) => ({ ...s, date, time: date && !s.time ? "08:00" : s.time }));
                  }}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker();
                    } catch {
                      /* not supported */
                    }
                  }}
                  aria-label="Reminder date"
                  className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div className="pointer-events-none flex h-10 items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-4 text-[14px] text-[#0F0F0F] peer-focus-visible:border-[#C99532] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C99532]/20">
                  <span className={state.date ? "" : "text-[#6B7280]"}>{state.date ? formatDay(new Date(`${state.date}T00:00`)) : "Select date"}</span>
                  <ChevronDown size={18} />
                </div>
              </div>
              <div className="relative">
                <select
                  value={state.time}
                  onChange={(e) => {
                    const time = e.target.value;
                    setRemindError("");
                    setState((s) => ({ ...s, time, date: time && !s.date ? toDateValue(REMINDER_PRESETS[0].at()) : s.date }));
                  }}
                  aria-label="Reminder time"
                  className={`h-10 w-full cursor-pointer appearance-none rounded-md border border-[#D1D5DB] bg-white px-4 text-[14px] outline-none focus-visible:border-[#C99532] focus-visible:ring-2 focus-visible:ring-[#C99532]/20 ${state.time ? "font-semibold text-[#0F0F0F]" : "text-[#6B7280]"}`}
                >
                  <option value="">Select time</option>
                  {times.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            {remindError && (
              <p role="alert" className="mt-2 text-[13px] text-[#D32F2F]">
                {remindError}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 border-t border-[#E8E8EC] px-6 pb-6 pt-6">
            <Button type="button" onClick={toggleArchive} disabled={saving} variant="outlined" color="inherit" fullWidth sx={{ py: 1.1, borderColor: "#D1D5DB", fontWeight: 600 }}>
              {list?.archived ? "Unarchive" : "Archive"}
            </Button>
            <Button type="submit" variant="contained" disabled={saving} fullWidth sx={{ py: 1.1, fontWeight: 600 }}>
              {saving ? "Saving…" : "Done"}
            </Button>
          </div>
        </form>
      </Drawer>

      <Dialog open={confirmDiscard} onClose={() => setConfirmDiscard(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Discard your changes?</DialogTitle>
        <DialogContent>
          <p className="text-[14px] text-[#4B5563]">{list ? "Your edits to this list haven't been saved." : "This list hasn't been saved yet."}</p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDiscard(false)} color="inherit">
            Keep editing
          </Button>
          <Button
            onClick={() => {
              setConfirmDiscard(false);
              onClose();
            }}
            variant="contained"
            color="error"
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
