'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IndianRupee, ArrowRight, ShieldCheck, PieChart, Activity, Code, Zap, Globe, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* 🔮 ADVANCED AMBIENT BACKGROUND */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[160px] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[160px] animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse" />
      
      {/* 🕸️ INTERACTIVE GRID */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#050505]/80 to-[#050505] pointer-events-none" />

      {/* 🚀 FLOATING GLASS ELEMENTS */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[10%] hidden lg:block h-32 w-32 glass border-white/10 rounded-3xl rotate-12 -z-0 opacity-40 shadow-2xl" 
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-[15%] hidden lg:block h-48 w-48 glass border-white/10 rounded-full -z-0 opacity-20 shadow-2xl" 
      />

      {/* 🛰️ PREMIUM NAV BAR */}
      <nav className="relative z-50 flex items-center justify-between p-8 max-w-7xl mx-auto w-full">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-3 group cursor-pointer"
         >
            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-[0_0_30px_-5px_var(--color-primary)] group-hover:rotate-12 transition-all duration-500">
               <IndianRupee size={28} />
            </div>
            <div className="flex flex-col -space-y-1">
               <span className="text-2xl font-black tracking-tighter uppercase italic">FinDash</span>
               <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">Intelligence</span>
            </div>
         </motion.div>
         
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-6"
         >
            <Link href="https://github.com/Tanmay24-ya/FinDash" target="_blank" className="text-muted-foreground hover:text-white transition-all hover:scale-110"><Code size={24} /></Link>
            <Link href="/login" className="px-8 py-3.5 rounded-2xl glass-strong font-black text-xs uppercase tracking-widest hover:border-primary/50 transition-all active:scale-95 shadow-xl">
               Authorize Vault
            </Link>
         </motion.div>
      </nav>

      {/* 🪐 CENTERPIECE HERO */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
         <motion.div
           style={{ opacity, scale }}
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="max-w-5xl space-y-12"
         >
            {/* STATUS CHIP */}
            <motion.div 
              variants={itemVariants}
              className="mx-auto h-12 w-fit px-6 rounded-full glass border-primary/30 flex items-center gap-4 bg-primary/5 backdrop-blur-3xl shadow-lg border hover:border-primary/60 transition-colors"
            >
               <div className="relative flex h-3 w-3">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-3 w-3 bg-primary"></div>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System Protocol v4.0.2 Active</span>
            </motion.div>

            {/* MAIN HEADLINE */}
            <motion.h1 
              variants={itemVariants}
              className="text-[12vw] md:text-[8rem] font-black tracking-[-0.05em] leading-[0.85] text-white mb-8"
            >
               Liquidity <br />
               <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/20 italic">Unlocked.</span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed tracking-tight"
            >
               An extraordinary dashboard for professional financial ledgering. <br className="hidden md:block" /> 
               Securely architected for <span className="text-white font-bold">Zero-Trust</span> wealth scalability.
            </motion.p>

            {/* CTA CLUSTER */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6"
            >
               <Link href="/register" className="h-20 w-full sm:w-72 flex items-center justify-center gap-4 gradient-primary rounded-3xl text-white font-black text-xl shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.5)] hover:-translate-y-2 active:scale-95 transition-all group">
                  <Zap size={24} className="fill-white group-hover:scale-125 transition-transform" />
                  Establish Node 
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
               </Link>
               <Link href="/login" className="h-20 w-full sm:w-72 flex items-center justify-center glass-strong rounded-3xl font-black text-xl hover:bg-white/10 active:scale-95 transition-all text-white border-white/20 hover:border-white/40">
                  Resurrect Session
               </Link>
            </motion.div>
         </motion.div>

         {/* 🌌 DYNAMIC STATUS TICKER */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5 }}
           className="mt-32 w-full max-w-7xl overflow-hidden py-10"
         >
            <div className="flex items-center gap-20 animate-[marquee_40s_linear_infinite] whitespace-nowrap opacity-20 hover:opacity-50 transition-opacity">
               <TickerItem icon={Globe} text="GLOBAL FISCAL PERSISTENCE" />
               <TickerItem icon={Cpu} text="NEURAL ANALYTICS ACTIVE" />
               <TickerItem icon={ShieldCheck} text="ZERO-TRUST GUARD PROTECTED" />
               <TickerItem icon={Activity} text="LEADERBOARD PULSE: 99.9% UPTIME" />
               <TickerItem icon={Globe} text="GLOBAL FISCAL PERSISTENCE" />
               <TickerItem icon={Cpu} text="NEURAL ANALYTICS ACTIVE" />
               <TickerItem icon={ShieldCheck} text="ZERO-TRUST GUARD PROTECTED" />
            </div>
         </motion.div>

         {/* 🏛️ FEATURES GRID */}
         <motion.div 
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-4"
         >
            <FeatureCard 
               icon={ShieldCheck} 
               title="Secure Vault" 
               desc="Financial data scoped by cryptographic identity boundaries." 
            />
            <FeatureCard 
               icon={PieChart} 
               title="Neural Analytics" 
               desc="Algorithmic computation of monthly velocity and trends." 
            />
            <FeatureCard 
               icon={Activity} 
               title="Live Ledger" 
               desc="Stateless synchronization with hyper-accurate data integrity." 
            />
         </motion.div>
      </main>

      <footer className="relative z-10 p-16 text-center text-muted-foreground/40 font-black uppercase tracking-[0.5em] text-[10px]">
         &copy; 2026 FinDash Cyber-Infrastructure Group. Built for Excellence.
      </footer>
   </div>
  );
}

function TickerItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-4">
      <Icon size={20} className="text-primary" />
      <span className="text-xl font-black tracking-widest italic">{text}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -15, borderColor: 'rgba(99, 102, 241, 0.4)' }}
      className="p-10 glass rounded-[2.5rem] border-white/5 transition-all text-left group flex flex-col items-start gap-4 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.2)]"
    >
       <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
          <Icon size={32} />
       </div>
       <h3 className="text-2xl font-black tracking-tight mt-4 uppercase italic group-hover:text-primary transition-colors">{title}</h3>
       <p className="text-md text-muted-foreground font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
    </motion.div>
  );
}
