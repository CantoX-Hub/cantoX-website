"use client";

/* eslint-disable @next/next/no-img-element -- product images will come from the API/CDN */

import { useState } from "react";
import { Check, Copy, Gift, Undo2 } from "lucide-react";
import type { BankAccount, CashGift, WishlistItem } from "@/app/types/wishlist.types";

export const DEFAULT_WISHLIST_MESSAGE = "Be part of our journey as we build our new home with these starters. Thank you for your support.";

/** "https://www.jumia.com.ng/x" → "jumia.com.ng" */
export function storeName(link?: string) {
  if (!link) return undefined;
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function ItemCard({
  item,
  interactive,
  onTogglePurchased,
}: {
  item: WishlistItem;
  interactive: boolean;
  onTogglePurchased?: (purchased: boolean) => void;
}) {
  const store = storeName(item.link);
  const inert = !interactive;

  return (
    <article className="flex flex-col rounded-xl border border-[#EEF0F3] bg-white p-3.5">
      <div className="relative aspect-[19/20] overflow-hidden rounded-lg bg-[#F6F7F9]">
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div aria-hidden className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F4EBDD] to-[#EAF0F5] text-[#C99532]">
            <Gift size={44} strokeWidth={1.2} />
          </div>
        )}
        {item.purchased && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-2 py-0.5 text-[11px] font-semibold text-white">
            <Check size={12} /> Purchased
          </span>
        )}
      </div>

      <h3 className="mt-3 text-[16px] font-semibold leading-5 text-[#0F0F0F]">{item.name}</h3>
      {store && <span className="mt-1.5 w-fit rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[12px] text-[#4B5563]">{store}</span>}

      <div className="mt-auto flex flex-col gap-2 pt-3">
        {item.link && !item.purchased && !inert ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[#060D18] py-2.5 text-center text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Gift this
          </a>
        ) : (
          <span aria-disabled className={`rounded-md py-2.5 text-center text-[13px] font-semibold ${item.purchased ? "bg-[#E5E7EB] text-[#6B7280]" : "bg-[#060D18] text-white"} ${inert ? "" : "cursor-not-allowed"}`}>
            {item.purchased ? "Already gifted" : "Gift this"}
          </span>
        )}

        {inert ? (
          <span aria-disabled className="rounded-md bg-[#EAF3FB] py-2.5 text-center text-[13px] font-semibold text-[#0F0F0F]">
            {item.purchased ? "Marked as purchased" : "I’ve purchased this"}
          </span>
        ) : item.purchased ? (
          <button
            type="button"
            onClick={() => onTogglePurchased?.(false)}
            className="flex items-center justify-center gap-1.5 rounded-md bg-[#EAF3FB] py-2.5 text-[13px] font-semibold text-[#0F0F0F] transition-colors hover:bg-[#DDEBF8]"
          >
            <Undo2 size={14} /> Undo purchase
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTogglePurchased?.(true)}
            className="rounded-md bg-[#EAF3FB] py-2.5 text-[13px] font-semibold text-[#0F0F0F] transition-colors hover:bg-[#DDEBF8]"
          >
            I’ve purchased this
          </button>
        )}
      </div>
    </article>
  );
}

/** Hand-drawn style bank with a coin, as in the design */
export function BankIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 230" className={className} aria-hidden fill="none" stroke="#1E3A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M110 8 L208 84 L12 84 Z" fill="#CFE3F7" />
      <text x="110" y="68" textAnchor="middle" fontSize="26" fontFamily="'Comic Sans MS', cursive" fill="#1E3A5F" stroke="none">
        BANK
      </text>
      <path d="M38 84 L44 198 M182 84 L176 198" />
      <path d="M38 84 H182 L176 198 H44 Z" fill="#CFE3F7" />
      <path d="M58 100 L62 186 M162 100 L158 186" opacity=".7" />
      <ellipse cx="110" cy="142" rx="30" ry="38" fill="#E59A12" />
      <ellipse cx="114" cy="142" rx="20" ry="30" stroke="#B26E00" />
      <path d="M70 110 l8 6 M150 110 l-8 6 M70 176 l8 -6 M150 176 l-8 -6" />
      <rect x="22" y="198" width="176" height="18" rx="3" fill="#1E3A5F" />
    </svg>
  );
}

