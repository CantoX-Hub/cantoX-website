"use client";

import { useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { useCreateCalendarEventMutation, useUpdateCalendarEventMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { CalendarCategory, CalendarEvent, CalendarEventInput } from "@/app/types/calendar.types";
import { useToast } from "../Toast";
import { ChoicePill, Field, SidePanel } from "../guests/shared";
import { CATEGORIES, CATEGORY_META } from "./shared";

type Errors = Partial<Record<"title" | "date" | "time", string>>;

const blank = (date: string): CalendarEventInput => ({ title: "", category: "ceremony", date, time: "10:00", location: "", notes: "" });

/**
 * Add / edit an event. `event` undefined → new event on `date`.
 * `googleConnected` decides whether "Also add to Google Calendar" is offered.
 */
export default function EventPanel({
  open,
  event,
  date,
  googleConnected,
  onConnectGoogle,
  onClose,
}: {
  open: boolean;
  event?: CalendarEvent;
  date: string;
  googleConnected: boolean;
  onConnectGoogle: () => void;
  onClose: () => void;
}) {
  const notify = useToast();
  const [create, { isLoading: creating }] = useCreateCalendarEventMutation();
  const [update, { isLoading: updating }] = useUpdateCalendarEventMutation();
  const [form, setForm] = useState<CalendarEventInput>(() => blank(date));
  const [sync, setSync] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const saving = creating || updating;

  useEffect(() => {
    if (!open) return;
    setForm(event ? { title: event.title, category: event.category, date: event.date, time: event.time, location: event.location, notes: event.notes ?? "" } : blank(date));
    setSync(true);
    setErrors({});
  }, [open, event, date]);

  const set = <K extends keyof CalendarEventInput>(key: K, value: CalendarEventInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.title.trim()) next.title = "Give the event a title.";
    if (!form.date) next.date = "Choose a date.";
    if (!form.time) next.time = "Choose a time.";
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      if (event) {
        await update({ id: event.id, input: form }).unwrap();
        notify(event.googleEventId ? "Event saved and updated on Google Calendar" : "Event saved");
      } else {
        const toGoogle = googleConnected && sync;
        await create({ input: form, syncToGoogle: toGoogle }).unwrap();
        notify(toGoogle ? "Event added and synced to Google Calendar" : "Event added");
      }
      onClose();
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      onSubmit={submit}
      title={event ? "Edit event" : "Add event"}
      description={event ? undefined : "Add a ceremony, reception, vendor appointment or task to your calendar."}
      footer={
        <>
          <Button onClick={onClose} variant="outlined" color="inherit" disabled={saving} sx={{ borderColor: "#D1D5DB" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving…" : event ? "Save changes" : "Add event"}
          </Button>
        </>
      }
    >
      <Field
        label="Title"
        placeholder="e.g. Church ceremony"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        error={!!errors.title}
        helperText={errors.title}
        autoFocus={!event}
        slotProps={{ htmlInput: { maxLength: 80 } }}
      />

      <fieldset>
        <legend className="mb-1.5 text-[14px] font-medium text-[#0F0F0F]">Type</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <ChoicePill key={c} name="event-category" label={CATEGORY_META[c].label} checked={form.category === c} onSelect={() => set("category", c as CalendarCategory)} />
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} error={!!errors.date} helperText={errors.date} />
        <Field label="Time" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} error={!!errors.time} helperText={errors.time} />
      </div>

      <Field label="Location" placeholder="e.g. Lagos, Nigeria." value={form.location} onChange={(e) => set("location", e.target.value)} slotProps={{ htmlInput: { maxLength: 120 } }} />
      <Field label="Notes" hint="(optional)" multiline minRows={3} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} slotProps={{ htmlInput: { maxLength: 500 } }} />

      {!event &&
        (googleConnected ? (
          <FormControlLabel
            control={<Checkbox checked={sync} onChange={(e) => setSync(e.target.checked)} />}
            label="Also add to my Google Calendar"
            slotProps={{ typography: { sx: { fontSize: 14 } } }}
          />
        ) : (
          <p className="rounded-md bg-[#F8F9FB] px-3 py-2.5 text-[13px] text-[#4B5563]">
            Want this on your phone too?{" "}
            <button type="button" onClick={onConnectGoogle} className="font-semibold text-[#C99532] hover:underline">
              Connect Google Calendar
            </button>
          </p>
        ))}
      {event?.googleEventId && <p className="text-[13px] text-[#4B5563]">This event is on your Google Calendar; changes you save here update it there too.</p>}
    </SidePanel>
  );
}
