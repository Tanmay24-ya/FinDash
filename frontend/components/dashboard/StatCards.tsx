'use client';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Banknote, 
  Activity 
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const STAT_CONFIG = {
  income: {
    label: 'Total Income',
    icon: TrendingUp,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'bg-emerald-500',
  },
  expense: {
    label: 'Total Expenses',
    icon: Banknote,
    color: 'rose',
    gradient: 'from-rose-500/20 to-orange-500/10',
    iconColor: 'bg-rose-500',
  },
  balance: {
    label: 'Net Balance',
    icon: Wallet,
    color: 'violet',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconColor: 'bg-violet-500',
  },
  activity: {
    label: 'Total Activity',
    icon: Activity,
    color: 'blue',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'bg-blue-500',
  }
};

export function StatCards({ stats, loading }: { stats?: any, loading?: boolean }) {
  const cards = [
    { type: 'income', value: stats?.income?.value || 0, change: stats?.income?.change || 0 },
    { type: 'expense', value: stats?.expense?.value || 0, change: stats?.expense?.change || 0 },
    { type: 'balance', value: stats?.balance?.value || 0, change: stats?.balance?.change || 0 },
    { type: 'activity', value: stats?.activity?.value || 0, change: stats?.activity?.change || 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const config = STAT_CONFIG[card.type as keyof typeof STAT_CONFIG];
        const isPositive = card.change >= 0;
        
        return (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden glass-card p-6 border-white/5 bg-card/60"
          >
            <div className={cn(
              "absolute inset-0 -z-10 translate-y-full bg-linear-to-b group-hover:translate-y-0 transition-transform duration-700 opacity-20",
              config.gradient
            )} />

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">
                  {config.label}
                </p>
                {loading ? (
                   <div className="h-8 w-24 shimmer-loading rounded-lg" />
                ) : (
                  <h3 className="text-3xl font-black tracking-tighter">
                    {card.type === 'activity' ? card.value : `₹${card.value.toLocaleString()}`}
                  </h3>
                )}
              </div>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                config.iconColor
              )}>
                <config.icon className="text-white" size={24} />
              </div>
            </div>

            {loading ? (
                 <div className="h-5 w-16 shimmer-loading rounded-full" />
              ) : card.change !== null && (
                <>
                  <span className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full",
                    card.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {card.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(card.change).toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">vs last month</span>
                </>
              )}
          </motion.div>
        );
      })}
    </div>
  );
}
