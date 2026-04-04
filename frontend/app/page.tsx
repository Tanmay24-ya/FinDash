'use client';
import { motion } from 'framer-motion';
import { IndianRupee, ArrowRight, ShieldCheck, PieChart, Activity, Code } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      {/* Hero Header */}
      <nav className="relative z-10 flex items-center justify-between p-8 max-w-7xl mx-auto w-full">
         <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
               <IndianRupee size={22} />
            </div>
            <span className="text-2xl font-black gradient-text tracking-tighter">FinDash</span>
         </div>
         <div className="flex items-center gap-8">
            <Link href="https://github.com/Tanmay24-ya/FinDash" target="_blank" className="text-muted-foreground hover:text-foreground transition-all"><Code size={20} /></Link>
            <Link href="/login" className="px-8 py-3 rounded-2xl bg-muted font-black text-sm uppercase tracking-widest hover:bg-muted/60 transition-all border border-white/5 active:scale-95 shadow-sm">Authorize Session</Link>
         </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-4xl space-y-10"
         >
            <div className="mx-auto h-12 w-fit px-6 rounded-full glass bg-primary/10 border-primary/20 flex items-center gap-3 mb-12">
               <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Enterprise Financial Intelligence Layer</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
               Track Assets. <br />
               Scale <span className="gradient-text italic">Wealth.</span>
            </h1>

            <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto leading-relaxed">
               An extraordinary dashboard for professional financial ledgering. <br /> Secure, analytical, and optimized for strategic wealth growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
               <Link href="/register" className="h-18 w-full sm:w-64 flex items-center justify-center gap-3 gradient-primary rounded-3xl text-white font-black text-xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-105 active:scale-95 transition-all group">
                  Deploy Identity <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href="/login" className="h-18 w-full sm:w-64 flex items-center justify-center glass rounded-3xl font-black text-xl hover:bg-white/5 active:scale-95 transition-all text-muted-foreground hover:text-white">
                  Establish Session
               </Link>
            </div>
         </motion.div>

         {/* Stats Ticker */}
         <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto w-full">
            <FeatureCard icon={ShieldCheck} title="Zero Trust Security" desc="End-to-end encrypted ledger data." />
            <FeatureCard icon={PieChart} title="Deep Analytics" desc="Category and monthly trend computation." />
            <FeatureCard icon={Activity} title="Real-time Engine" desc="Instant dashboard state synchronization." />
         </div>
      </main>

      <footer className="relative z-10 p-12 text-center text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px]">
         &copy; 2026 FinDash Infrastructure Group. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 glass-card border-none bg-white/5 shadow-none"
    >
       <Icon className="text-primary mb-6" size={32} />
       <h3 className="text-lg font-black tracking-tight mb-2 uppercase">{title}</h3>
       <p className="text-sm text-muted-foreground font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );
}
