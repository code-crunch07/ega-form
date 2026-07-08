import { ReactNode } from "react";
import { getMockSessionUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMockSessionUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
