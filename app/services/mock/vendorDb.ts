/**
 * Stand-in for the vendor API. Vendors come from the dummy data in
 * app/data/dashboard; reviews people write are kept in localStorage.
 * Only services/api.ts should import this; delete it once the backend is ready.
 */
import { VENDORS } from "@/app/data/dashboard";
import type { Vendor, VendorReview } from "@/app/types/dashboard.types";

const KEY = "cantox:vendor-reviews";

export interface VendorReviewInput {
  author: string;
  rating: number;
  body: string;
}

function readReviews(): Record<string, VendorReview[]> {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Adds the reviews written on this device and folds them into the rating */
function withLocalReviews(v: Vendor, local = readReviews()): Vendor {
  const extra = local[v.id] ?? [];
  if (extra.length === 0) return v;
  const count = v.reviewCount + extra.length;
  const rating = (v.rating * v.reviewCount + extra.reduce((s, r) => s + r.rating, 0)) / count;
  return { ...v, reviews: [...extra, ...v.reviews], reviewCount: count, rating: Math.round(rating * 10) / 10 };
}

export const vendorDb = {
  list() {
    const local = readReviews();
    return VENDORS.map((v) => withLocalReviews(v, local));
  },

  get(id: string) {
    const v = VENDORS.find((x) => x.id === id);
    return v ? withLocalReviews(v) : undefined;
  },

  addReview(id: string, input: VendorReviewInput) {
    if (!VENDORS.some((v) => v.id === id)) return undefined;
    const body = input.body.trim();
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new Error("Choose a rating from 1 to 5 stars.");
    if (body.length < 10) throw new Error("Write at least 10 characters about your experience.");
    if (body.length > 1000) throw new Error("Keep your review under 1,000 characters.");
    const review: VendorReview = {
      id: `rv-${Date.now().toString(36)}`,
      author: input.author.trim() || "A canto couple",
      rating: input.rating,
      body,
      date: new Date().toISOString().slice(0, 10),
    };
    const all = readReviews();
    all[id] = [review, ...(all[id] ?? [])];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      throw new Error("Your browser storage is full, so we couldn't save your review.");
    }
    return vendorDb.get(id);
  },
};
