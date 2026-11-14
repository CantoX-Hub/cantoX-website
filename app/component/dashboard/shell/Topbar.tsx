"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";
import { Bell, Check, ChevronDown, ChevronRight, LayoutDashboard, LogOut, Menu as MenuIcon, Settings, UserRound } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { useLogoutMutation } from "@/app/services/api";
import { sessionExpired } from "@/app/store/authActions";
import { NOTIFICATIONS } from "@/app/data/dashboard";
import { ROUTES } from "@/app/lib/routes";
import type { Role } from "@/app/types/dashboard.types";
import { SHOW_DEV_TOOLS, initials, shortName, useDashboard } from "../DashboardContext";
import { crumbFor } from "../nav";
import { useToast } from "../Toast";
import { leaving } from "./leaving";

const ROLE_LABEL: Record<Role, string> = { couple: "Couple", planner: "Event planner", vendor: "Vendor" };

function Breadcrumb() {
  const pathname = usePathname();
  const { role } = useDashboard();
  const crumb = crumbFor(pathname, role);

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
      <Link href="/dashboard" className={`flex items-center gap-1.5 rounded px-1 ${crumb ? "text-[#9CA3AF] hover:text-[#0F0F0F]" : "font-medium text-[#0F0F0F]"}`}>
        <LayoutDashboard size={14} />
        Dashboard
      </Link>
      {crumb && (
        <>
          <ChevronRight size={14} className="shrink-0 text-[#C4C4CC]" aria-hidden />
          <span className="flex min-w-0 items-center gap-1.5 font-medium text-[#0F0F0F]" aria-current="page">
            <crumb.icon size={14} className="shrink-0" />
            <span className="truncate">{crumb.label}</span>
          </span>
        </>
      )}
    </nav>
  );
}

function Notifications() {
  const router = useRouter();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, width: 40, height: 40 }}
        >
          <Badge color="error" variant="dot" invisible={!unread} overlap="circular">
            <Bell size={18} className={unread ? "text-[#E5484D]" : "text-[#0F0F0F]"} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, width: 340, maxWidth: "calc(100vw - 24px)" } } }}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <p className="text-[15px] font-semibold">Notifications</p>
          {/* Not `disabled`: disabling the focused button would drop focus out of the popover */}
          <Button
            size="small"
            aria-disabled={!unread}
            onClick={() => unread && setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            startIcon={<Check size={14} />}
            sx={!unread ? { color: "text.disabled", cursor: "default", "&:hover": { bgcolor: "transparent" } } : undefined}
          >
            {unread ? "Mark all as read" : "All caught up"}
          </Button>
        </div>
        <Divider />
        <ul className="max-h-[360px] overflow-y-auto py-1">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                  if (n.href) {
                    setAnchor(null);
                    router.push(n.href);
                  }
                }}
                className="flex w-full gap-3 px-4 py-3 text-left hover:bg-[#F6F6F8] focus-visible:bg-[#F6F6F8] focus-visible:outline-none"
              >
                <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-[#C99532]"}`} />
                <span className="min-w-0">
                  <span className={`block text-[14px] ${n.read ? "text-[#4B5563]" : "font-semibold text-[#0F0F0F]"}`}>{n.title}</span>
                  <span className="block text-[13px] text-[#6B7280]">{n.body}</span>
                  <span className="mt-1 block text-[12px] text-[#9CA3AF]">{n.time}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </>
  );
}

function ProfileMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notify = useToast();
  const [logout] = useLogoutMutation();
  const { profile, devRole, setDevRole } = useDashboard();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);

  const handleLogout = async () => {
    close();
    try {
      await logout().unwrap();
    } catch {
      // Clear the local session even if the request fails (e.g. offline or mock mode).
    }
    leaving.current = true;
    router.push(ROUTES.home);
    dispatch(sessionExpired());
  };

  const avatar = (size: number) => (
    <Avatar src={profile.avatarUrl} alt="" sx={{ width: size, height: size, bgcolor: "#F3E8D2", color: "#7A5A17", fontSize: size * 0.4, fontWeight: 600 }}>
      {initials(profile.fullName)}
    </Avatar>
  );

  return (
    <>
      <button
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        className="flex h-10 items-center gap-2 rounded-lg border border-[#E8E8EC] py-1 pl-1 pr-2 hover:bg-[#F6F6F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532] sm:pr-3"
      >
        {avatar(30)}
        <span className="hidden text-[14px] font-medium sm:inline">{shortName(profile.fullName)}</span>
        <ChevronDown size={16} className={`text-[#6B7280] transition-transform ${anchor ? "rotate-180" : ""}`} />
      </button>
      <Menu
        open={!!anchor}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
      >
        <div className="flex flex-col items-center px-4 pb-3 pt-2 text-center">
          {avatar(44)}
          <p className="mt-2 text-[14px] font-semibold">{shortName(profile.fullName)}</p>
          {profile.email && <p className="max-w-[200px] truncate text-[12px] text-[#6B7280]">{profile.email}</p>}
        </div>
        <Divider />
        <MenuItem
          onClick={() => {
            close();
            notify("Profile page is coming soon", { severity: "info" });
          }}
        >
          <ListItemIcon><UserRound size={16} /></ListItemIcon>
          View profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            notify("Settings are coming soon", { severity: "info" });
          }}
        >
          <ListItemIcon><Settings size={16} /></ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogOut size={16} /></ListItemIcon>
          Log out
        </MenuItem>

        {SHOW_DEV_TOOLS && <Divider />}
        {SHOW_DEV_TOOLS && <ListSubheader sx={{ lineHeight: "32px", fontSize: 12 }}>Preview as (dev only)</ListSubheader>}
        {SHOW_DEV_TOOLS &&
          (["couple", "planner", "vendor"] as Role[]).map((r) => (
            <MenuItem
              key={r}
              dense
              selected={profile.role === r}
              onClick={() => {
                close();
                setDevRole(r);
                router.push("/dashboard");
              }}
            >
              {ROLE_LABEL[r]}
            </MenuItem>
          ))}
        {SHOW_DEV_TOOLS && devRole && (
          <MenuItem dense onClick={() => { close(); setDevRole(null); }} sx={{ color: "text.secondary" }}>
            Use my real role
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default function Topbar() {
  const { setMobileOpen } = useDashboard();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#E8E8EC] bg-white/90 px-4 backdrop-blur sm:px-6">
      <IconButton onClick={() => setMobileOpen(true)} aria-label="Open menu" sx={{ display: { lg: "none" }, ml: -1 }}>
        <MenuIcon size={20} />
      </IconButton>
      <Breadcrumb />
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Notifications />
        <ProfileMenu />
      </div>
    </header>
  );
}
