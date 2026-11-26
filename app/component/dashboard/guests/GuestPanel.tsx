"use client";

import { useEffect, useState } from "react";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useAddGuestTableMutation, useAddGuestsMutation, useUpdateGuestListMutation, useUpdateGuestMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { ContactChannel, Guest, GuestInput, GuestList, GuestSide } from "@/app/types/guest.types";
import { useToast } from "../Toast";
import { CHANNEL_LABEL, ChoicePill, Field, InfoNote, SidePanel, contactError, inviteHref } from "./shared";

const SIDES: { id: GuestSide; label: string }[] = [
  { id: "bride", label: "Bride’s side" },
  { id: "groom", label: "Groom’s side" },
  { id: "casual", label: "Casual" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  list: GuestList;
  /** Edit this guest; omit to add one */
  guest?: Guest;
}

export default function GuestPanel({ open, onClose, list, guest }: Props) {
  const notify = useToast();
  const [addGuests, { isLoading: adding }] = useAddGuestsMutation();
  const [updateGuest, { isLoading: updating }] = useUpdateGuestMutation();
  const [addTable, { isLoading: addingTable }] = useAddGuestTableMutation();
  const [updateList, { isLoading: applying }] = useUpdateGuestListMutation();

  const [name, setName] = useState("");
  const [channel, setChannel] = useState<ContactChannel>("whatsapp");
  const [contact, setContact] = useState("");
  const [side, setSide] = useState<GuestSide | undefined>();
  const [tableId, setTableId] = useState<string | undefined>();
  const [showSeats, setShowSeats] = useState(false);
  const [seats, setSeats] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setName(guest?.name ?? "");
    setChannel(guest?.channel ?? "whatsapp");
    setContact(guest?.contact ?? "");
    setSide(guest?.side);
    setTableId(guest?.tableId);
    setShowSeats(false);
    setSeats(String(list.tableCapacity));
    setErrors({});
    // Only when (re)opening, not on every list refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, guest?.id]);

  const cap = list.tableCapacity;
  /** Seats taken by other guests (this guest's own seat doesn't block them) */
  const takenByOthers = (id: string) => list.guests.filter((g) => g.tableId === id && g.id !== guest?.id).length;
  const atCapacity = !guest && list.guests.length >= list.expectedGuests;
  const canInvite = !guest || guest.status === "not_invited" || guest.status === "declined";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invite = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("data-intent") === "invite";
    const found: Record<string, string> = {};
    if (!name.trim()) found.name = "Add the guest's name.";
    const cErr = contactError(channel, contact);
    if (cErr) found.contact = cErr;
    setErrors(found);
    if (Object.keys(found).length) return;

    const input: GuestInput = { name: name.trim(), channel, contact: contact.trim(), side, tableId };
    try {
      if (guest) await updateGuest({ id: list.id, guestId: guest.id, guest: input, invite }).unwrap();
      else await addGuests({ id: list.id, guests: [input], invite }).unwrap();
      onClose();
      if (invite) {
        // Opening WhatsApp / Messages needs a tap, so offer it from the toast
        const href = inviteHref(input, list);
        notify(`${input.name} is marked as invited`, { actionLabel: `Send on ${CHANNEL_LABEL[channel]}`, onAction: () => window.open(href, "_blank", "noopener") });
      } else {
        notify(guest ? "Guest updated" : `${input.name} added`);
      }
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  const applySeats = async () => {
    const n = Number(seats);
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      setErrors((x) => ({ ...x, seats: "Enter a number from 1 to 50." }));
      return;
    }
    try {
      await updateList({ id: list.id, input: { tableCapacity: n } }).unwrap();
      setErrors(({ seats: _drop, ...rest }) => rest);
      notify(`Tables now seat ${n}`);
    } catch (err) {
      setErrors((x) => ({ ...x, seats: getErrorMessage(err) }));
    }
  };

  const saving = adding || updating;
  const err = (k: string) => (errors[k] ? { error: true, helperText: errors[k] } : {});

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      onSubmit={submit}
      title={guest ? "Edit guest" : "Add guests"}
      description="Add your guests, manage their details, and assign them to tables for a smooth and organized seating arrangement."
      footer={
        <>
          <Button type="submit" data-intent="save" variant="outlined" color="inherit" disabled={saving || atCapacity} sx={{ borderColor: "#D1D5DB" }}>
            {guest ? "Save changes" : "Save guest"}
          </Button>
          {canInvite && (
            <Button type="submit" data-intent="invite" variant="contained" disabled={saving || atCapacity}>
              Save &amp; send invite
            </Button>
          )}
        </>
      }
    >
      {atCapacity && (
        <p role="alert" className="rounded-md bg-[#FDE8E8] px-3 py-2 text-[13px] text-[#B91C1C]">
          You&apos;ve reached your guest capacity of {list.expectedGuests}. Edit capacity to add more guests.
        </p>
      )}

      <Field label="Guest name" placeholder="eg. Precious Abiodun" value={name} onChange={(e) => setName(e.target.value)} slotProps={{ htmlInput: { maxLength: 80 } }} autoFocus {...err("name")} />

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-1.5 text-[14px] font-medium text-[#0F0F0F]">Contact details</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CHANNEL_LABEL) as ContactChannel[]).map((c) => (
            <ChoicePill key={c} name="channel" label={CHANNEL_LABEL[c]} checked={channel === c} onSelect={() => setChannel(c)} />
          ))}
        </div>
        <TextField
          fullWidth
          size="small"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={channel === "email" ? "eg. precious@email.com" : "+234 818 829 8033"}
          type={channel === "email" ? "email" : "tel"}
          inputMode={channel === "email" ? "email" : "tel"}
          slotProps={{ htmlInput: { "aria-label": channel === "email" ? "Guest email" : "Guest phone number", maxLength: 80 } }}
          {...err("contact")}
        />
      </fieldset>

      <div className="border-t border-[#E8E8EC] pt-4">
        <p id="guest-side-label" className="mb-2 text-[14px] font-medium text-[#0F0F0F]">
          Guest side <span className="font-normal text-[#6B7280]">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="guest-side-label">
          {SIDES.map((s) => (
            <ChoicePill key={s.id} name="side" label={s.label} checked={side === s.id} onSelect={() => setSide(side === s.id ? undefined : s.id)} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1">
          <p className="text-[14px] font-medium text-[#0F0F0F]">
            Assign table <span className="font-normal text-[#6B7280]">(you can also do this later)</span>
          </p>
          <Tooltip title="Seats per table">
            <IconButton size="small" onClick={() => setShowSeats((s) => !s)} aria-label="Change seats per table" aria-expanded={showSeats} sx={{ color: "#C99532" }}>
              <SlidersHorizontal size={16} />
            </IconButton>
          </Tooltip>
        </div>

        {showSeats && (
          <div className="mb-3 flex flex-wrap items-start gap-3">
            <label htmlFor="seats-per-table" className="pt-2 text-[14px] font-medium text-[#0F0F0F]">
              How many guests do you want on a table?
            </label>
            <TextField
              id="seats-per-table"
              size="small"
              value={seats}
              inputMode="numeric"
              onChange={(e) => setSeats(e.target.value.replace(/\D/g, "").slice(0, 2))}
              sx={{ width: 110 }}
              {...err("seats")}
            />
            <Button onClick={applySeats} disabled={applying} sx={{ color: "#C99532", fontWeight: 600 }}>
              Apply
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Table">
          {list.tables.map((t) => {
            const others = takenByOthers(t.id);
            const selected = tableId === t.id;
            const shown = others + (selected ? 1 : 0);
            const full = others >= cap;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={full && !selected}
                onClick={() => setTableId(selected ? undefined : t.id)}
                className={`relative overflow-hidden rounded-md border px-3 pb-2.5 pt-2 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected ? "border-[#C99532]" : "border-[#E2E5EA] hover:border-[#C9CED6]"
                }`}
              >
                <span className="text-[#0F0F0F]">{t.name}</span> <span className="text-[#6B7280]">({shown}/{cap})</span>
                <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-[2px] rounded bg-[#F1F3F6]">
                  <span className="block h-full rounded bg-[#C99532]" style={{ width: `${Math.min(100, (shown / cap) * 100)}%` }} />
                </span>
              </button>
            );
          })}
          <Button
            onClick={() => addTable(list.id).unwrap().catch((e) => notify(getErrorMessage(e), { severity: "error" }))}
            disabled={addingTable}
            endIcon={<Plus size={14} />}
            sx={{ bgcolor: "#F1F4F8", color: "#0F0F0F", borderRadius: 999, px: 2, "&:hover": { bgcolor: "#E5EAF1" } }}
          >
            Add table
          </Button>
        </div>
      </div>

      <InfoNote>Tables fill up as you assign guests. Full tables are disabled automatically to keep your seating accurate.</InfoNote>
    </SidePanel>
  );
}
