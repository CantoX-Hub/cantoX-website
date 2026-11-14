"use client";

import Link from "next/link";
import { Button } from "@mui/material";
import { CalendarDays, Heart, LayoutTemplate, MessageSquareText, Star, Store, Users, type LucideIcon } from "lucide-react";
import { useDashboard } from "./DashboardContext";
import { NAV_BY_ROLE } from "./nav";
import { PageTitle, Panel } from "./ui";

const SECTIONS: Record<string, { title: string; body: string; icon: LucideIcon }> = {
  templates: { title: "Templates", body: "Browse wedding website templates and personalise one with your photos, story and colours.", icon: LayoutTemplate },
  wishlist: { title: "Wishlist", body: "Add the gifts you'd love and share one link with your guests.", icon: Heart },
  guests: { title: "Guests", body: "Import your guest list, send invites and track RSVPs in one place.", icon: Users },
  calendar: { title: "Calendar", body: "See every fitting, tasting and vendor meeting on one calendar.", icon: CalendarDays },
  storefront: { title: "My storefront", body: "Edit your logo, gallery, products and contact details.", icon: Store },
  enquiries: { title: "Enquiries", body: "Messages from couples and planners will land here.", icon: MessageSquareText },
  reviews: { title: "Reviews", body: "Read and reply to reviews left on your storefront.", icon: Star },
};

export default function ComingSoon({ section }: { section: string }) {
  const { role } = useDashboard();
  const s = SECTIONS[section];
  const inNav = NAV_BY_ROLE[role].some((n) => n.href === `/dashboard/${section}`);

  if (!s || !inNav) return <NotForRole />;

  return (
    <>
      <PageTitle>{s.title}</PageTitle>
      <Panel className="flex flex-col items-center px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FBF4E6] text-[#C99532]">
          <s.icon size={22} />
        </span>
        <p className="mt-4 text-[17px] font-semibold">{s.title} is on the way</p>
        <p className="mt-1 max-w-[380px] text-[14px] leading-6 text-[#6B7280]">{s.body}</p>
        <Button component={Link} href="/dashboard" variant="outlined" color="inherit" sx={{ mt: 3, borderColor: "#E8E8EC" }}>
          Back to overview
        </Button>
      </Panel>
    </>
  );
}

/** Shown when someone opens a page that isn't part of their role's dashboard */
export function NotForRole() {
  return (
    <Panel className="flex flex-col items-center px-6 py-16 text-center">
      <p className="text-[17px] font-semibold">This page isn&apos;t available on your account</p>
      <p className="mt-1 max-w-[380px] text-[14px] text-[#6B7280]">Use the menu to find what you need.</p>
      <Button component={Link} href="/dashboard" variant="contained" sx={{ mt: 3 }}>
        Back to overview
      </Button>
    </Panel>
  );
}

/** Renders children only for the listed roles */
export function RoleGate({ roles, children }: { roles: ("couple" | "planner" | "vendor")[]; children: React.ReactNode }) {
  const { role, ready } = useDashboard();
  if (!ready) return null;
  return roles.includes(role) ? <>{children}</> : <NotForRole />;
}
