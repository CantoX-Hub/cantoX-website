"use client";

import { useId } from "react";
import { Drawer, IconButton, LinearProgress, TextField, type TextFieldProps } from "@mui/material";
import { Info, PencilLine, X } from "lucide-react";
import { PiUsersThreeDuotone } from "react-icons/pi";
import type { ContactChannel, Guest, GuestList, GuestStatus } from "@/app/types/guest.types";

/* ---------- Status ---------- */

export const STATUS_META: Record<GuestStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-[#E7F8EE] text-[#16A34A]" },
  pending: { label: "Pending", className: "bg-[#FFF4D6] text-[#D97706]" },
  declined: { label: "Declined", className: "bg-[#FDE8E8] text-[#DC2626]" },
  not_invited: { label: "Not invited", className: "bg-[#F1F3F6] text-[#374151]" },
};

export const STATUS_ORDER: GuestStatus[] = ["confirmed", "pending", "declined", "not_invited"];

export function StatusChip({ status }: { status: GuestStatus }) {
  const { label, className } = STATUS_META[status];
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] ${className}`}>⁕ {label}</span>;
}

export function TableChip({ name }: { name?: string }) {
  return name ? (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#F1F3F6] px-3 py-1 text-[13px] text-[#0F0F0F]"># {name}</span>
  ) : (
    <span className="text-[13px] text-[#9CA3AF]">Not assigned</span>
  );
}

export function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export function GuestAvatar({ name }: { name: string }) {
  return (
    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[13px] font-semibold text-[#0F0F0F]">
      {initialsOf(name)}
    </span>
  );
}

/* ---------- Contacts & invites ---------- */

export const CHANNEL_LABEL: Record<ContactChannel, string> = { whatsapp: "Whatsapp", sms: "SMS", email: "Email" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Error message, or undefined when the contact is fine */
export function contactError(channel: ContactChannel, value: string): string | undefined {
  const v = value.trim();
  if (!v) return channel === "email" ? "Add the guest's email." : "Add the guest's phone number.";
  if (channel === "email") return EMAIL.test(v) ? undefined : "Enter a valid email address.";
  if (!/^\+?[\d\s()-]+$/.test(v)) return "Use digits only, e.g. 0818 829 8033.";
  const digits = v.replace(/\D/g, "").length;
  return digits >= 10 && digits <= 15 ? undefined : "Enter a valid phone number.";
}

/** "0818 829 8033" → "2348188298033" (wa.me needs the country code) */
export function internationalDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) return `234${d.slice(1)}`;
  return d;
}

export const rsvpPath = (listId: string) => `/rsvp/${encodeURIComponent(listId)}`;

export function inviteMessage(guest: Pick<Guest, "name">, list: Pick<GuestList, "id" | "name" | "eventLabel">) {
  const first = guest.name.trim().split(/\s+/)[0];
  const event = list.eventLabel ?? list.name;
  return `Hi ${first}, you're invited to ${event}! Please let us know if you can make it: ${window.location.origin}${rsvpPath(list.id)}`;
}

/** Link that opens WhatsApp / Messages / email with the invite written out */
export function inviteHref(guest: Pick<Guest, "name" | "channel" | "contact">, list: Pick<GuestList, "id" | "name" | "eventLabel">) {
  const text = encodeURIComponent(inviteMessage(guest, list));
  if (guest.channel === "whatsapp") return `https://wa.me/${internationalDigits(guest.contact)}?text=${text}`;
  if (guest.channel === "sms") return `sms:${guest.contact.replace(/[^\d+]/g, "")}?body=${text}`;
  return `mailto:${guest.contact.trim()}?subject=${encodeURIComponent("You're invited")}&body=${text}`;
}

/* ---------- Form bits ---------- */

export function Field({ label, hint, id: givenId, ...props }: { label: React.ReactNode; hint?: string } & TextFieldProps) {
  const generated = useId();
  const id = givenId ?? generated;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-[#0F0F0F]">
        {label}
        {hint && <span className="font-normal text-[#6B7280]"> {hint}</span>}
      </label>
      <TextField id={id} fullWidth size="small" {...props} />
    </div>
  );
}

