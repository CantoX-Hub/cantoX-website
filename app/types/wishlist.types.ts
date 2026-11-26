export interface WishlistItem {
  id: string;
  name: string;
  /** Where guests can buy it */
  link?: string;
  image?: string;
  /** A guest tapped "I've purchased this" */
  purchased?: boolean;
  /** ms since epoch */
  purchasedAt?: number;
}

export interface BankAccount {
  accountNumber: string;
  accountName: string;
  bank: string;
}

export interface CashGift {
  local?: BankAccount;
  international?: BankAccount;
}

export interface Wishlist {
  id: string;
  name: string;
  /** Line under the "Wishlist" heading on the shared page */
  message?: string;
  items: WishlistItem[];
  cash: CashGift;
  /** Event / wedding website this wishlist belongs to */
  eventId?: string;
  eventLabel?: string;
  /** ms since epoch */
  createdAt: number;
  updatedAt: number;
  /** Last time the owner opened it ("Opened July 7, 2026") */
  openedAt: number;
}

/** What the create / edit form sends */
export type WishlistInput = Pick<Wishlist, "name" | "message" | "items" | "cash" | "eventId" | "eventLabel">;
