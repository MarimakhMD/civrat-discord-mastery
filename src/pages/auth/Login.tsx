import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowLeft } from 'lucide-react';

const features = [{ icon: Shield, title: 'Secure', description: 'OAuth 2.0 verified' }, { icon: Zap, title: 'Fast', description: 'Instant access' }, { icon: Lock, title: 'Private', description: 'Your data is safe' }];

export default function Login() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green opacity-5 rounded-full blur-3xl" animate={{ y: [0, -100, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      </div>
      <div className="relative z-10 p-4"><Link to="/" className="flex items-center gap-2 text-dark-300 hover:text-neon-green transition-colors w-fit"><ArrowLeft className="w-4 h-4" />Back to Home</Link></div>
      <div className="relative z-10 min-h-[80vh] flex items-center justify-center px-4">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8"><div className="text-4xl font-bold tracking-wider mb-2"><span className="text-neon-green neon-text">CIV</span><span className="text-neon-yellow neon-text-yellow">RAT</span></div><p className="text-dark-300">Discord Bot Dashboard</p></div>
          <div className="card border-neon-green/30">
            <h1 className="text-2xl font-bold mb-2 text-white">Welcome Back</h1><p className="text-dark-300 mb-8">Sign in with your Discord account</p>
            <Link to="/dashboard" className="btn-primary w-full flex items-center justify-center gap-3 py-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3671a19.8062 19.8062 0 00-4.8851-1.5152.074.074 0 00-.0787.0366c-.211.3667-.444.8453-.607 1.223a18.9566 18.9566 0 00-5.487 0c-.165-.3816-.395-.8591-.609-1.223a.077.077 0 00-.0787-.0365 19.7514 19.7514 0 00-4.8852 1.515.077.077 0 00-.0358.0316C.5238 9.0957 1.173 13.698 4.872 15.9374a.08.08 0 00.087-.0328c.461-.6604.872-1.3547 1.221-2.063a.077.077 0 00-.0421-.107 12.906 12.906 0 01-1.848-.878.077.077 0 01-.008-.128 9.349 9.349 0 00.372-.294.077.077 0 01.08-.01c3.928 1.793 8.18 1.793 12.062 0a.077.077 0 01.083.011c.12.098.246.198.373.294a.077.077 0 01-.006.127 12.82 12.82 0 01-1.852.878.077.077 0 00-.041.107c.36.72.772 1.403 1.22 2.062a.077.077 0 00.084.034c3.702-2.246 4.35-6.859 1.905-10.6637a.0755.0755 0 00-.0368-.0316zM8.02 15.3312c-1.1825 0-2.1569-.9718-2.1569-2.1771 0-1.2053.9181-2.1771 2.1569-2.1771 1.2388 0 2.1705.9718 2.1568 2.1771 0 1.2053-.9181 2.1771-2.1568 2.1771zm7.9748 0c-1.1825 0-2.1569-.9718-2.1569-2.1771 0-1.2053.9181-2.1771 2.1569-2.1771 1.2388 0 2.1705.9718 2.1568 2.1771 0 1.2053-.918 2.1771-2.1568 2.1771z" /></svg>
              Login with Discord
            </Link>
            <div className="my-6 flex items-center gap-3"><div className="flex-1 h-px bg-white/10" /><span className="text-dark-300 text-sm">or</span><div className="flex-1 h-px bg-white/10" /></div>
            <Link to="/dashboard" className="btn-secondary w-full text-center py-3">Continue as Demo</Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {features.map((f, i) => { const Icon = f.icon; return (
              <div key={i} className="glass rounded-lg p-4 text-center hover:border-neon-green/30 transition-colors">
                <Icon className="w-6 h-6 text-neon-green mx-auto mb-2" /><h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4><p className="text-xs text-dark-300">{f.description}</p>
              </div>
            ); })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}