/** Radio styled as a bordered pill, as in the designs */
export function ChoicePill({ checked, label, onSelect, name }: { checked: boolean; label: string; onSelect: () => void; name: string }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-[13px] transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[#C99532] ${
        checked ? "border-[#C99532] text-[#C99532]" : "border-[#E2E5EA] text-[#0F0F0F] hover:border-[#C9CED6]"
      }`}
    >
      {/* onClick (not onChange) so tapping the selected pill can clear it; arrow keys also fire click */}
      <input type="radio" name={name} checked={checked} onChange={() => {}} onClick={onSelect} className="sr-only" />
      <span aria-hidden className={`flex h-4 w-4 items-center justify-center rounded-full border ${checked ? "border-[#C99532]" : "border-[#9CA3AF]"}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-[#C99532]" />}
      </span>
      {label}
    </label>
  );
}

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2 border-t border-[#E8E8EC] pt-4 text-[12px] leading-5 text-[#6B7280]">
      <Info size={14} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

/** Right-hand panel used for every create / edit form on this page */
export function SidePanel({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer: React.ReactNode;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const titleId = useId();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 520 } }, "aria-labelledby": titleId } as object }}
    >
      <form onSubmit={onSubmit} noValidate className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-[#E8E8EC] px-5 py-5">
          <div>
            <h2 id={titleId} className="text-[18px] font-semibold text-[#0F0F0F]">
              {title}
            </h2>
            {description && <p className="mt-1 text-[14px] leading-6 text-[#4B5563]">{description}</p>}
          </div>
          <IconButton onClick={onClose} aria-label="Close" edge="end">
            <X size={18} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">{children}</div>
        </div>
        <div className="flex justify-end gap-3 border-t border-[#E8E8EC] px-5 py-4">{footer}</div>
      </form>
    </Drawer>
  );
}

/* ---------- Capacity banner ---------- */

/** The gold flourish on the right of the banner */
function Flourish() {
  return (
    <svg aria-hidden viewBox="0 0 440 160" preserveAspectRatio="xMaxYMid slice" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[55%] max-w-[480px]">
      <g fill="none" stroke="#C99532" strokeWidth="22" strokeLinecap="round" opacity="0.9">
        <path d="M40 175 C 150 90, 250 -10, 270 10 C 290 35, 160 140, 150 175" />
        <path d="M200 175 C 300 80, 380 0, 430 -20" />
        <path d="M330 175 C 380 120, 430 80, 470 60" />
      </g>
    </svg>
  );
}

export function CapacityBanner({ count, capacity, onEdit }: { count: number; capacity: number; onEdit: () => void }) {
  const pct = capacity > 0 ? Math.min(100, (count / capacity) * 100) : 0;
  const full = count >= capacity;
  return (
    <section className="relative overflow-hidden rounded-xl bg-[#060D18] px-4 py-6 text-white sm:px-5" aria-label="Guest capacity">
      <Flourish />
      <div className="relative max-w-[540px]">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <h2 className="text-[16px]" style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif' }}>
            Guest capacity
          </h2>
          <p className="flex items-center gap-2 text-[24px] font-semibold tabular-nums">
            <PiUsersThreeDuotone className="text-[#C99532]" size={22} />
            {count}/{capacity}
          </p>
          <button type="button" onClick={onEdit} className="ml-auto flex items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white">
            Edit capacity <PencilLine size={14} />
          </button>
        </div>
        <LinearProgress
          variant="determinate"
          value={pct}
          aria-label={`${count} of ${capacity} guests`}
          sx={{ mt: 2.5, height: 3, borderRadius: 2, bgcolor: "#FFFFFF", "& .MuiLinearProgress-bar": { bgcolor: full ? "#DC2626" : "#C99532" } }}
        />
        <p className="mt-3 text-[13px] text-white/70">
          {full ? "You've reached your venue limit. Edit capacity to add more guests." : "Every guest you add counts toward your total. Stay accountable to your venue limit."}
        </p>
      </div>
    </section>
  );
}
