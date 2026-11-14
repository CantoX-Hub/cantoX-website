"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useDashboard } from "../DashboardContext";
import { NAV_BY_ROLE, isActive } from "../nav";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED = 76;

/** Text wordmark. Swap for your white logo file (e.g. /logo-white.svg) when you have it. */
export function CantoWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]" aria-label="canto dashboard home">
      <span className="text-[22px] leading-none tracking-tight text-white" style={{ fontFamily: '"Cal Sans", sans-serif' }}>
        {compact ? "c" : "canto"}
      </span>
      <span aria-hidden className="mb-3 inline-block h-2.5 w-2.5 rounded-full border-2 border-[#C99532]" />
    </Link>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useDashboard();

  return (
    <nav aria-label="Dashboard" className="mt-6 flex flex-col gap-1 px-3">
      {NAV_BY_ROLE[role].map(({ label, href, icon: Icon }) => {
        const active = isActive(pathname, href);
        const link = (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "group relative flex h-10 items-center gap-3 rounded-lg text-[14px] transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99532]",
              collapsed ? "justify-center px-0" : "px-3",
              active ? "bg-white/[0.08] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white/90",
            ].join(" ")}
          >
            {active && <span aria-hidden className="absolute left-0 top-2 h-6 w-[3px] rounded-r bg-[#C99532]" />}
            <Icon size={18} strokeWidth={1.75} className={active ? "text-[#C99532]" : ""} />
            {!collapsed && <span>{label}</span>}
          </Link>
        );
        return collapsed ? (
          <Tooltip key={href} title={label} placement="right">
            {link}
          </Tooltip>
        ) : (
          link
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useDashboard();
  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <>
      {/* Desktop: fixed rail that collapses to icons */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden flex-col bg-[#060D18] transition-[width] duration-200 lg:flex"
        style={{ width }}
      >
        <div className={`flex h-16 items-center ${collapsed ? "justify-center" : "justify-between px-5"}`}>
          {!collapsed && <CantoWordmark />}
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton onClick={toggleCollapsed} size="small" sx={{ color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </IconButton>
          </Tooltip>
        </div>
        <NavList collapsed={collapsed} />
      </aside>

      {/* Mobile: slide-in drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { lg: "none" }, "& .MuiDrawer-paper": { width: 272, bgcolor: "#060D18", border: 0 } }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <CantoWordmark />
          <IconButton onClick={() => setMobileOpen(false)} size="small" sx={{ color: "rgba(255,255,255,0.7)" }} aria-label="Close menu">
            <X size={18} />
          </IconButton>
        </div>
        <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </>
  );
}
