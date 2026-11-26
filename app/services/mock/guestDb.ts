/**
 * Stand-in for the guest-list API, kept in localStorage. Only services/api.ts
 * should import this; delete it once the backend has guest endpoints.
 * Rules the backend should also enforce live here: venue capacity, full
 * tables and duplicate contacts.
 */
import type { Guest, GuestInput, GuestList, GuestListInput, GuestStatus, GuestTable, RsvpLookup } from "@/app/types/guest.types";

const KEY = "cantox:guest-lists";
const DAY = 86_400_000;
/** Tables made up front; more can be added from the Add guest panel */
const INITIAL_TABLES_MAX = 12;

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
export const tableName = (n: number) => `Table ${String(n).padStart(3, "0")}`;

function makeTables(count: number, start = 1): GuestTable[] {
  return Array.from({ length: count }, (_, i) => ({ id: uid("tbl"), name: tableName(start + i) }));
}

function seed(): GuestList[] {
  const now = Date.now();
  const tables = makeTables(8);
  const g = (name: string, contact: string, table: number, status: GuestStatus, side?: Guest["side"]): Guest => ({
    id: uid("gst"),
    name,
    channel: "whatsapp",
    contact,
    side,
    tableId: tables[table - 1].id,
    status,
    invitedAt: status === "not_invited" ? undefined : now - 3 * DAY,
    respondedAt: status === "confirmed" || status === "declined" ? now - DAY : undefined,
    createdAt: now - 4 * DAY,
  });
  const base = { tableCapacity: 8, createdAt: now - 7 * DAY, updatedAt: now - 2 * DAY };
  return [
    {
      ...base,
      id: "walbys-guests",
      name: "Walby’s guests",
      expectedGuests: 300,
      tables,
      guests: [
        g("Ben Carter", "08188298033", 1, "confirmed", "groom"),
        g("Fiona Grant", "08058294025", 2, "pending", "bride"),
        g("Alice Johnson", "08101779104", 1, "not_invited", "bride"),
        g("Precious Joel", "08023132532", 3, "confirmed", "casual"),
        g("Alicia Trey", "08011091023", 1, "declined", "bride"),
        g("John Doe", "08183326663", 3, "confirmed", "groom"),
        g("Tolu Bankole", "08034561122", 2, "pending", "groom"),
      ],
      openedAt: now - 2 * DAY,
    },
    { ...base, id: uid("gl"), name: "Wedding guests", expectedGuests: 200, tables: makeTables(INITIAL_TABLES_MAX), guests: [], openedAt: now - 3 * DAY },
    { ...base, id: uid("gl"), name: "Rayo&Moyo", expectedGuests: 150, tables: makeTables(INITIAL_TABLES_MAX), guests: [], openedAt: now - 4 * DAY },
    { ...base, id: uid("gl"), name: "End of year party", expectedGuests: 80, tableCapacity: 10, tables: makeTables(8), guests: [], openedAt: now - 5 * DAY },
  ];
}

function readAll(): GuestList[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) {
      const initial = seed();
      writeAll(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuestList[]) : [];
  } catch {
    return [];
  }
}

function writeAll(lists: GuestList[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lists));
  } catch {
    throw new Error("Your browser storage is full, so we couldn't save.");
  }
}

/** Loads a list, lets `fn` change it, saves. Returns the updated list. */
function mutate(id: string, fn: (list: GuestList) => void, touch = true): GuestList | undefined {
  const all = readAll();
  const list = all.find((l) => l.id === id);
  if (!list) return undefined;
  fn(list);
  if (touch) list.updatedAt = Date.now();
  writeAll(all);
  return list;
}

const contactKey = (c: string) => (c.includes("@") ? c.trim().toLowerCase() : c.replace(/\D/g, "").slice(-10));

export const seatsTaken = (list: GuestList, tableId: string) => list.guests.filter((g) => g.tableId === tableId).length;

function checkTable(list: GuestList, tableId: string | undefined, guestId?: string) {
  if (!tableId) return;
  const table = list.tables.find((t) => t.id === tableId);
  if (!table) throw new Error("That table no longer exists.");
  const taken = list.guests.filter((g) => g.tableId === tableId && g.id !== guestId).length;
  if (taken >= list.tableCapacity) throw new Error(`${table.name} is full.`);
}

function checkDuplicate(list: GuestList, contact: string, guestId?: string) {
  const key = contactKey(contact);
  const twin = list.guests.find((g) => g.id !== guestId && contactKey(g.contact) === key);
  if (twin) throw new Error(`${twin.name} already uses ${contact} on this list.`);
}

