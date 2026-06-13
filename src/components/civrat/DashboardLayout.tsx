import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Ticket, ScrollText, UserPlus, Shield, Sparkles,
  Link2, Settings, Bell, Search, ChevronsLeft, ChevronsRight,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/tickets", label: "Tickets", icon: Ticket },
  { to: "/dashboard/logs", label: "Logs", icon: ScrollText },
  { to: "/dashboard/welcome", label: "Welcome", icon: UserPlus },
  { to: "/dashboard/security", label: "Security", icon: Shield },
  { to: "/dashboard/xp", label: "XP System", icon: Sparkles },
  { to: "/dashboard/invitations", label: "Invitations", icon: Link2 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];


export function DashboardLayout({ children }: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all md:flex ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed ? <Logo /> : (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground font-display font-bold">C</span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 pt-4">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/30 to-gold/30 text-xs font-bold">SV</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">Serveur sélectionné</div>
                  <div className="text-xs text-muted-foreground">2,481 membres</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-sidebar-border p-3">
            <div className="glass flex items-center gap-2 rounded-lg p-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-gold text-xs font-bold text-primary-foreground">U</div>
              <div className="min-w-0 text-xs">
                <div className="truncate font-semibold">Admin</div>
                <div className="truncate text-muted-foreground">en ligne</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="md:hidden"><Logo /></div>
          <div className="relative ml-auto hidden w-full max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher…" className="pl-9 bg-card/60" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-gold" />
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
