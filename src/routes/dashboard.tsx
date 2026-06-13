import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/civrat/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