function AccountCard({ account }: { account: BankAccount }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-[14px] text-[#3A5A80]">Account name</p>
      <p className="mt-0.5 text-[22px] font-semibold text-[#0F0F0F] sm:text-[24px]">{account.accountName}</p>
      <p className="mt-3 text-[14px] text-[#3A5A80]">Bank name</p>
      <p className="mt-0.5 text-[22px] font-semibold text-[#0F0F0F] sm:text-[24px]">{account.bank}</p>
      <p className="mt-3 text-[14px] text-[#3A5A80]">Account number</p>
      <p className="mt-0.5 break-all text-[30px] font-bold tracking-wide text-[#0F0F0F] sm:text-[36px]">{account.accountNumber}</p>
      <button
        type="button"
        onClick={copy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#F1F4F8] py-2.5 text-[13px] font-semibold text-[#0F0F0F] transition-colors hover:bg-[#E5EAF1]"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Copied" : "Copy account number"}
      </button>
    </div>
  );
}

function CashGiftBlock({ cash }: { cash: CashGift }) {
  const options = [
    cash.local && { id: "local" as const, label: "Local bank", account: cash.local },
    cash.international && { id: "international" as const, label: "International bank", account: cash.international },
  ].filter((x): x is { id: "local" | "international"; label: string; account: BankAccount } => !!x);
  const [active, setActive] = useState(options[0]?.id);
  if (options.length === 0) return null;
  const current = options.find((o) => o.id === active) ?? options[0];

  return (
    <section className="mt-10 grid gap-6 rounded-xl bg-white p-6 sm:p-10 md:grid-cols-2 md:items-center" aria-labelledby="cash-gift-title">
      <div>
        <h2 id="cash-gift-title" className="text-[24px] font-semibold text-[#0F0F0F]" style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif' }}>
          Cash gift
        </h2>
        <p className="mt-2 text-[14px] text-[#374151]">Contribute a cash gift toward the couple’s next chapter.</p>
        <BankIllustration className="mx-auto mt-6 h-[190px] w-auto md:mx-0 md:ml-12" />
      </div>
      <div className="rounded-lg border border-[#E8E8EC] p-5 sm:p-6">
        {options.length > 1 && (
          <div className="mb-5 flex border-b border-[#E8E8EC]" role="tablist" aria-label="Account">
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={current.id === o.id}
                onClick={() => setActive(o.id)}
                className={`-mb-px flex-1 border-b-2 py-2 text-[14px] ${current.id === o.id ? "border-[#0F0F0F] font-semibold text-[#0F0F0F]" : "border-transparent text-[#9CA3AF]"}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
        <AccountCard account={current.account} />
      </div>
    </section>
  );
}

/**
 * What guests see: product gifts and cash gift details.
 * `interactive` turns on "Gift this" / "I've purchased this" (the shared page);
 * the dashboard shows the same layout as a preview.
 */
export default function WishlistView({
  message,
  items,
  cash,
  interactive = false,
  onTogglePurchased,
}: {
  message?: string;
  items: WishlistItem[];
  cash: CashGift;
  interactive?: boolean;
  onTogglePurchased?: (itemId: string, purchased: boolean) => void;
}) {
  const hasCash = !!(cash.local || cash.international);

  return (
    <div className="rounded-2xl bg-[#F3F8FC] px-4 py-8 sm:px-6 sm:py-10">
      <div className="text-center">
        <h2 className="text-[24px] font-semibold text-[#0F0F0F]" style={{ fontFamily: '"Cal Sans", "DM Sans", sans-serif' }}>
          Wishlist
        </h2>
        <p className="mx-auto mt-2 max-w-[620px] text-[14px] text-[#374151]">{message || DEFAULT_WISHLIST_MESSAGE}</p>
      </div>

      {items.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} interactive={interactive} onTogglePurchased={(p) => onTogglePurchased?.(item.id, p)} />
          ))}
        </div>
      )}

      {hasCash && <CashGiftBlock cash={cash} />}

      {items.length === 0 && !hasCash && <p className="mt-10 text-center text-[14px] text-[#6B7280]">Nothing has been added to this wishlist yet.</p>}
    </div>
  );
}
