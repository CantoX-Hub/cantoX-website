"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { useAppSelector } from "@/app/store/hooks";
import { selectAuth } from "@/app/store/authSlice";
import { ROUTES } from "@/app/lib/routes";
import { dashboardTheme } from "../theme";
import { DashboardProvider, useDashboard } from "../DashboardContext";
import { ToastProvider } from "../Toast";
import Sidebar, { SIDEBAR_COLLAPSED, SIDEBAR_WIDTH } from "./Sidebar";
import Topbar from "./Topbar";
import { leaving } from "./leaving";

function Frame({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAppSelector(selectAuth);
  const { collapsed, ready } = useDashboard();

  // Only a confirmed "guest" is sent away. "unknown" is allowed through
  // because there is no GET /auth/me to confirm a session on page load.
  useEffect(() => {
    leaving.current = false;
  }, []);
  useEffect(() => {
    if (status === "guest" && !leaving.current) router.replace(ROUTES.getStarted);
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#F6F6F8]" style={{ "--sidebar": `${collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH}px` } as React.CSSProperties}>
      <Sidebar />
      <div className="flex min-h-screen flex-col transition-[padding] duration-200 lg:pl-[var(--sidebar)]">
        <Topbar />
        <main id="main" className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {/* Wait for the stored role so a planner never sees a couple's page flash */}
          <div className={`mx-auto w-full max-w-[1200px] transition-opacity duration-150 ${ready ? "opacity-100" : "opacity-0"}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui", prepend: true }}>
      <ThemeProvider theme={dashboardTheme}>
        <DashboardProvider>
          <ToastProvider>
            <Frame>{children}</Frame>
          </ToastProvider>
        </DashboardProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
