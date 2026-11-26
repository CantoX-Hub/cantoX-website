/**
 * Stand-in for the calendar and Google Calendar endpoints, kept in localStorage.
 * Only services/api.ts should import this; delete it once the backend is ready.
 *
 * What the real backend does instead (see the notes in services/api.ts):
 * - connect: OAuth with Google (scope calendar.events), refresh token stored server-side
 * - sync: Google Calendar API events.insert, keeping the returned event id
 * - edit / delete of a synced event: events.patch / events.delete on Google too
 */
import type { CalendarCategory, CalendarEvent, CalendarEventInput, GoogleCalendarStatus } from "@/app/types/calendar.types";

const KEY = "cantox:calendar-events";
/** Shared with the Overview "Connect your calendar" banner */
export const GOOGLE_KEY = "cantox:gcal-connected";
const CATEGORIES: CalendarCategory[] = ["ceremony", "reception", "vendor", "task"];

const uid = () => `cal-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const pad = (n: number) => String(n).padStart(2, "0");

/** Dummy events spread over this month and next, so the calendar never looks empty */
function seed(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const day = (offsetMonths: number, d: number) => {
    const dt = new Date(y, m + offsetMonths, d);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
  };
  const t = Date.now();
  const e = (date: string, time: string, title: string, category: CalendarCategory, synced = false): CalendarEvent => ({
    id: uid() + Math.random().toString(36).slice(2, 4),
    title,
    category,
    date,
    time,
    location: "Lagos, Nigeria.",
    ...(synced ? { googleEventId: `demo-${Math.random().toString(36).slice(2, 10)}` } : {}),
    createdAt: t,
    updatedAt: t,
  });
  return [
    e(day(0, 1), "10:00", "Church ceremony", "ceremony"),
    e(day(0, 1), "16:00", "Evening reception", "reception"),
    e(day(0, 1), "08:00", "Florist delivery", "vendor"),
    e(day(0, 6), "12:00", "Caterer tasting", "vendor"),
    e(day(0, 7), "10:00", "Traditional engagement", "ceremony"),
    e(day(0, 7), "17:00", "After party", "reception"),
    e(day(0, 12), "11:00", "Court registry", "ceremony"),
    e(day(0, 12), "14:00", "Cake designer meeting", "vendor"),
    e(day(0, 14), "10:00", "Church ceremony", "ceremony"),
    e(day(0, 14), "10:00", "Evening reception", "reception", true),
    e(day(0, 14), "10:00", "Photographer call time", "vendor"),
    e(day(0, 14), "10:00", "Call all vendors for submission", "task"),
    e(day(0, 20), "09:00", "Bridal shower", "ceremony"),
    e(day(0, 20), "13:00", "DJ sound check", "vendor"),
    e(day(0, 20), "18:00", "Send final guest list", "task"),
    e(day(0, 21), "10:00", "Thanksgiving service", "ceremony"),
    e(day(0, 21), "15:00", "Family reception", "reception"),
    e(day(0, 21), "09:00", "Decorator walkthrough", "vendor"),
    e(day(0, 28), "10:00", "Wedding rehearsal", "ceremony"),
    e(day(0, 28), "12:00", "Makeup trial", "vendor"),
    e(day(0, 28), "19:00", "Confirm seating chart", "task"),
    e(day(1, 17), "10:00", "Photographer call time", "vendor"),
    e(day(1, 17), "10:00", "Evening reception", "reception", true),
    e(day(1, 17), "10:00", "Call all vendors for submission", "task"),
  ];
}

function readAll(): CalendarEvent[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) {
      const initial = seed();
      writeAll(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(events: CalendarEvent[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    throw new Error("Your browser storage is full, so we couldn't save.");
  }
}

function clean(input: CalendarEventInput) {
  const title = input.title.trim();
  if (!title) throw new Error("Give the event a title.");
  if (title.length > 80) throw new Error("Keep the title under 80 characters.");
  if (!CATEGORIES.includes(input.category)) throw new Error("Choose what kind of event this is.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new Error("Choose a date.");
  if (!/^\d{2}:\d{2}$/.test(input.time)) throw new Error("Choose a time.");
  return { title, category: input.category, date: input.date, time: input.time, location: input.location.trim(), notes: input.notes?.trim() || undefined };
}

function isConnected() {
  try {
    return window.localStorage.getItem(GOOGLE_KEY) === "1";
  } catch {
    return false;
  }
}

function requireGoogle() {
  if (!isConnected()) throw new Error("Connect Google Calendar first.");
}

export const calendarDb = {
  list: () => readAll().sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),

  create(input: CalendarEventInput, syncToGoogle = false) {
    if (syncToGoogle) requireGoogle();
    const now = Date.now();
    const ev: CalendarEvent = { id: uid(), ...clean(input), createdAt: now, updatedAt: now, ...(syncToGoogle ? { googleEventId: `g-${now.toString(36)}` } : {}) };
    writeAll([...readAll(), ev]);
    return ev;
  },

  /** Real backend: also patches the Google copy when the event is synced */
  update(id: string, input: CalendarEventInput) {
    const all = readAll();
    const ev = all.find((e) => e.id === id);
    if (!ev) return undefined;
    Object.assign(ev, clean(input), { updatedAt: Date.now() });
    if (!ev.notes) delete ev.notes;
    writeAll(all);
    return ev;
  },

  /** Real backend: also deletes the Google copy */
  remove(id: string) {
    const all = readAll();
    if (!all.some((e) => e.id === id)) return undefined;
    writeAll(all.filter((e) => e.id !== id));
    return true;
  },

  restore(ev: CalendarEvent) {
    writeAll([...readAll().filter((e) => e.id !== ev.id), ev]);
    return ev;
  },

  setSynced(id: string, synced: boolean) {
    if (synced) requireGoogle();
    const all = readAll();
    const ev = all.find((e) => e.id === id);
    if (!ev) return undefined;
    if (synced) ev.googleEventId = ev.googleEventId ?? `g-${Date.now().toString(36)}`;
    else delete ev.googleEventId;
    ev.updatedAt = Date.now();
    writeAll(all);
    return ev;
  },

  googleStatus: (): GoogleCalendarStatus => (isConnected() ? { connected: true, email: "you@gmail.com" } : { connected: false }),

  connectGoogle(): GoogleCalendarStatus {
    window.localStorage.setItem(GOOGLE_KEY, "1");
    return calendarDb.googleStatus();
  },

  /** Events already copied to Google stay there; we just stop syncing */
  disconnectGoogle(): GoogleCalendarStatus {
    window.localStorage.removeItem(GOOGLE_KEY);
    writeAll(readAll().map(({ googleEventId: _g, ...rest }) => rest));
    return calendarDb.googleStatus();
  },
};
