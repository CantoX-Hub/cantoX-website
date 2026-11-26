"use client";

import { useCallback } from "react";
import { useToast } from "../Toast";

export const LOCAL_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "FCMB",
  "GTBank",
  "Keystone Bank",
  "Kuda MFB",
  "Moniepoint MFB",
  "Opay MFB",
  "PalmPay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC",
  "Standard Chartered",
  "Sterling Bank",
  "UBA",
  "Union Bank",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

export const INTERNATIONAL_BANKS = [
  "Bank of America",
  "Barclays",
  "Chase",
  "Citibank",
  "Grey",
  "HSBC",
  "Lloyds Bank",
  "Monzo",
  "Payoneer",
  "Revolut",
  "TD Bank",
  "Wells Fargo",
  "Wise",
];

export const wishlistPublicPath = (id: string) => `/wishlist/${encodeURIComponent(id)}`;

/** "Jul 7, 2026" style used on the list ("Opened July 7, 2026") */
export const longDate = (ts: number) => new Date(ts).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** Opens the phone's share sheet when there is one, otherwise copies the link */
export function useShareWishlist() {
  const notify = useToast();
  return useCallback(
    async (id: string, name: string) => {
      const url = `${window.location.origin}${wishlistPublicPath(id)}`;
      const canShare = typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;
      try {
        if (canShare) {
          await navigator.share({ title: name, text: `${name} on canto`, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        notify("Link copied. Share it with your guests.");
      } catch (e) {
        // Closing the share sheet throws AbortError; that's not a failure
        if (e instanceof DOMException && e.name === "AbortError") return;
        notify(`Copy this link: ${url}`, { severity: "info" });
      }
    },
    [notify]
  );
}
