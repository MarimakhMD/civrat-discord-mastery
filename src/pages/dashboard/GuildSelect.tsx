import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users, Check, ArrowRight, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGuild } from '@/context/GuildContext';
import { cn, getGuildIconUrl, formatNumber } from '@/lib/utils';

export default function GuildSelect() {
  const navigate = useNavigate();
  const { guilds } = useAuth();
  const { selectGuild } = useGuild();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredGuilds = useMemo(() => {
    if (!search.trim()) return guilds;
    return guilds.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [guilds, search]);

  const handleSelect = (guildId: string) => {
    setSelectedId(guildId); selectGuild(guildId); navigate('/dashboard/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green opacity-5 rounded-full blur-3xl" animate={{ y: [0, -100, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>
      <div className="relative z-10 glass border-b border-neon-green/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold mb-2">Select Your <span className="text-neon-green neon-text">Server</span></h1>
          <p className="text-dark-300">Choose a server to manage with CIVRAT</p>
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-green" />
          <input type="text" placeholder="Search servers..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-12 py-4" />
        </div>
        {filteredGuilds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGuilds.map((guild, i) => (
              <motion.button key={guild.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(guild.id)} disabled={selectedId === guild.id} className="module-card text-left group">
                <div className="mb-4 relative">
                  <div className="w-16 h-16 rounded-xl bg-dark-600 flex items-center justify-center text-2xl font-bold text-neon-green">{guild.name.charAt(0)}</div>
                  {guild.bot_present && <div className="absolute -bottom-1 -right-1 bg-neon-green rounded-full p-1 text-dark-900"><Check className="w-3 h-3" /></div>}
                  {(guild.owner || guild.permissions === 0x8) && <div className="absolute top-0 right-0 bg-neon-yellow rounded-full p-1 text-dark-900"><Shield className="w-3 h-3" /></div>}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{guild.name}</h3>
                <div className="flex items-center gap-2 text-dark-300 text-sm mb-3"><Users className="w-4 h-4" />{formatNumber(guild.member_count)} members</div>
                {guild.bot_present ? <span className="inline-block bg-neon-green/20 text-neon-green text-xs font-semibold px-3 py-1 rounded-full">Bot Installed</span> : <span className="inline-block bg-neon-yellow/20 text-neon-yellow text-xs font-semibold px-3 py-1 rounded-full">Setup Needed</span>}
                <div className="flex items-center gap-2 text-neon-green font-semibold text-sm mt-3">
                  {selectedId === guild.id ? <><Loader2 className="w-4 h-4 animate-spin" />Loading...</> : <>Select <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><Shield className="w-16 h-16 text-dark-400 mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">No Servers Found</h3><p className="text-dark-300">No servers match your search.</p></div>
        )}
      </div>
    </div>
  );
}