export const guestDb = {
  /** Most recently opened first */
  list(): GuestList[] {
    return readAll().sort((a, b) => b.openedAt - a.openedAt);
  },

  get(id: string): GuestList | undefined {
    return readAll().find((l) => l.id === id);
  },

  create(input: GuestListInput): GuestList {
    const now = Date.now();
    const tableCount = Math.min(Math.ceil(input.expectedGuests / input.tableCapacity), INITIAL_TABLES_MAX);
    const list: GuestList = { ...input, id: uid("gl"), tables: makeTables(tableCount), guests: [], createdAt: now, updatedAt: now, openedAt: now };
    writeAll([list, ...readAll()]);
    return list;
  },

  update(id: string, input: Partial<GuestListInput>): GuestList | undefined {
    return mutate(id, (list) => {
      if (input.expectedGuests !== undefined && input.expectedGuests < list.guests.length) {
        throw new Error(`You already have ${list.guests.length} guests. Capacity can't be lower than that.`);
      }
      if (input.tableCapacity !== undefined) {
        const fullest = Math.max(0, ...list.tables.map((t) => seatsTaken(list, t.id)));
        if (input.tableCapacity < fullest) throw new Error(`A table already has ${fullest} guests. Seats per table can't be lower than that.`);
      }
      Object.assign(list, input);
    });
  },

  remove(id: string) {
    writeAll(readAll().filter((l) => l.id !== id));
  },

  open(id: string) {
    mutate(id, (list) => void (list.openedAt = Date.now()), false);
  },

  addTable(id: string): GuestList | undefined {
    return mutate(id, (list) => {
      const highest = Math.max(0, ...list.tables.map((t) => Number(t.name.replace(/\D/g, "")) || 0));
      list.tables.push(...makeTables(1, highest + 1));
    });
  },

  /** Adds guests; `invite` marks them as invited (pending) straight away */
  addGuests(id: string, inputs: GuestInput[], invite: boolean): GuestList | undefined {
    return mutate(id, (list) => {
      if (list.guests.length + inputs.length > list.expectedGuests) {
        const left = list.expectedGuests - list.guests.length;
        throw new Error(left > 0 ? `Only ${left} more guest${left === 1 ? "" : "s"} fit your capacity of ${list.expectedGuests}.` : `You've reached your guest capacity of ${list.expectedGuests}. Edit capacity to add more.`);
      }
      const now = Date.now();
      for (const input of inputs) {
        checkDuplicate(list, input.contact);
        checkTable(list, input.tableId);
        list.guests.push({ ...input, id: uid("gst"), status: invite ? "pending" : "not_invited", invitedAt: invite ? now : undefined, createdAt: now });
      }
    });
  },

  updateGuest(id: string, guestId: string, input: GuestInput, invite: boolean): GuestList | undefined {
    return mutate(id, (list) => {
      const guest = list.guests.find((g) => g.id === guestId);
      if (!guest) throw new Error("This guest was removed.");
      checkDuplicate(list, input.contact, guestId);
      checkTable(list, input.tableId, guestId);
      Object.assign(guest, input);
      if (invite) Object.assign(guest, { status: "pending", invitedAt: Date.now() });
    });
  },

  deleteGuests(id: string, guestIds: string[]): GuestList | undefined {
    return mutate(id, (list) => {
      list.guests = list.guests.filter((g) => !guestIds.includes(g.id));
    });
  },

  /** Marks guests as invited. Confirmed guests are left alone. */
  invite(id: string, guestIds: string[]): GuestList | undefined {
    return mutate(id, (list) => {
      const now = Date.now();
      list.guests.forEach((g) => {
        if (guestIds.includes(g.id) && g.status !== "confirmed") Object.assign(g, { status: "pending", invitedAt: now, respondedAt: undefined });
      });
    });
  },

  /**
   * Public RSVP page: finds one guest by full name or phone/email, and returns
   * only what that guest needs (never the whole list or other contacts).
   */
  lookup(id: string, query: string): RsvpLookup | undefined {
    const list = readAll().find((l) => l.id === id);
    if (!list) return undefined;
    const q = query.trim().toLowerCase().replace(/\s+/g, " ");
    const key = contactKey(query);
    const guest = q
      ? list.guests.find((g) => g.name.toLowerCase().replace(/\s+/g, " ") === q || (key.length >= 7 && contactKey(g.contact) === key))
      : undefined;
    return {
      listName: list.name,
      eventLabel: list.eventLabel,
      guest: guest ? { id: guest.id, name: guest.name, status: guest.status, table: list.tables.find((t) => t.id === guest.tableId)?.name } : null,
    };
  },

  /** Public RSVP page: a guest confirms or declines */
  respond(id: string, guestId: string, status: "confirmed" | "declined"): GuestList | undefined {
    return mutate(id, (list) => {
      const guest = list.guests.find((g) => g.id === guestId);
      if (!guest) throw new Error("We couldn't find you on this guest list.");
      Object.assign(guest, { status, respondedAt: Date.now() });
    });
  },
};
