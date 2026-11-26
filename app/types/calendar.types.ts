export type CalendarCategory = "ceremony" | "reception" | "vendor" | "task";

export interface CalendarEvent {
  id: string;
  title: string;
  category: CalendarCategory;
  /** yyyy-mm-dd (the user's local date) */
  date: string;
  /** HH:mm, 24-hour */
  time: string;
  location: string;
  notes?: string;
  /** Set once the event has been copied to the user's Google Calendar */
  googleEventId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CalendarEventInput {
  title: string;
  category: CalendarCategory;
  date: string;
  time: string;
  location: string;
  notes?: string;
}

export interface GoogleCalendarStatus {
  connected: boolean;
  /** The Google account events are copied to */
  email?: string;
}
