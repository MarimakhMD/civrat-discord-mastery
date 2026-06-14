import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, ScrollText, Ticket, Shield, Lock, Award, Gift, Globe2, Lightbulb, ShieldAlert, UserPlus, Settings, BarChart3, Crown, Menu, X, LogOut, Mic, Database, FileCode, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', module: 'home' },
  { icon: MessageSquare, label: 'Welcome', module: 'welcome' },
  { icon: Ticket, label: 'Tickets', module: 'tickets' },
  { icon: ScrollText, label: 'Logs', module: 'logs' },
  { icon: Shield, label: 'Auto Mod', module: 'automod' },
  { icon: Lock, label: 'Captcha', module: 'captcha' },
  { icon: Award, label: 'XP & Levels', module: 'xplevels' },
  { icon: Gift, label: 'Giveaways', module: 'giveaways' },
  { icon: Globe2, label: 'Languages', module: 'languages' },
  { icon: Lightbulb, label: 'Suggestions', module: 'suggestions' },
  { icon: ShieldAlert, label: 'Security', module: 'security' },
  { icon: UserPlus, label: 'Invites', module: 'invites' },
  { icon: Settings, label: 'Settings', module: 'settings' },
  { icon: ShieldAlert, label: 'Anti-Nuke', module: 'antinuke' },
  { icon: Mic, label: 'Temp Voice', module: 'tempvoice' },
  { icon: BarChart3, label: 'Analytics', module: 'analytics' },
  { icon: Bot, label: 'Moderation', module: 'moderation' },
  { icon: Database, label: 'Backup', module: 'backup' },
  { icon: FileCode, label: 'Embeds', module: 'embedbuilder' },
  { icon: Crown, label: 'Premium', module: 'premium' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (module: string) => location.pathname.includes(`/dashboard/${module}`);

  const content = (
    <>
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/dashboard/home" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-yellow flex items-center justify-center neon-glow">
            <Crown className="w-6 h-6 text-dark-900" />
          </div>
          <span className="text-xl font-bold text-neon-green neon-text tracking-wider">CIVRAT</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, module }) => (
          <Link key={module} to={`/dashboard/${module}`} onClick={() => setIsOpen(false)}
            className={isActive(module) ? 'sidebar-link-active' : 'sidebar-link'}>
            <Icon className="w-5 h-5 shrink-0" /><span className="text-sm">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-white/10">
        <div className="glass rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-1"><Crown className="w-4 h-4 text-neon-yellow" /><span className="text-xs font-semibold text-neon-yellow">Premium</span></div>
          <p className="text-[11px] text-dark-300">Unlock all features</p>
        </div>
      </div>
      {user && (
        <div className="px-3 py-3 border-t border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-dark-500 flex items-center justify-center text-neon-green font-bold text-sm border border-neon-green/30">{user.username.charAt(0)}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{user.username}</p><p className="text-xs text-dark-300">#{user.discriminator}</p></div>
          </div>
          <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-300 hover:text-error hover:bg-error/10 transition-colors">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass text-white">
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsOpen(false)} />}
      <aside className="hidden lg:flex flex-col w-60 bg-dark-800/80 backdrop-blur-xl border-r border-white/10 fixed h-screen left-0 top-0 z-40">{content}</aside>
      <aside className={cn('lg:hidden flex flex-col fixed h-screen w-60 left-0 top-0 z-40 bg-dark-800/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300', isOpen ? 'translate-x-0' : '-translate-x-full')}>{content}</aside>
    </>
  );
}
