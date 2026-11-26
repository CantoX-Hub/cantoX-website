export type GuestStatus = "confirmed" | "pending" | "declined" | "not_invited";
export type ContactChannel = "whatsapp" | "sms" | "email";
export type GuestSide = "bride" | "groom" | "casual";

export interface GuestTable {
  id: string;
  /** "Table 001" */
  name: string;
}

export interface Guest {
  id: string;
  name: string;
  /** How the invite is sent */
  channel: ContactChannel;
  /** Phone number (whatsapp / sms) or email address */
  contact: string;
  side?: GuestSide;
  tableId?: string;
  status: GuestStatus;
  /** ms since epoch */
  invitedAt?: number;
  respondedAt?: number;
  createdAt: number;
}

export interface GuestList {
  id: string;
  /** "Walby's guests" */
  name: string;
  /** Venue limit: guests can't be added past this */
  expectedGuests: number;
  /** Seats per table */
  tableCapacity: number;
  eventId?: string;
  eventLabel?: string;
  tables: GuestTable[];
  guests: Guest[];
  createdAt: number;
  updatedAt: number;
  openedAt: number;
}

/** What the public RSVP page gets back: one guest at most, no contacts */
export interface RsvpLookup {
  listName: string;
  eventLabel?: string;
  guest: { id: string; name: string; status: GuestStatus; table?: string } | null;
}

export type GuestListInput = Pick<GuestList, "name" | "expectedGuests" | "tableCapacity" | "eventId" | "eventLabel">;
export type GuestInput = Pick<Guest, "name" | "channel" | "contact" | "side" | "tableId">;
