"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  type TextFieldProps,
} from "@mui/material";
import { Banknote, ChevronUp, Eye, Gift, PencilLine, Plus, Settings2, Share2, Trash2, X } from "lucide-react";
import { useCreateWishlistMutation, useUpdateWishlistMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import type { BankAccount, Wishlist, WishlistInput } from "@/app/types/wishlist.types";
import WishlistView from "@/app/component/wishlist/WishlistView";
import { useToast } from "../Toast";
import { useEventOptions } from "../useEventOptions";
import { INTERNATIONAL_BANKS, LOCAL_BANKS, useShareWishlist } from "./shared";

type AccountKind = "local" | "international";

interface ProductRow {
  id: string;
  name: string;
  link: string;
}

interface FormState {
  name: string;
  products: ProductRow[];
  accounts: Record<AccountKind, BankAccount>;
  eventId: string;
}

type Errors = Partial<Record<string, string>>;

const EMPTY_ACCOUNT: BankAccount = { accountNumber: "", accountName: "", bank: "" };
const rowId = () => `item-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const emptyRow = (): ProductRow => ({ id: rowId(), name: "", link: "" });

function initialState(w?: Wishlist): FormState {
  return {
    name: w?.name ?? "",
    products: w?.items.length ? w.items.map((i) => ({ id: i.id, name: i.name, link: i.link ?? "" })) : [emptyRow(), emptyRow()],
    accounts: {
      local: w?.cash.local ?? EMPTY_ACCOUNT,
      international: w?.cash.international ?? EMPTY_ACCOUNT,
    },
    eventId: w?.eventId ?? "",
  };
}

/** Adds https:// when missing; undefined when it isn't a usable web address */
function normaliseLink(raw: string): string | undefined {
  const s = raw.trim();
  if (!s) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    return url.hostname.includes(".") ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const accountFilled = (a: BankAccount) => !!(a.accountNumber.trim() || a.accountName.trim() || a.bank.trim());

function validate(s: FormState): Errors {
  const e: Errors = {};
  if (!s.name.trim()) e.name = "Give your wishlist a name.";
  s.products.forEach((p) => {
    if (!p.name.trim() && p.link.trim()) e[`${p.id}.name`] = "Add the product name.";
    if (p.link.trim() && !normaliseLink(p.link)) e[`${p.id}.link`] = "Enter a valid link, e.g. jumia.com.ng/…";
  });
  (["local", "international"] as const).forEach((kind) => {
    const a = s.accounts[kind];
    if (!accountFilled(a)) return;
    if (!a.accountNumber.trim()) e[`${kind}.accountNumber`] = "Add the account number.";
    else if (kind === "local" && !/^\d{10}$/.test(a.accountNumber.trim())) e[`${kind}.accountNumber`] = "Nigerian account numbers have 10 digits.";
    if (!a.accountName.trim()) e[`${kind}.accountName`] = "Add the account name.";
    if (!a.bank.trim()) e[`${kind}.bank`] = "Choose the bank.";
  });
  const hasProduct = s.products.some((p) => p.name.trim());
  const hasCash = accountFilled(s.accounts.local) || accountFilled(s.accounts.international);
  if (!hasProduct && !hasCash) e.form = "Add at least one product or a cash gift account.";
  return e;
}

/* ---------- Layout helpers ---------- */

function Section({ icon: Icon, title, children }: { icon: typeof Gift; title: string; children: React.ReactNode }) {
  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      square
      sx={{ bgcolor: "transparent", "&::before": { display: "none" } }}
    >
      <AccordionSummary expandIcon={<ChevronUp size={16} />} sx={{ px: 1.5, minHeight: 48, borderBottom: "1px solid #0F0F0F", "& .MuiAccordionSummary-expandIconWrapper": { transform: "rotate(180deg)" }, "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": { transform: "rotate(0deg)" } }}>
        <span className="flex items-center gap-2 text-[14px] font-medium text-[#0F0F0F]">
          <Icon size={16} /> {title}
        </span>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 2, pb: 3 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

function Field({ label, id: givenId, ...props }: { label: string } & TextFieldProps) {
  const generated = useId();
  const id = givenId ?? generated;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-[14px] font-medium text-[#0F0F0F]">
        {label}
      </label>
      <TextField id={id} fullWidth size="small" {...props} />
    </div>
  );
}

/* ---------- Form ---------- */

export default function WishlistForm({ wishlist }: { wishlist?: Wishlist }) {
  const router = useRouter();
  const notify = useToast();
  const share = useShareWishlist();
  const [createWishlist, { isLoading: creating }] = useCreateWishlistMutation();
  const [updateWishlist, { isLoading: updating }] = useUpdateWishlistMutation();

  const [state, setState] = useState<FormState>(() => initialState(wishlist));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [bankTab, setBankTab] = useState<AccountKind>(wishlist?.cash.international && !wishlist.cash.local ? "international" : "local");
  const [previewOpen, setPreviewOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const saving = creating || updating;

  // Re-check as the user fixes things, once they've tried to submit
  useEffect(() => {
    if (submitted) setErrors(validate(state));
  }, [state, submitted]);

  const eventOptions = useEventOptions({ id: wishlist?.eventId, label: wishlist?.eventLabel });

  const setProduct = (id: string, patch: Partial<ProductRow>) =>
    setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  const setAccount = (kind: AccountKind, patch: Partial<BankAccount>) =>
    setState((s) => ({ ...s, accounts: { ...s.accounts, [kind]: { ...s.accounts[kind], ...patch } } }));

  const toInput = (): WishlistInput => {
    const clean = (a: BankAccount) => (accountFilled(a) ? { accountNumber: a.accountNumber.trim(), accountName: a.accountName.trim(), bank: a.bank.trim() } : undefined);
    const previous = new Map(wishlist?.items.map((i) => [i.id, i]));
    return {
      name: state.name.trim(),
      message: wishlist?.message,
      items: state.products
        .filter((p) => p.name.trim())
        .map((p) => ({ ...previous.get(p.id), id: p.id, name: p.name.trim(), link: normaliseLink(p.link) })),
      cash: { local: clean(state.accounts.local), international: clean(state.accounts.international) },
      eventId: state.eventId || undefined,
      eventLabel: eventOptions.find((o) => o.id === state.eventId)?.label,
    };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(state);
    setErrors(found);
    if (Object.keys(found).length) {
      if (found.name) nameRef.current?.focus();
      // Show the bank tab that has the problem
      const bad = (["local", "international"] as const).find((k) => Object.keys(found).some((key) => key.startsWith(`${k}.`)));
      if (bad) setBankTab(bad);
      return;
    }
    try {
      const input = toInput();
      const saved = wishlist ? await updateWishlist({ id: wishlist.id, input }).unwrap() : await createWishlist(input).unwrap();
      notify(wishlist ? "Wishlist updated" : "Wishlist created");
      router.push(`/dashboard/wishlist/${encodeURIComponent(saved.id)}`);
    } catch (err) {
      notify(getErrorMessage(err), { severity: "error" });
    }
  };

  const account = state.accounts[bankTab];
  const err = (key: string) => (errors[key] ? { error: true, helperText: errors[key] } : {});
  const preview = toInput();

  return (
    <form onSubmit={submit} noValidate>
      {/* Title + actions */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <input
              ref={nameRef}
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              placeholder="Wishlist name"
              aria-label="Wishlist name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "wishlist-name-error" : undefined}
              maxLength={80}
              className="w-full min-w-0 max-w-[460px] bg-transparent text-[24px] text-[#0F0F0F] outline-none placeholder:text-[#B6CBE0] focus:border-b focus:border-[#C99532]"
              style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif', fieldSizing: "content" } as React.CSSProperties}
            />
            <IconButton size="small" onClick={() => nameRef.current?.focus()} aria-label="Edit wishlist name">
              <PencilLine size={18} />
            </IconButton>
          </div>
          {errors.name && (
            <p id="wishlist-name-error" className="mt-1 text-[12px] text-[#D32F2F]">
              {errors.name}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outlined" color="inherit" startIcon={<Eye size={16} />} onClick={() => setPreviewOpen(true)} sx={{ borderColor: "#D1D5DB" }}>
            Preview
          </Button>
          <Tooltip title={wishlist ? "Copy link" : "Submit first to get a share link"}>
            <span>
              <Button
                variant="contained"
                color="secondary"
                endIcon={<Share2 size={16} />}
                disabled={!wishlist}
                onClick={() => wishlist && share(wishlist.id, wishlist.name)}
              >
                Share
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Product gift */}
      <Section icon={Gift} title="Product gift">
        <div className="flex flex-col gap-4">
          {state.products.map((p, i) => (
            <div key={p.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
              <Field
                label="Product name"
                placeholder={i % 2 ? "eg. Toyota camry 2026" : "eg. Deep freezer"}
                value={p.name}
                onChange={(e) => setProduct(p.id, { name: e.target.value })}
                slotProps={{ htmlInput: { maxLength: 80 } }}
                {...err(`${p.id}.name`)}
              />
              <Field
                label="Product link"
                placeholder={i % 2 ? "eg. toyotacamry2026/buy/jumia.com" : "eg. deepfreezer/buy/jumia.com"}
                value={p.link}
                inputMode="url"
                onChange={(e) => setProduct(p.id, { link: e.target.value })}
                {...err(`${p.id}.link`)}
              />
              <IconButton
                aria-label={`Remove product ${i + 1}`}
                onClick={() => setState((s) => ({ ...s, products: s.products.length > 1 ? s.products.filter((x) => x.id !== p.id) : [emptyRow()] }))}
                sx={{ mt: { sm: 3.5 }, justifySelf: "end", color: "#6B7280" }}
              >
                <Trash2 size={16} />
              </IconButton>
            </div>
          ))}
          <Button
            onClick={() => setState((s) => ({ ...s, products: [...s.products, emptyRow()] }))}
            startIcon={<Plus size={16} />}
            sx={{ alignSelf: "flex-start", bgcolor: "#F1F4F8", color: "#0F0F0F", borderRadius: 999, px: 2, "&:hover": { bgcolor: "#E5EAF1" } }}
          >
            Add product
          </Button>
        </div>
      </Section>

      {/* Cash gift */}
      <Section icon={Banknote} title="Cash gift">
        <Tabs value={bankTab} onChange={(_, v: AccountKind) => setBankTab(v)} aria-label="Bank type" sx={{ borderBottom: "1px solid #E8E8EC", mb: 2.5, "& .MuiTabs-indicator": { bgcolor: "#0F0F0F" }, "& .Mui-selected": { color: "#0F0F0F !important", fontWeight: 600 } }}>
          <Tab value="local" label="Local bank" />
          <Tab value="international" label="International bank" />
        </Tabs>
        <div key={bankTab} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Account number"
            placeholder={bankTab === "local" ? "eg. 8188298033" : "eg. GB29 NWBK 6016 1331 9268 19"}
            value={account.accountNumber}
            inputMode={bankTab === "local" ? "numeric" : "text"}
            onChange={(e) => setAccount(bankTab, { accountNumber: bankTab === "local" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value.slice(0, 34) })}
            {...err(`${bankTab}.accountNumber`)}
          />
          <Field
            label="Account name"
            placeholder="eg. Precious Abiodun"
            value={account.accountName}
            onChange={(e) => setAccount(bankTab, { accountName: e.target.value })}
            slotProps={{ htmlInput: { maxLength: 80 } }}
            {...err(`${bankTab}.accountName`)}
          />
          <div className="sm:col-span-2">
            <Autocomplete
              freeSolo
              options={bankTab === "local" ? LOCAL_BANKS : INTERNATIONAL_BANKS}
              value={account.bank}
              onInputChange={(_, v) => setAccount(bankTab, { bank: v })}
              renderInput={(params) => (
                <Field {...params} label="Bank" placeholder={bankTab === "local" ? "eg. Opay MFB" : "eg. Citibank"} {...err(`${bankTab}.bank`)} />
              )}
            />
          </div>
          {accountFilled(state.accounts[bankTab]) && (
            <Button
              onClick={() => setAccount(bankTab, EMPTY_ACCOUNT)}
              startIcon={<X size={14} />}
              color="inherit"
              sx={{ justifySelf: "start", color: "#6B7280" }}
            >
              Clear {bankTab === "local" ? "local" : "international"} account
            </Button>
          )}
        </div>
      </Section>

      {/* Preference */}
      <Section icon={Settings2} title="Preference">
        <div className="sm:max-w-[50%]">
          <Field
            select
            label="Assign wishlist to event"
            value={state.eventId}
            onChange={(e) => setState((s) => ({ ...s, eventId: e.target.value }))}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">
              <span className="text-[#9CA3AF]">Not assigned</span>
            </MenuItem>
            {eventOptions.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.label}
              </MenuItem>
            ))}
          </Field>
          {eventOptions.length === 0 && <p className="mt-1.5 text-[12px] text-[#6B7280]">Save a wedding website in Templates to link it here.</p>}
        </div>
      </Section>

      {errors.form && (
        <p role="alert" className="mb-3 text-[13px] text-[#D32F2F]">
          {errors.form}
        </p>
      )}

      <Button type="submit" variant="contained" fullWidth disabled={saving} sx={{ py: 1.25 }}>
        {saving ? "Saving…" : wishlist ? "Save changes" : "Submit"}
      </Button>

      {/* Preview of what guests will see */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="lg" scroll="paper" aria-labelledby="wishlist-preview-title">
        <div className="flex items-center justify-between border-b border-[#E8E8EC] px-5 py-3">
          <h2 id="wishlist-preview-title" className="text-[16px] font-medium">
            {preview.name || "Wishlist"} · preview
          </h2>
          <IconButton onClick={() => setPreviewOpen(false)} aria-label="Close preview">
            <X size={18} />
          </IconButton>
        </div>
        <DialogContent sx={{ p: { xs: 1.5, sm: 3 } }}>
          <WishlistView message={preview.message} items={preview.items} cash={preview.cash} />
        </DialogContent>
      </Dialog>
    </form>
  );
}
