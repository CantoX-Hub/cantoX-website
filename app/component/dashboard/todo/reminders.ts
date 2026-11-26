/** Reminder presets and formatting for to-do lists. Times are in the viewer's own time zone. */

export interface ReminderPreset {
  id: string;
  label: string;
  at: () => Date;
}

function daysFromToday(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/** Days until the next Monday, never today */
const toNextMonday = () => ((8 - new Date().getDay()) % 7) || 7;

export const REMINDER_PRESETS: ReminderPreset[] = [
  { id: "tomorrow-morning", label: "Tomorrow morning", at: () => daysFromToday(1, 8) },
  { id: "tomorrow-evening", label: "Tomorrow evening", at: () => daysFromToday(1, 18) },
  { id: "next-monday", label: "Next Monday", at: () => daysFromToday(toNextMonday(), 8) },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** "yyyy-mm-dd" in local time, for <input type="date"> */
export const toDateValue = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** "HH:mm" in local time */
export const toTimeValue = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** Combines the date and time fields into a Date (local time) */
export function fromFields(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const formatTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/** "October 19", with the year when it isn't this year */
export function formatDay(d: Date) {
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) });
}

/** "Oct 14, 8:00 AM", for the card chip */
export function formatReminder(iso: string) {
  const d = new Date(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleString("en-US", { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }), hour: "numeric", minute: "2-digit" });
}

/** The preset that lands on exactly this time, if any */
export const presetFor = (d: Date | null) => (d ? REMINDER_PRESETS.find((p) => p.at().getTime() === d.getTime()) : undefined);

/** Every half hour of the day, plus `extra` (e.g. 08:15 on an older reminder) */
export function timeOptions(extra?: string) {
  const all = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);
  if (extra && !all.includes(extra)) all.push(extra);
  return all.sort().map((value) => ({ value, label: formatTime(new Date(`2000-01-01T${value}`)) }));
}
