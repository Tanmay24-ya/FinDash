'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { TransactionsTable } from '@/components/tables/TransactionsTable';
import { 
  IndianRupee, 
  RefreshCw, 
  Search, 
  Calendar,
  Filter,
  Layers,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Protected from '@/components/layout/Protected';

export default function TransactionsPage() {
  const [recordsData, setRecordsData] = useState<{ data: any[], pagination: any }>({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', type: '', category: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        search: filters.search,
        ...(filters.type && { type: filters.type }),
        ...(filters.category && { category: filters.category })
      });
      const res = await api.get(`/records?${queryParams}`);
      setRecordsData(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Error loading ledger');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/records/${id}`);
      toast.success('Record purged safely');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/5">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
         >
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
               <Layers className="text-primary" size={40} />
               Financial Ledger
            </h1>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-[11px] mt-2 pl-12 flex items-center gap-2">
               <Activity size={14} className="text-primary" /> Full-Spectrum Transaction audit
            </p>
         </motion.div>

         <div className="flex items-center gap-3">
            {/* Quick Filter Selectors */}
            <select 
               value={filters.type}
               onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
               className="h-14 px-6 glass rounded-2xl font-black text-xs uppercase tracking-widest outline-none border border-white/5 focus:border-primary transition-all cursor-pointer"
            >
               <option value="">All Flow Types</option>
               <option value="INCOME">Income Only</option>
               <option value="EXPENSE">Expense Only</option>
            </select>
            
            <button 
              onClick={() => fetchData()}
              className="h-14 w-14 rounded-2xl glass flex items-center justify-center hover:bg-muted/50 transition-all active:rotate-180 duration-500"
            >
               <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
            </button>
         </div>
      </header>

      {/* Main Table Section */}
      <div className="space-y-6">
         <div className="flex flex-col lg:flex-row gap-6">
            {/* Quick Stats Sidebar (Mini) */}
            <div className="lg:w-1/4 space-y-6">
               <div className="glass-card p-6 bg-linear-to-br from-primary/10 to-transparent border-primary/20">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                     <Calendar size={14} /> Audit Period
                  </h3>
                  <p className="text-2xl font-black tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-2 leading-relaxed italic opacity-70">
                     Viewing deep ledger records for current fiscal session.
                  </p>
               </div>
               
               <div className="p-6 rounded-3xl bg-muted/30 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Ledger Count</span>
                     <span className="text-primary font-black">{recordsData.pagination?.totalCount || 0}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-primary" 
                     />
                  </div>
               </div>
            </div>

            {/* Expansive Table */}
            <div className="lg:flex-1">
               <TransactionsTable
                  transactions={recordsData.data}
                  pagination={recordsData.pagination}
                  loading={loading}
                  onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
                  onSearch={(s) => setFilters(prev => ({ ...prev, search: s, page: 1 }))}
                  onDelete={handleDelete}
               />
            </div>
         </div>
      </div>
    </div>
  );
}
