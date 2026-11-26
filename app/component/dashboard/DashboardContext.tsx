"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/app/store/hooks";
import { selectAuth } from "@/app/store/authSlice";
import { DEMO_PROFILES } from "@/app/data/dashboard";
import type { DashboardProfile, Role } from "@/app/types/dashboard.types";

const DEV_ROLE_KEY = "cantox:dev-role";
const COLLAPSED_KEY = "cantox:sidebar-collapsed";
const ROLES: Role[] = ["couple", "planner", "vendor"];

/** Shown only outside production builds */
export const SHOW_DEV_TOOLS = process.env.NODE_ENV !== "production";

interface DashboardContextValue {
  profile: DashboardProfile;
  role: Role;
  /** False until localStorage has been read (avoids a flash of the wrong role) */
  ready: boolean;
  /** Dev-only: preview another role's dashboard */
  devRole: Role | null;
  setDevRole: (role: Role | null) => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user, email } = useAppSelector(selectAuth);
  const [ready, setReady] = useState(false);
  const [devRole, setDevRoleState] = useState<Role | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DEV_ROLE_KEY) as Role | null;
      if (SHOW_DEV_TOOLS && saved && ROLES.includes(saved)) setDevRoleState(saved);
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      /* storage blocked */
    }
    setReady(true);
  }, []);

  const setDevRole = useCallback((role: Role | null) => {
    setDevRoleState(role);
    try {
      if (role) window.localStorage.setItem(DEV_ROLE_KEY, role);
      else window.localStorage.removeItem(DEV_ROLE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, c ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !c;
    });
  }, []);

  const profile = useMemo<DashboardProfile>(() => {
    const userRole = user?.role && ROLES.includes(user.role) ? user.role : null;
    const role: Role = devRole ?? userRole ?? "couple";
    const demo = DEMO_PROFILES[role];
    // When previewing another role, show that role's demo profile in full.
    if (devRole && devRole !== userRole) return demo;
    return {
      role,
      fullName: str(user?.fullName) ?? demo.fullName,
      businessName: str(user?.businessName) ?? demo.businessName,
      partnerName: str(user?.partnerName) ?? demo.partnerName,
      email: str(user?.email) ?? email ?? demo.email,
      avatarUrl: str(user?.avatarUrl),
      planId: str(user?.planId) ?? demo.planId,
      verified: typeof user?.verified === "boolean" ? user.verified : demo.verified,
    };
  }, [user, email, devRole]);

  const value = useMemo(
    () => ({ profile, role: profile.role, ready, devRole, setDevRole, collapsed, toggleCollapsed, mobileOpen, setMobileOpen }),
    [profile, ready, devRole, setDevRole, collapsed, toggleCollapsed, mobileOpen]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside <DashboardProvider>");
  return ctx;
}

/** "Precious Adebayo" → "Precious A." */
export function shortName(fullName: string) {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0].toUpperCase()}.` : first;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** "planner-pro" → { label: "Planner Pro", free: false } */
export function planLabel(planId: string | undefined, role: Role) {
  const roleName = { couple: "Couple", planner: "Planner", vendor: "Vendor" }[role];
  if (!planId) return { label: `${roleName} Free`, free: true };
  const slug = planId.startsWith(`${role}-`) ? planId.slice(role.length + 1) : planId;
  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { label: `${roleName} ${name}`, free: slug === "free" || slug === "basic" };
}
