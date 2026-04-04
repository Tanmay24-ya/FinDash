'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { StatCards } from '@/components/dashboard/StatCards';
import { Analytics } from '@/components/dashboard/Analytics';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { TransactionsTable } from '@/components/tables/TransactionsTable';
import { 
  Plus, 
  RefreshCw,
  LayoutGrid,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recordsData, setRecordsData] = useState<{ data: any[], pagination: any }>({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 5, search: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [dbRes, recordsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get(`/records?page=${filters.page}&limit=${filters.limit}&search=${filters.search}`)
      ]);
      setDashboardData(dbRes.data);
      setRecordsData(recordsRes as any); 
    } catch (err: any) {
      toast.error(err.message || 'Error loading dashboard');
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
      toast.success('Transaction removed');
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
         >
            <h1 className="text-4xl font-black tracking-tighter">Welcome Back, <span className="gradient-text">{user?.name}</span></h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
               <Info size={14} className="text-primary" />
               Current Liquidity Architecture for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
         </motion.div>

         <div className="flex items-center gap-3">
            <button 
              disabled={user?.role === 'VIEWER'}
              onClick={() => setShowForm(true)}
              className="flex h-14 items-center gap-2 px-8 rounded-2xl gradient-primary text-white font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
               <Plus size={22} /> New Entry
            </button>
            <button 
              onClick={() => fetchData()}
              className="h-14 w-14 rounded-2xl glass flex items-center justify-center hover:bg-muted/50 transition-all active:rotate-180 duration-500"
            >
               <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
            </button>
         </div>
      </header>

      {/* Dynamic Summary Cards with Real-Time Delta % */}
      <StatCards stats={dashboardData?.stats} loading={loading} />

      {/* Analytics Visualization with Day/Month View */}
      <Analytics 
        monthlyTrends={dashboardData?.monthlyTrends || []} 
        dailyTrends={dashboardData?.dailyTrends || []}
        categoryBreakdown={dashboardData?.categoryBreakdown || []} 
        loading={loading} 
      />

      {/* Recent Activity Table */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg border border-primary/20">
                  <LayoutGrid size={22} />
               </div>
               <h3 className="text-2xl font-black tracking-tight">System Ledger</h3>
            </div>
         </div>
         <TransactionsTable
            transactions={recordsData.data}
            pagination={recordsData.pagination}
            loading={loading}
            onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
            onSearch={(s) => setFilters(prev => ({ ...prev, search: s, page: 1 }))}
            onDelete={handleDelete}
         />
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowForm(false)} 
               className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
             />
             <div className="z-10 w-full max-w-md">
                <TransactionForm onClose={() => setShowForm(false)} onRefresh={fetchData} />
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
