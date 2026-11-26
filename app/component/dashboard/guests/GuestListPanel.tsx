"use client";

import { useEffect, useState } from "react";
import { Button, MenuItem } from "@mui/material";
import { useCreateGuestListMutation, useUpdateGuestListMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { GuestList } from "@/app/types/guest.types";
import { useToast } from "../Toast";
import { useEventOptions } from "../useEventOptions";
import { Field, InfoNote, SidePanel } from "./shared";

const MAX_GUESTS = 5000;
const MAX_TABLE = 50;

interface Props {
  open: boolean;
  onClose: () => void;
  /** Edit this list; omit to create one */
  list?: GuestList;
  /** Called with the saved list */
  onSaved?: (list: GuestList) => void;
  /** Focus a field when opening, e.g. "Edit capacity" */
  focus?: "capacity";
}

export default function GuestListPanel({ open, onClose, list, onSaved, focus }: Props) {
  const notify = useToast();
  const options = useEventOptions({ id: list?.eventId, label: list?.eventLabel });
  const [createList, { isLoading: creating }] = useCreateGuestListMutation();
  const [updateList, { isLoading: updating }] = useUpdateGuestListMutation();

  const [name, setName] = useState("");
  const [expected, setExpected] = useState("");
  const [tableCapacity, setTableCapacity] = useState("8");
  const [eventId, setEventId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fill the form each time it opens
  useEffect(() => {
    if (!open) return;
    setName(list?.name ?? "");
    setExpected(list ? String(list.expectedGuests) : "");
    setTableCapacity(list ? String(list.tableCapacity) : "8");
    setEventId(list?.eventId ?? "");
    setErrors({});
  }, [open, list]);

  const validate = () => {
    const e: Record<string, string> = {};
    const n = Number(expected);
    const t = Number(tableCapacity);
    if (!name.trim()) e.name = "Give this guest list a name.";
    if (!expected) e.expected = "How many guests can your venue hold?";
    else if (!Number.isInteger(n) || n < 1 || n > MAX_GUESTS) e.expected = `Enter a number from 1 to ${MAX_GUESTS}.`;
    else if (list && n < list.guests.length) e.expected = `You already have ${list.guests.length} guests.`;
    if (!tableCapacity) e.table = "How many people per table?";
    else if (!Number.isInteger(t) || t < 1 || t > MAX_TABLE) e.table = `Enter a number from 1 to ${MAX_TABLE}.`;
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    const input = {
      name: name.trim(),
      expectedGuests: Number(expected),
      tableCapacity: Number(tableCapacity),
      eventId: eventId || undefined,
      eventLabel: options.find((o) => o.id === eventId)?.label,
    };
    try {
      const saved = list ? await updateList({ id: list.id, input }).unwrap() : await createList(input).unwrap();
      notify(list ? "Guest list updated" : "Guest list created");
      onSaved?.(saved);
      onClose();
    } catch (e) {
      notify(getErrorMessage(e), { severity: "error" });
    }
  };

  const saving = creating || updating;
  const err = (k: string) => (errors[k] ? { error: true, helperText: errors[k] } : {});
  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 5);

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      onSubmit={submit}
      title={list ? "Edit guest list" : "Create guest list"}
      footer={
        <>
          <Button variant="outlined" color="inherit" onClick={onClose} sx={{ minWidth: 150, borderColor: "#D1D5DB" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ minWidth: 150 }}>
            {saving ? "Saving…" : list ? "Save changes" : "Create"}
          </Button>
        </>
      }
    >
      <Field label="Event name" placeholder="Walby’s guest" value={name} onChange={(e) => setName(e.target.value)} slotProps={{ htmlInput: { maxLength: 60 } }} autoFocus={!focus} {...err("name")} />
      <Field
        label="Expected number of guests"
        placeholder="300"
        value={expected}
        inputMode="numeric"
        onChange={(e) => setExpected(digits(e.target.value))}
        autoFocus={focus === "capacity"}
        {...err("expected")}
      />
      <Field label="Table capacity" placeholder="8" value={tableCapacity} inputMode="numeric" onChange={(e) => setTableCapacity(digits(e.target.value))} {...err("table")} />
      <Field select label="Attach guest to?" value={eventId} onChange={(e) => setEventId(e.target.value)} slotProps={{ select: { displayEmpty: true } }}>
        <MenuItem value="">
          <span className="text-[#9CA3AF]">Not attached</span>
        </MenuItem>
        {options.map((o) => (
          <MenuItem key={o.id} value={o.id}>
            {o.label}
          </MenuItem>
        ))}
      </Field>
      <InfoNote>Table capacity is the number of people you want at each table.</InfoNote>
    </SidePanel>
  );
}
