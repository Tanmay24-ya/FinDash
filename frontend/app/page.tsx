'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IndianRupee, ArrowRight, ShieldCheck, PieChart, Activity, Code, Zap, Globe, Cpu, Rocket, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  if (!mounted) return null;

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
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020205] text-white relative overflow-hidden flex flex-col selection:bg-primary/50">
      
      {/* 🌌 HYPER-AESTHETIC MESH GRADIENT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen animate-pulse" 
        />
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] mix-blend-screen" 
        />
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[100px] animate-[pulse_10s_infinite]" />
      </div>

      {/* 🕸️ SCI-FI DOT GRID */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020205_100%)]" />

      {/* 🛰️ FLOATING ARCHITECTURE PREVIEW */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
        />
        <motion.div 
           animate={{ rotate: -360 }} 
           transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 border-dashed rounded-full"
        />
      </div>

      {/* 🛸 PREMIUM NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between p-8 max-w-7xl mx-auto w-full">
         <motion.div 
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-4 group cursor-pointer"
         >
            <div className="relative h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-primary/50">
               <div className="absolute inset-0 bg-linear-to-br from-primary to-indigo-600 opacity-20 group-hover:opacity-40 transition-opacity" />
               <IndianRupee size={32} className="text-white relative z-10" />
            </div>
            <div className="flex flex-col -space-y-1">
               <span className="text-3xl font-black tracking-tighter uppercase font-mono italic">FinDash</span>
               <span className="text-[10px] font-black tracking-[0.6em] uppercase text-primary">Intelligence Node</span>
            </div>
         </motion.div>
         
         <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-6"
         >
            <Link href="/login" className="px-10 py-4 rounded-full glass-strong border-white/10 hover:border-primary/50 text-white font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <span className="relative z-10">Access Vault</span>
            </Link>
         </motion.div>
      </nav>

      {/* 💎 KINETIC HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
         <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="max-w-6xl space-y-12"
         >
            {/* 🆕 SMART BADGE */}
            <motion.div 
              variants={itemVariants}
              className="mx-auto flex h-14 w-fit px-8 rounded-full glass-strong border-white/10 bg-white/5 backdrop-blur-3xl items-center gap-4 group cursor-default hover:border-primary/40 transition-all"
            >
               <Sparkles size={18} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Quantum Financial Governance Active</span>
               <div className="h-6 w-[1px] bg-white/10" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">v4.0.0 Stable</span>
            </motion.div>

            {/* ⚡ TITANIC TYPOGRAPHY */}
            <motion.div 
              variants={itemVariants} 
              style={{ y: textY }}
              className="space-y-4"
            >
               <h1 className="text-[12vw] md:text-[9rem] font-black tracking-[-0.06em] leading-[0.8] text-white">
                  Wealth <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-br from-indigo-400 via-primary to-purple-600 italic">Architect.</span>
               </h1>
            </motion.h1>

            {/* 📝 SUB-NARRATIVE */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl text-muted-foreground font-black max-w-3xl mx-auto leading-relaxed tracking-tight uppercase italic opacity-60"
            >
               Deploy high-fidelity assets. Scale industrial wealth. <br className="hidden md:block" /> 
               The definitive <span className="text-white underline decoration-primary decoration-4 underline-offset-8">Zero-Trust</span> financial engine.
            </motion.p>

            {/* 🕹️ ACTION RADIUS */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10"
            >
               <Link href="/register" className="relative h-24 w-full md:w-80 flex items-center justify-center gap-5 bg-white text-black rounded-3xl font-black text-2xl shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden">
                  <Rocket size={28} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                  <span>Launch Node</span>
               </Link>
               
               <Link href="/login" className="h-24 w-full md:w-80 flex items-center justify-center glass-strong border-white/5 rounded-3xl font-black text-2xl hover:bg-white/5 active:scale-95 transition-all text-white hover:border-white/20 group">
                  Verify Session
                  <ChevronRight size={24} className="ml-2 group-hover:translate-x-2 transition-transform" />
               </Link>
            </motion.div>
         </motion.div>

         {/* 🌌 INFINITE PROTOCOL TICKER */}
         <div className="mt-32 w-full border-y border-white/5 bg-white/[0.02] backdrop-blur-md py-6 overflow-hidden">
            <div className="flex items-center gap-24 animate-marquee whitespace-nowrap opacity-30 select-none">
               <span className="text-sm font-black tracking-[1em] uppercase">Global Fiscal Resistance</span>
               <div className="h-2 w-2 rounded-full bg-primary" />
               <span className="text-sm font-black tracking-[1em] uppercase">Neural Wealth Agregation</span>
               <div className="h-2 w-2 rounded-full bg-primary" />
               <span className="text-sm font-black tracking-[1em] uppercase">Stateless Ledger Persistence</span>
               <div className="h-2 w-2 rounded-full bg-primary" />
               <span className="text-sm font-black tracking-[1em] uppercase">Global Fiscal Resistance</span>
               <div className="h-2 w-2 rounded-full bg-primary" />
               <span className="text-sm font-black tracking-[1em] uppercase">Neural Wealth Agregation</span>
            </div>
         </div>

         {/* 🕋 THE BENTO ARCHIVE */}
         <motion.div 
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="mt-20 grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto w-full px-6"
         >
            <BentoCard 
               className="md:col-span-4"
               icon={ShieldCheck} 
               title="Military Grade Security" 
               desc="Financial data scoped by cryptographic identity boundaries and sub-second validation layers." 
            />
            <BentoCard 
               className="md:col-span-2"
               icon={PieChart} 
               title="Neural Analytics" 
               desc="Dynamic computation of monthly velocity." 
            />
            <BentoCard 
               className="md:col-span-3"
               icon={Cpu} 
               title="The Core Engine" 
               desc="Next.js 15 powered infrastructure with hyper-optimized rendering." 
            />
            <BentoCard 
               className="md:col-span-3"
               icon={Globe} 
               title="Edge Synchronization" 
               desc="Real-time global persistence across all intelligence nodes." 
            />
         </motion.div>
      </main>

      <footer className="relative z-10 p-16 flex flex-col items-center gap-8 border-t border-white/5 bg-white/[0.01]">
         <div className="flex items-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
            <Code size={20} />
            <Activity size={20} />
            <Globe size={20} />
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/30">
            &copy; 2026 FinDash Cyber-Infrastructure. Forge Excellence.
         </p>
      </footer>
    </div>
  );
}

function BentoCard({ icon: Icon, title, desc, className }: any) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 0.98 }}
      className={cn(
        "p-10 glass-strong border-white/5 rounded-[2.5rem] text-left group overflow-hidden relative",
        className
      )}
    >
       <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
       
       <div className="relative z-10 space-y-6">
          <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
             <Icon size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-md text-muted-foreground font-black uppercase tracking-tight leading-relaxed opacity-40 group-hover:opacity-100 transition-opacity mt-2">{desc}</p>
          </div>
       </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
