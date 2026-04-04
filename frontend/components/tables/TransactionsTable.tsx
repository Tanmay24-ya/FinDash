'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Trash2, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Tag,
  CircleArrowUp,
  CircleArrowDown,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function TransactionsTable({ 
  transactions, 
  pagination, 
  onPageChange, 
  onSearch, 
  onDelete,
  loading 
}: { 
  transactions: any[], 
  pagination: any, 
  onPageChange: (p: number) => void,
  onSearch: (s: string) => void,
  onDelete: (id: string) => void,
  loading?: boolean 
}) {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => onSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.amount,
      t.note || ''
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card overflow-hidden p-0 flex flex-col h-full shadow-2xl">
      {/* Table Header / Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="relative group max-w-sm w-full">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
           <input 
             type="text" 
             placeholder="Search transactions..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full h-12 pl-12 pr-6 rounded-2xl bg-muted/30 border border-white/10 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
           />
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={exportToCSV}
             className="flex h-12 items-center gap-2 px-6 rounded-2xl bg-muted hover:bg-muted/60 transition-all font-bold text-sm border border-white/5 active:scale-95"
           >
              <Download size={18} /> Export
           </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10">
              <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground tracking-widest">Transaction</th>
              <th className="px-6 py-4 text-xs font-black uppercase text-muted-foreground tracking-widest">Category</th>
              <th className="hidden lg:table-cell px-6 py-4 text-xs font-black uppercase text-muted-foreground tracking-widest">Date</th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase text-muted-foreground tracking-widest">Amount</th>
              {user?.role === 'ADMIN' && <th className="px-6 py-4 text-right text-xs font-black uppercase text-muted-foreground tracking-widest">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td colSpan={5} className="px-6 py-4"><div className="h-10 w-full shimmer-loading rounded-xl" /></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground font-bold italic">No transactions found...</td>
                </tr>
              ) : (
                transactions.map((t, idx) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg",
                          t.type === 'INCOME' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                          {t.type === 'INCOME' ? <CircleArrowUp size={22} /> : <CircleArrowDown size={22} />}
                        </div>
                        <div>
                          <p className="text-sm font-black truncate max-w-[150px]">{t.note || 'No Note'}</p>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-3 py-1 bg-muted/40 rounded-full w-fit">
                          <Tag size={12} className="text-primary" /> {t.category}
                       </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-5">
                       <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <Calendar size={14} /> {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <p className={cn(
                         "text-lg font-black tracking-tight",
                         t.type === 'INCOME' ? "text-emerald-500" : "text-rose-500"
                       )}>
                         {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                       </p>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="h-9 w-9 rounded-xl flex items-center justify-center text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 active:scale-95"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
         <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">
            Showing <span className="text-white">{transactions.length}</span> of <span className="text-white">{pagination?.totalCount || 0}</span>
         </p>
         <div className="flex items-center gap-2">
            <button 
              disabled={pagination?.currentPage <= 1 || loading}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted border border-white/5 disabled:opacity-30 hover:bg-white/10 active:scale-95 transition-all"
            >
               <ChevronLeft size={20} />
            </button>
            <div className="px-4 h-10 flex items-center justify-center rounded-xl bg-primary/20 border border-primary/20 font-black text-sm text-primary">
               {pagination?.currentPage}
            </div>
            <button 
              disabled={pagination?.currentPage >= (pagination?.totalPages || 0) || loading}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted border border-white/5 disabled:opacity-30 hover:bg-white/10 active:scale-95 transition-all"
            >
               <ChevronRight size={20} />
            </button>
         </div>
      </div>
    </div>
  );
}
