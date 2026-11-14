import type { Metadata } from "next";
import DashboardShell from "@/app/component/dashboard/shell/DashboardShell";

export const metadata: Metadata = { title: "Dashboard · canto" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
