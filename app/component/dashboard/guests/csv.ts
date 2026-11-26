import type { ContactChannel, GuestInput, GuestList, GuestSide } from "@/app/types/guest.types";
import { contactError } from "./shared";

/** Minimal RFC 4180 parser: quoted fields, escaped quotes, commas/semicolons, CRLF */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  // Excel in some locales saves with semicolons
  const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"' && field === "") quoted = true; // quotes only open at the start of a field
    else if (c === sep) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.map((r) => r.map((f) => f.trim())).filter((r) => r.some(Boolean));
}

export const TEMPLATE_CSV = "name,contact,table,side\nBen Carter,08188298033,Table 001,groom\nFiona Grant,fiona@example.com,2,bride\nAlice Johnson,08101779104,,\n";

const COLUMN_ALIASES: Record<keyof ParsedColumns, RegExp> = {
  name: /^(name|guest|guest name|full name)$/,
  contact: /^(contact|phone|phone number|whatsapp|email|mobile)$/,
  table: /^(table|table number)$/,
  side: /^(side|guest side)$/,
  channel: /^(channel|send via|via)$/,
};

interface ParsedColumns {
  name: number;
  contact: number;
  table: number;
  side: number;
  channel: number;
}

export interface UploadRow {
  line: number;
  guest: GuestInput;
  tableLabel?: string;
  /** Why the row can't be added */
  error?: string;
  /** Added, but something was adjusted (e.g. table full, left unassigned) */
  warning?: string;
}

function sideOf(v: string): GuestSide | undefined {
  const s = v.toLowerCase();
  if (s.startsWith("b")) return "bride";
  if (s.startsWith("g")) return "groom";
  if (s.startsWith("c")) return "casual";
  return undefined;
}

function channelOf(v: string, contact: string): ContactChannel {
  const s = v.toLowerCase();
  if (s.includes("mail") || contact.includes("@")) return "email";
  if (s.includes("sms") || s.includes("text")) return "sms";
  return "whatsapp";
}

const contactKey = (c: string) => (c.includes("@") ? c.trim().toLowerCase() : c.replace(/\D/g, "").slice(-10));

/** Turns CSV rows into guests for `list`, checking contacts, duplicates and table space */
export function rowsToGuests(rows: string[][], list: GuestList): UploadRow[] {
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const hasHeader = header.some((h) => COLUMN_ALIASES.name.test(h) || COLUMN_ALIASES.contact.test(h));
  const col: ParsedColumns = hasHeader
    ? (Object.fromEntries(Object.entries(COLUMN_ALIASES).map(([k, re]) => [k, header.findIndex((h) => re.test(h))])) as unknown as ParsedColumns)
    : { name: 0, contact: 1, table: 2, side: 3, channel: -1 };

  const seen = new Set(list.guests.map((g) => contactKey(g.contact)));
  const seats = new Map(list.tables.map((t) => [t.id, list.guests.filter((g) => g.tableId === t.id).length]));
  const tableByNumber = new Map(list.tables.map((t) => [Number(t.name.replace(/\D/g, "")), t]));

  return rows.slice(hasHeader ? 1 : 0).map((r, i) => {
    const get = (k: keyof ParsedColumns) => (col[k] >= 0 ? r[col[k]] ?? "" : "");
    const name = get("name");
    const contact = get("contact");
    const channel = channelOf(get("channel"), contact);
    const row: UploadRow = { line: i + (hasHeader ? 2 : 1), guest: { name, channel, contact, side: sideOf(get("side")) } };

    if (!name) return { ...row, error: "Missing name" };
    const cErr = contactError(channel, contact);
    if (cErr) return { ...row, error: cErr.replace("the guest's ", "") };
    const key = contactKey(contact);
    if (seen.has(key)) return { ...row, error: "Contact is already on the list" };
    seen.add(key);

    const rawTable = get("table");
    if (rawTable) {
      const table = tableByNumber.get(Number(rawTable.replace(/\D/g, "")));
      if (!table) return { ...row, tableLabel: rawTable, warning: `${rawTable} doesn't exist yet, so this guest is unassigned` };
      const taken = seats.get(table.id) ?? 0;
      if (taken >= list.tableCapacity) return { ...row, tableLabel: table.name, warning: `${table.name} is full, so this guest is unassigned` };
      seats.set(table.id, taken + 1);
      return { ...row, tableLabel: table.name, guest: { ...row.guest, tableId: table.id } };
    }
    return row;
  });
}
