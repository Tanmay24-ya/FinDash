'use client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Layers, Calendar, LayoutGrid, Info, Activity, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...args: any[]) => twMerge(clsx(args));

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Analytics({ monthlyTrends, dailyTrends, categoryBreakdown, loading }: { monthlyTrends: any[], dailyTrends: any[], categoryBreakdown: any[], loading?: boolean }) {
  const [view, setView] = useState<'monthly' | 'daily'>('monthly');

  // Filter out non-expense categories for breakdown (e.g. Salary as income)
  const expenseBreakdown = categoryBreakdown
    .filter(c => c.expense > 0 && c.category.toLowerCase() !== 'salary')
    .sort((a, b) => b.expense - a.expense);

  const activeData = view === 'monthly' ? monthlyTrends : dailyTrends;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Financial Trends Area Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass-card p-8 lg:col-span-2 min-h-[500px]"
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <h3 className="text-3xl font-black tracking-tighter gradient-text">Wealth Velocity</h3>
             <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">Financial Performance Radar</p>
          </div>
          
          <div className="flex h-12 p-1.5 rounded-2xl bg-muted/30 border border-white/5">
             <button 
               onClick={() => setView('monthly')}
               className={cn(
                 "flex items-center gap-2 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                 view === 'monthly' ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-foreground"
               )}
             >
                <Calendar size={14} /> Monthly
             </button>
             <button 
               onClick={() => setView('daily')}
               className={cn(
                 "flex items-center gap-2 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                 view === 'daily' ? "bg-primary text-white shadow-xl" : "text-muted-foreground hover:text-foreground"
               )}
             >
                <Activity size={14} /> Daily
             </button>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {loading ? (
             <div className="h-full w-full shimmer-loading rounded-2xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                   <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#ffffff08" />
                <XAxis 
                  dataKey={view === 'monthly' ? 'month' : 'date'} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  interval={view === 'daily' ? 4 : 0}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', backdropFilter: 'blur(20px)', color: 'white', fontWeight: 'bold' }}
                   cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#6366f1" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorInc)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#f43f5e" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorExp)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Category Breakdown Pie Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-card p-8 min-h-[500px]"
      >
        <div className="mb-12">
            <h3 className="text-2xl font-black tracking-tighter gradient-text">Expense Allocation</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">Dynamic Sector Partitioning</p>
        </div>

        <div className="h-[300px] w-full relative">
           {loading ? (
             <div className="h-full w-full shimmer-loading rounded-full" />
           ) : (
             <>
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="45%"
                      innerRadius={80}
                      outerRadius={105}
                      paddingAngle={8}
                      dataKey="expense"
                      nameKey="category"
                      animationDuration={2000}
                      stroke="none"
                   >
                     {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="focus:outline-none transition-all duration-500 hover:opacity-80" />
                     ))}
                   </Pie>
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: 'none', borderRadius: '24px', color: 'white', fontWeight: 'black', padding: '16px 20px' }}
                      itemStyle={{ color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               
               {/* Central Label */}
               <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-4 pointer-events-none">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Outflow</span>
                  <span className="text-xl font-black">₹{expenseBreakdown.reduce((s, c) => s + c.expense, 0).toLocaleString()}</span>
               </div>
             </>
           )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {expenseBreakdown.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/20 border border-white/5">
                 <div className="h-2 w-2 rounded-full shadow-lg" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{cat.category}</span>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
