import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Ticket, AlertTriangle, Gift, Lock, BarChart3, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  { icon: Shield, title: 'Auto Moderation', description: 'Intelligent content filtering and spam prevention' },
  { icon: Users, title: 'Welcome System', description: 'Customizable welcome messages and member roles' },
  { icon: Zap, title: 'XP & Levels', description: 'Gamification system to boost member engagement' },
  { icon: Ticket, title: 'Ticket System', description: 'Professional support ticket management' },
  { icon: AlertTriangle, title: 'Anti-Nuke Protection', description: 'Advanced protection against raids and attacks' },
  { icon: Gift, title: 'Giveaways', description: 'Easy to set up and manage server giveaways' },
  { icon: Lock, title: 'Captcha Verification', description: 'Prevent bots with advanced verification' },
  { icon: BarChart3, title: 'Analytics', description: 'Real-time insights into server activity' },
];

const stats = [{ label: 'Servers', value: '50K+' }, { label: 'Users', value: '2M+' }, { label: 'Commands', value: '100+' }];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green opacity-5 rounded-full blur-3xl" animate={{ y: [0, -100, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-yellow opacity-5 rounded-full blur-3xl" animate={{ y: [0, 100, 0] }} transition={{ duration: 10, repeat: Infinity }} />
      </div>
      <nav className="relative z-10 glass border-b border-neon-green/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div className="text-2xl font-bold tracking-wider" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-neon-green neon-text">CIV</span><span className="text-neon-yellow neon-text-yellow">RAT</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/login" className="btn-primary">Login</Link>
          </motion.div>
        </div>
      </nav>
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div className="text-center" variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">The Ultimate</span><br />
            <span className="text-neon-green neon-text">Discord Bot</span><br />
            <span className="text-neon-yellow neon-text-yellow">Dashboard</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
            Manage your server with powerful tools. Moderation, giveaways, levels, tickets, and more - all in one place.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary flex items-center gap-2 text-lg px-8 py-4 group">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {stats.map((stat, i) => (
            <motion.div key={i} className="module-card text-center" whileHover={{ scale: 1.05 }}>
              <div className="text-4xl font-bold text-neon-green mb-2">{stat.value}</div><div className="text-dark-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4"><span className="text-neon-green">Powerful</span> Features</h2></div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} variants={itemVariants} className="module-card" whileHover={{ scale: 1.05, y: -5 }}>
                <div className="w-12 h-12 rounded-lg bg-neon-green/20 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-neon-green" /></div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3><p className="text-dark-300 text-sm">{f.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">Simple <span className="text-neon-yellow">Pricing</span></h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card"><h3 className="text-2xl font-bold text-white mb-2">Free</h3><p className="text-dark-300 mb-6">Perfect for getting started</p><div className="text-3xl font-bold text-neon-green mb-8">$0</div>
            <ul className="space-y-3 mb-8">{['Auto Moderation', 'Welcome System', 'Basic Analytics'].map((f, i) => <li key={i} className="flex items-center gap-3 text-dark-300"><div className="w-2 h-2 rounded-full bg-neon-green" />{f}</li>)}</ul>
            <button className="btn-secondary w-full">Get Started</button>
          </div>
          <div className="card border-neon-green/30 bg-gradient-to-br from-neon-green/5 to-neon-yellow/5 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-neon-yellow text-dark-900 px-3 py-1 rounded-full text-sm font-semibold">Popular</div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3><p className="text-dark-300 mb-6">For serious server management</p><div className="text-3xl font-bold text-neon-yellow mb-8">$4.99/mo</div>
            <ul className="space-y-3 mb-8">{['Everything in Free', 'XP & Levels', 'Anti-Nuke', 'Advanced Analytics', 'Priority Support'].map((f, i) => <li key={i} className="flex items-center gap-3 text-dark-300"><div className="w-2 h-2 rounded-full bg-neon-yellow" />{f}</li>)}</ul>
            <button className="btn-primary w-full">Upgrade Now</button>
          </div>
        </div>
      </section>
      <footer className="relative z-10 border-t border-neon-green/20 glass mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold tracking-wider"><span className="text-neon-green">CIV</span><span className="text-neon-yellow">RAT</span></div>
            <p className="text-dark-300 text-sm">2024 CIVRAT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}