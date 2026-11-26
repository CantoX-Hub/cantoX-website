/**
 * Stand-in for the wishlist API, kept in localStorage. Only services/api.ts
 * should import this; delete it once the backend has wishlist endpoints.
 *
 * Note: because it's per-browser, a shared /wishlist/[id] link only opens in
 * the browser that created it until the backend exists.
 */
import type { Wishlist, WishlistInput } from "@/app/types/wishlist.types";

const KEY = "cantox:wishlists";

const DAY = 86_400_000;

function seed(): Wishlist[] {
  const now = Date.now();
  const items = [
    "Velvet sofa",
    "Split air conditioner",
    "Ninja blending set",
    "Standing refrigerator",
    "Air fryer",
    "Lasko standing fan",
    "Dinner set (24 pcs)",
    "Smart TV 55\"",
  ].map((name, i) => ({ id: `seed-item-${i}`, name, link: i % 2 ? "https://www.jumia.com.ng" : "https://www.konga.com" }));
  return [
    {
      id: "rayo-and-moyo",
      name: "Rayo&Moyo's wishlist",
      items,
      cash: {
        local: { accountNumber: "8188298033", accountName: "Olawale Abiodun", bank: "Opay MFB" },
      },
      createdAt: now - 6 * DAY,
      updatedAt: now - 2 * DAY,
      openedAt: now - 2 * DAY,
    },
  ];
}

function readAll(): Wishlist[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) {
      // First visit: start with one example so the page isn't empty
      const initial = seed();
      writeAll(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Wishlist[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: Wishlist[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    throw new Error("Your browser storage is full, so we couldn't save.");
  }
}

const newId = () => `wl-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const wishlistDb = {
  /** Most recently opened first */
  list(): Wishlist[] {
    return readAll().sort((a, b) => b.openedAt - a.openedAt);
  },

  get(id: string): Wishlist | undefined {
    return readAll().find((w) => w.id === id);
  },

  create(input: WishlistInput): Wishlist {
    const now = Date.now();
    const wishlist: Wishlist = { ...input, id: newId(), createdAt: now, updatedAt: now, openedAt: now };
    writeAll([wishlist, ...readAll()]);
    return wishlist;
  },

  update(id: string, input: WishlistInput): Wishlist | undefined {
    const all = readAll();
    const i = all.findIndex((w) => w.id === id);
    if (i < 0) return undefined;
    const now = Date.now();
    all[i] = { ...all[i], ...input, updatedAt: now, openedAt: now };
    writeAll(all);
    return all[i];
  },

  remove(id: string) {
    writeAll(readAll().filter((w) => w.id !== id));
  },

  /** Bumps "Opened …" without counting as an edit */
  open(id: string) {
    const all = readAll();
    const w = all.find((x) => x.id === id);
    if (!w) return;
    w.openedAt = Date.now();
    writeAll(all);
  },

  setPurchased(id: string, itemId: string, purchased: boolean): Wishlist | undefined {
    const all = readAll();
    const w = all.find((x) => x.id === id);
    const item = w?.items.find((it) => it.id === itemId);
    if (!w || !item) return undefined;
    item.purchased = purchased || undefined;
    item.purchasedAt = purchased ? Date.now() : undefined;
    writeAll(all);
    return w;
  },
};
