'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Plus, 
  Minus, 
  Tag, 
  Calendar as CalIcon, 
  IndianRupee, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import React, { useState } from 'react';
import { CustomSelect } from '@/components/ui/CustomSelect';

const CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Food', 'Rent', 'Travel', 'Shopping', 'Entertainment', 'Others'
];

const recordSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
});

type RecordFormData = z.infer<typeof recordSchema>;

export function TransactionForm({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
      category: 'Food'
    }
  });

  const currentType = watch('type');
  const currentCategory = watch('category');

  // Intelligent Category Logic: Auto-switch INCOME/EXPENSE
  React.useEffect(() => {
    if (['Salary', 'Freelance', 'Investment'].includes(currentCategory)) {
        setValue('type', 'INCOME');
    } else {
        setValue('type', 'EXPENSE');
    }
  }, [currentCategory, setValue]);

  const onSubmit = async (data: RecordFormData) => {
    try {
      setLoading(true);
      await api.post('/records', data);
      toast.success('Transaction noted successfully! 🚀', {
        position: "top-right",
        theme: "dark",
        style: { borderRadius: '16px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }
      });
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full max-w-md glass p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden"
    >
      <div className="absolute right-4 top-4">
        <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-all active:scale-95">
          <X size={20} />
        </button>
      </div>

      <h2 className="text-3xl font-black gradient-text mb-2">New Transaction</h2>
      <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">Track your wealth flow</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Toggle Income/Expense */}
        <div className="relative flex p-1.5 rounded-2xl bg-muted/50 border border-white/5">
          <motion.div
            layoutId="tab-bg"
            className={`absolute inset-y-1.5 w-[calc(50%-6px)] rounded-xl shadow-lg transition-colors ${currentType === 'INCOME' ? 'bg-emerald-500 left-1.5' : 'bg-rose-500 left-auto right-1.5'}`}
          />
          <button
            type="button"
            onClick={() => setValue('type', 'INCOME')}
            className={`relative z-10 flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${currentType === 'INCOME' ? 'text-white' : 'text-muted-foreground'}`}
          >
            <Plus size={16} /> Income
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'EXPENSE')}
            className={`relative z-10 flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${currentType === 'EXPENSE' ? 'text-white' : 'text-muted-foreground'}`}
          >
            <Minus size={16} /> Expense
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
            <label className="text-xs font-black uppercase text-muted-foreground ml-2 tracking-widest">Amount</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <span className="font-bold text-lg">₹</span>
                </div>
                <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full h-16 pl-10 pr-6 rounded-2xl bg-muted/30 border border-white/5 text-xl font-bold transition-all focus:bg-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
            </div>
            {errors.amount && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-bold ml-2">⚠️ {errors.amount.message}</motion.p>}
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-2 gap-4">
              <CustomSelect 
                label="Category"
                options={CATEGORIES.map(c => ({ label: c, value: c }))}
                value={currentCategory}
                onChange={(val) => setValue('category', val)}
              />
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground ml-2 tracking-widest">Date</label>
                <input
                    {...register('date')}
                    type="date"
                    className="w-full h-14 px-4 rounded-2xl bg-muted/30 border border-white/5 font-bold transition-all focus:border-primary outline-none"
                />
             </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
            <label className="text-xs font-black uppercase text-muted-foreground ml-2 tracking-widest">Notes (Optional)</label>
            <textarea
                {...register('note')}
                rows={2}
                placeholder="What was this for?"
                className="w-full p-4 rounded-2xl bg-muted/30 border border-white/5 font-bold transition-all focus:border-primary outline-none resize-none"
            />
        </div>

        {/* Submit */}
        <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-16 gradient-primary rounded-2xl text-white font-black text-lg shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 overflow-hidden"
        >
             <div className="flex items-center justify-center gap-3">
                 {loading ? (
                    <Loader2 className="animate-spin" />
                 ) : (
                    <>
                        <span>Confirm Transaction</span>
                        <CheckCircle2 size={22} className="group-hover:rotate-12 transition-transform" />
                    </>
                 )}
             </div>
        </button>
      </form>
    </motion.div>
  );
}
