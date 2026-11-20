"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import { PanelLeft, PanelRight, X } from "lucide-react";
import { useDashboard } from "../DashboardContext";
import { NAV_BY_ROLE, isActive } from "../nav";

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED = 76;


export function CantoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard"  className="flex items-center tracking-tight">
              <Image
                src="/dashboard-logo.svg"
                alt="Canto"
                width={94}
                height={25}
                priority
                className="h-auto w-[80px] md:w-[95px]"
              />
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
           
            <Icon size={18} className={active ? "text-[#]" : ""} />
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
          {!collapsed && <CantoLogo />}
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
            <IconButton onClick={toggleCollapsed} size="small" sx={{ color: "rgba(255,255,255,0.6)", "&:hover": { color: "#fff" } }} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {collapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
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
          <CantoLogo />
          <IconButton onClick={() => setMobileOpen(false)} size="small" sx={{ color: "rgba(255,255,255,0.7)" }} aria-label="Close menu">
            <X size={18} />
          </IconButton>
        </div>
        <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </>
  );
}
