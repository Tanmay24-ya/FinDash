'use client';
import { motion } from 'framer-motion';
import { IndianRupee, ShieldCheck, PieChart, Activity, Globe, Cpu, Rocket, Sparkles, ChevronRight, BarChart3, Lock, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  if (!mounted) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white relative flex flex-col font-sans selection:bg-primary/30">
      
      {/* 🔮 ELEGANT BACKGROUND AMBIANCE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      {/* 🛸 NAVIGATION BAR */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto w-full">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
               <IndianRupee size={24} className="text-primary" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase font-mono">FinDash</span>
         </motion.div>
         <Link href="/login" className="text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95">
            Institutional Login
         </Link>
      </nav>

      {/* 🏛️ PROFESSIONAL HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl space-y-10">
            
            <motion.div variants={itemVariants} className="mx-auto w-fit px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] flex items-center gap-3">
               <Zap size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Industrial Fiscal Intelligence Platform</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
               MASTER YOUR <br />
               <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-primary to-indigo-400">LIQUIDITY.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed border-l-2 border-primary/40 pl-6 text-left italic">
               FinDash provides a high-fidelity vantage point over your assets. 
               Deploy sovereign wealth tracking with sub-second precision and enterprise-grade security.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
               <Link href="/register" className="h-20 w-full md:w-72 flex items-center justify-center gap-3 bg-white text-black rounded-2xl font-black text-xl hover:bg-white/90 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]">
                  Register Clearance <ArrowRight size={20} />
               </Link>
               <Link href="/login" className="h-20 w-full md:w-72 flex items-center justify-center gap-3 bg-muted/20 border border-white/5 rounded-2xl font-black text-xl hover:bg-muted/40 active:scale-95 transition-all">
                  Existing Vault
               </Link>
            </motion.div>
         </motion.div>

         {/* 🍱 THE PROFESSIONAL BENTO GRID (Static & Eye-Catching) */}
         <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full px-6 pb-20">
            
            <BentoCard 
              icon={Lock} 
              title="Sovereign Security" 
              desc="JWT-layered stateless auth with strict RBAC governance." 
              className="md:col-span-2 bg-linear-to-br from-white/5 to-transparent"
            />
            
            <BentoCard 
              icon={BarChart3} 
              title="Asset Velocity" 
              desc="Real-time wealth tracking charts." 
              className="md:col-span-1 border-primary/20 bg-primary/5"
            />

            <BentoCard 
              icon={Globe} 
              title="Global Ledger" 
              desc="Unified tracking for all fiscal protocols." 
              className="md:col-span-1"
            />

            <BentoCard 
              icon={ShieldCheck} 
              title="Audit Trails" 
              desc="Soft-delete persistence for full fiscal compliance." 
              className="md:col-span-2 bg-linear-to-bl from-white/5 to-transparent border-indigo-500/10"
            />

         </div>
      </main>

      <footer className="relative z-10 p-12 border-t border-white/5 text-center bg-black/50 backdrop-blur-xl">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">
            FinDash Professional &copy; 2026. Industrial Grade Fiscal Tech.
         </p>
      </footer>
    </div>
  );
}

function BentoCard({ icon: Icon, title, desc, className }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative group p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col items-start gap-8 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]",
        className
      )}
    >
       <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
          <Icon size={32} />
       </div>
       <div className="space-y-2 text-left">
          <h3 className="text-2xl font-black tracking-tighter uppercase italic">{title}</h3>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide leading-relaxed">{desc}</p>
       </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

function ArrowRight({ size }: { size: number }) {
  return <ChevronRight size={size} />;
}
