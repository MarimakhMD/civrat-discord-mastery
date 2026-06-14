import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { GuildProvider } from '@/context/GuildContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Callback from '@/pages/auth/Callback';
import GuildSelect from '@/pages/dashboard/GuildSelect';
import Home from '@/pages/dashboard/modules/Home';
import Welcome from '@/pages/dashboard/modules/Welcome';
import Tickets from '@/pages/dashboard/modules/Tickets';
import Logs from '@/pages/dashboard/modules/Logs';
import AutoMod from '@/pages/dashboard/modules/AutoMod';
import Captcha from '@/pages/dashboard/modules/Captcha';
import XPLevels from '@/pages/dashboard/modules/XPLevels';
import Giveaways from '@/pages/dashboard/modules/Giveaways';
import Languages from '@/pages/dashboard/modules/Languages';
import Suggestions from '@/pages/dashboard/modules/Suggestions';
import Security from '@/pages/dashboard/modules/Security';
import Invites from '@/pages/dashboard/modules/Invites';
import Settings from '@/pages/dashboard/modules/Settings';
import AntiNuke from '@/pages/dashboard/modules/AntiNuke';
import TempVoice from '@/pages/dashboard/modules/TempVoice';
import Analytics from '@/pages/dashboard/modules/Analytics';
import Premium from '@/pages/dashboard/modules/Premium';
import Backup from '@/pages/dashboard/modules/Backup';
import EmbedBuilder from '@/pages/dashboard/modules/EmbedBuilder';
import Moderation from '@/pages/dashboard/modules/Moderation';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GuildProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/dashboard/guilds" element={<GuildSelect />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="welcome" element={<Welcome />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="logs" element={<Logs />} />
              <Route path="automod" element={<AutoMod />} />
              <Route path="captcha" element={<Captcha />} />
              <Route path="xplevels" element={<XPLevels />} />
              <Route path="giveaways" element={<Giveaways />} />
              <Route path="languages" element={<Languages />} />
              <Route path="suggestions" element={<Suggestions />} />
              <Route path="security" element={<Security />} />
              <Route path="invites" element={<Invites />} />
              <Route path="settings" element={<Settings />} />
              <Route path="antinuke" element={<AntiNuke />} />
              <Route path="tempvoice" element={<TempVoice />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="premium" element={<Premium />} />
              <Route path="backup" element={<Backup />} />
              <Route path="embedbuilder" element={<EmbedBuilder />} />
              <Route path="moderation" element={<Moderation />} />
            </Route>
          </Routes>
        </GuildProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
