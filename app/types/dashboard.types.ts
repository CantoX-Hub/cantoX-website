import type { Role } from "./onboarding.types";

export type { Role };

/** What the dashboard needs to know about the signed-in person */
export interface DashboardProfile {
  role: Role;
  /** Person's name, shown in the top bar ("Precious A.") */
  fullName: string;
  /** Planner / vendor business name; couples use their names as the heading */
  businessName?: string;
  partnerName?: string;
  email?: string;
  avatarUrl?: string;
  /** e.g. "planner-pro" — see planIdFor() in lib/onboarding */
  planId?: string;
  verified?: boolean;
}

export type EventStatus = "upcoming" | "ongoing" | "done";
export type EventType = "Wedding website" | "Guest" | "Wishlist";

export interface PlannerEvent {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  location?: string;
  guests?: number;
  couple?: string;
}

export interface VendorProduct {
  name: string;
  price: number;
}

export interface VendorReview {
  id: string;
  author: string;
  rating: number;
  body: string;
  /** ISO date */
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  about: string;
  verified?: boolean;
  /** Logo / cover image URL. Leave empty to use the generated tile. */
  image?: string;
  /** Gallery image URLs. Empty entries render generated tiles. */
  gallery: (string | undefined)[];
  /** Minimum order quantity (product vendors) */
  moq?: string;
  products?: VendorProduct[];
  services?: string[];
  whatsapp: string;
  email: string;
  instagram?: string;
  website?: string;
  reviews: VendorReview[];
}

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  /** ISO date, optional */
  due?: string;
  createdAt: number;
}

export interface DashboardNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}
