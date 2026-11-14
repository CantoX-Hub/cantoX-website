import {
  CalendarDays,
  Heart,
  LayoutDashboard,
  LayoutTemplate,
  ListTodo,
  MessageSquareText,
  PartyPopper,
  Star,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/app/types/dashboard.types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const overview: NavItem = { label: "Overview", href: "/dashboard", icon: LayoutDashboard };
const events: NavItem = { label: "Events", href: "/dashboard/events", icon: PartyPopper };
const templates: NavItem = { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate };
const wishlist: NavItem = { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart };
const guests: NavItem = { label: "Guests", href: "/dashboard/guests", icon: Users };
const vendors: NavItem = { label: "Vendors", href: "/dashboard/vendors", icon: Store };
const todo: NavItem = { label: "To-do list", href: "/dashboard/todo", icon: ListTodo };
const calendar: NavItem = { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays };

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  couple: [overview, templates, wishlist, guests, vendors, todo, calendar],
  planner: [overview, events, templates, wishlist, guests, vendors, todo, calendar],
  // No vendor dashboard design yet — inferred from the other two.
  vendor: [
    overview,
    { label: "My storefront", href: "/dashboard/storefront", icon: Store },
    { label: "Enquiries", href: "/dashboard/enquiries", icon: MessageSquareText },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    todo,
    calendar,
  ],
};

/** Breadcrumb label for the current path */
export function crumbFor(pathname: string, role: Role): NavItem | null {
  if (pathname === "/dashboard") return null;
  if (pathname.startsWith("/dashboard/vendors/")) return { ...vendors, label: "Vendor" };
  const all = [...NAV_BY_ROLE[role], events, templates, wishlist, guests, vendors, todo, calendar];
  return all.find((item) => item.href !== "/dashboard" && pathname.startsWith(item.href)) ?? null;
}

export function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname === href || pathname.startsWith(`${href}/`);
}
