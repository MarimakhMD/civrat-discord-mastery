import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Ticket, ScrollText, UserPlus, Shield, Sparkles,
  Link2, Settings, Bell, Search, ChevronsLeft, ChevronsRight,
  Zap, UserCheck, Trophy, Globe, ThumbsUp, Lock, Menu, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, getUserAvatarUrl, getGuildIconUrl } from "@/lib/auth";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/welcome", label: "Welcome", icon: UserPlus },
  { to: "/dashboard/tickets", label: "Tickets", icon: Ticket },
  { to: "/dashboard/logs", label: "Logs", icon: ScrollText },
  { to: "/dashboard/automod", label: "Auto Mod", icon: Shield },
  { to: "/dashboard/captcha", label: "Captcha", icon: UserCheck },
  { to: "/dashboard/xp", label: "XP System", icon: Sparkles },
  { to: "/dashboard/giveaways", label: "Giveaways", icon: Trophy },
  { to: "/dashboard/languages", label: "Languages", icon: Globe },
  { to: "/dashboard/suggestions", label: "Suggestions", icon: ThumbsUp },
  { to: "/dashboard/security", label: "Security", icon: Lock },
  { to: "/dashboard/invitations", label: "Invitations", icon: Link2 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, selectedGuild, logout } = useAuth();

  const guildName = selectedGuild?.name ?? "Server";
  const guildIcon = selectedGuild?.icon ? getGuildIconUrl(selectedGuild.id, selectedGuild.icon) : null;
  const userAvatar = user?.avatar ? getUserAvatarUrl(user.id, user.avatar) : null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

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
            className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="px-3 pt-4">
            <Link to="/servers" className="glass rounded-xl p-3 block cursor-pointer hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2.5">
                {guildIcon ? (
                  <img src={guildIcon} alt="" className="h-9 w-9 rounded-lg" />
                ) : (
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/30 to-gold/30 text-xs font-bold">{guildName.charAt(0)}</div>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{guildName}</div>
                  <div className="text-xs text-muted-foreground">Switch server</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                onClick={() => setMobileOpen(false)}
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
              {userAvatar ? (
                <img src={userAvatar} alt="" className="h-8 w-8 rounded-full" />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-gold text-xs font-bold text-primary-foreground">
                  {user?.username?.charAt(0) ?? "U"}
                </div>
              )}
              <div className="min-w-0 text-xs flex-1">
                <div className="truncate font-semibold">{user?.global_name ?? user?.username ?? "User"}</div>
                <div className="truncate text-muted-foreground">online</div>
              </div>
              <button onClick={logout} className="p-1 rounded text-muted-foreground hover:text-destructive cursor-pointer" title="Logout">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:hidden ${
          mobileOpen ? "translate-x-0 flex" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Logo />
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
                <span className="truncate">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div className="md:hidden"><Logo /></div>
          <div className="relative ml-auto hidden w-full max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9 bg-card/60" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
          </Button>
          {userAvatar ? (
            <img src={userAvatar} alt="" className="h-9 w-9 rounded-full" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-gold" />
          )}
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
