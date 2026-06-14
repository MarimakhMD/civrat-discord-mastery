import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGuild } from '@/context/GuildContext';
import { cn, getGuildIconUrl } from '@/lib/utils';

export function TopBar() {
  const [guildMenuOpen, setGuildMenuOpen] = useState(false);
  const location = useLocation();
  const { user, guilds } = useAuth();
  const { selectedGuildId, selectGuild } = useGuild();
  const selectedGuild = guilds.find(g => g.id === selectedGuildId);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const moduleName = pathParts[2];
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard/home' },
    ...(moduleName && moduleName !== 'home' ? [{ label: moduleName.charAt(0).toUpperCase() + moduleName.slice(1), path: location.pathname }] : []),
  ];

  return (
    <header className="glass fixed top-0 right-0 left-0 lg:left-60 h-16 border-b border-white/10 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 text-dark-300" />}
              <Link to={crumb.path} className={cn('transition-colors', i === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-dark-300 hover:text-white')}>{crumb.label}</Link>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {selectedGuild && (
            <div className="relative hidden sm:block">
              <button onClick={() => setGuildMenuOpen(!guildMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass glass-hover">
                <div className="w-6 h-6 rounded-full bg-dark-500 flex items-center justify-center text-xs font-bold text-neon-green">{selectedGuild.name.charAt(0)}</div>
                <span className="text-sm text-white max-w-[100px] truncate">{selectedGuild.name}</span>
                <ChevronDown className={cn('w-4 h-4 text-dark-300 transition-transform', guildMenuOpen && 'rotate-180')} />
              </button>
              {guildMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-dark-700 rounded-lg border border-white/10 shadow-xl z-50 p-2">
                  <div className="text-[10px] font-semibold text-dark-300 px-3 py-1.5 uppercase tracking-wider">Switch Server</div>
                  {guilds.map(g => (
                    <button key={g.id} onClick={() => { selectGuild(g.id); setGuildMenuOpen(false); }}
                      className={cn('w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors', g.id === selectedGuildId ? 'bg-neon-green/10 text-neon-green' : 'text-white hover:bg-white/5')}>
                      <div className="w-5 h-5 rounded-full bg-dark-500 flex items-center justify-center text-[10px] font-bold text-neon-green">{g.name.charAt(0)}</div>
                      <span className="truncate">{g.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className="relative p-2 rounded-lg glass glass-hover"><Bell className="w-4 h-4 text-dark-300" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" /></button>
          {user && (
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <span className="hidden sm:block text-sm font-medium text-white">{user.username}</span>
              <div className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center text-neon-green font-bold text-xs border border-neon-green/30">{user.username.charAt(0)}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
