'use client';
import { UsersTable } from '@/components/admin/UsersTable';
import { 
  ShieldCheck, 
  UserPlus, 
  HelpCircle,
  Database,
  Search,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import Protected from '@/components/layout/Protected';

export default function AdminPanel() {
  return (
    <Protected allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/5">
         <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
         >
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
               <ShieldCheck className="text-primary" size={40} />
               Admin Central
            </h1>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mt-2 pl-12 flex items-center gap-2">
               <Activity size={14} className="text-primary" /> Authority Management
            </p>
         </motion.div>

         <div className="flex items-center gap-4">
            <div className="flex h-14 items-center gap-3 glass-card px-6 py-2">
               <Database className="text-primary" size={20} />
               <div className="text-xs font-black uppercase tracking-widest">
                  <span className="text-primary block">Engine Status</span>
                  Operational
               </div>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Main Users Table */}
         <div className="lg:col-span-3">
            <UsersTable />
         </div>

         {/* Admin Sidebar Info */}
         <div className="space-y-6 lg:mt-6">
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="glass-card p-6 border-l-4 border-primary"
            >
               <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <UserPlus size={18} className="text-primary" /> Authority Control
               </h3>
               <p className="text-sm text-muted-foreground font-bold mb-6 italic">Modifying a user's role will instantly update their system-wide access levels.</p>
               
               <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black uppercase text-primary mb-1">PRO-TIP</p>
                     <p className="text-xs font-bold leading-relaxed">Admins can escalate Analysts but cannot delete other Admins without full database access.</p>
                  </div>
               </div>
            </motion.div>

            <div className="p-6 rounded-3xl bg-linear-to-br from-primary/10 to-transparent border border-primary/20 shadow-xl">
               <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Need help?</h3>
               <p className="text-sm font-bold mb-4">Contact technical support for critical level escalations.</p>
               <button className="flex items-center justify-center gap-2 h-12 w-full bg-primary rounded-xl font-black text-white text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-primary/20">
                  <HelpCircle size={16} /> Open Ticket
               </button>
            </div>
         </div>
      </div>
    </Protected>
  );
}
