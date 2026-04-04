'use client';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  UserX,
  Mail,
  Settings2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ROLE_ICONS = {
  SUPER_ADMIN: { icon: ShieldCheck, color: 'text-indigo-500' },
  ADMIN: { icon: ShieldCheck, color: 'text-primary' },
  ANALYST: { icon: ShieldAlert, color: 'text-amber-500' },
  VIEWER: { icon: ShieldQuestion, color: 'text-muted-foreground' }
};

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string|null>(null);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, targetRole: string, currentRole: string) => {
    if (userId === currentUser?.id) {
       return toast.error("System Override: You cannot modify your own primary clearance tier.");
    }
    
    try {
      setActionId(userId);
      const isPromotion = 
          (currentRole === 'VIEWER' && (targetRole === 'ANALYST' || targetRole === 'ADMIN')) ||
          (currentRole === 'ANALYST' && targetRole === 'ADMIN');

      const endpoint = isPromotion ? `/users/${userId}/promote` : `/users/${userId}/demote`;
      
      await api.put(endpoint, { role: targetRole });
      toast.success(`Identity clearance established: ${targetRole}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Governance update failed');
    } finally {
      setActionId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
       return toast.error("Self-decommissioning is locked for safety.");
    }
    if (!confirm('Decommission this identity? This will revoke all financial access.')) return;
    try {
      setActionId(userId);
      await api.delete(`/users/${userId}`);
      toast.success('Identity decommissioned successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="glass-card shadow-2xl overflow-hidden border border-white/5">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black gradient-text">Authority Oversight</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Manage network access control protocol</p>
         </div>
         <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg ring-1 ring-primary/30">
            <Settings2 size={24} />
         </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-muted/10">
                 <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Identify</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Authority Level</th>
                 <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>
                 <th className="px-8 py-4 text-right text-[10px] font-black uppercase text-muted-foreground tracking-widest">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                 {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="px-8 py-4"><td colSpan={4}><div className="h-10 w-full shimmer-loading rounded-xl mx-8 my-4" /></td></tr>
                 )) : users.map((u, idx) => {
                    const RoleMeta = ROLE_ICONS[u.role as keyof typeof ROLE_ICONS] || ROLE_ICONS.VIEWER;
                    const isBusy = actionId === u.id;
                    const isSelf = u.id === currentUser?.id;
                    
                    // PEER PROTECTION RULE: One Admin cannot manage Another Admin
                    const isPeerAdmin = currentUser?.role === 'ADMIN' && u.role === 'ADMIN';
                    const canNotManage = isSelf || isPeerAdmin;

                    return (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-2xl shadow-xl flex items-center justify-center text-white text-xl font-black ${
                                    u.role === 'SUPER_ADMIN' ? 'bg-indigo-500 shadow-indigo-500/20' : 
                                    u.role === 'ADMIN' ? 'bg-amber-500 shadow-amber-500/20' : 
                                    'gradient-primary shadow-primary/20'
                                }`}>
                                   {u.name[0].toUpperCase()}
                                </div>
                                <div className="max-w-[200px]">
                                   <p className="font-black text-sm truncate flex items-center gap-2">
                                       {u.name}
                                       {isSelf && <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">YOU</span>}
                                   </p>
                                   <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 truncate uppercase font-bold tracking-widest"><Mail size={12} /> {u.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <RoleMeta.icon className={RoleMeta.color} size={18} />
                                <select 
                                  value={u.role}
                                  disabled={isBusy || canNotManage}
                                  onChange={(e) => handleRoleChange(u.id, e.target.value, u.role)}
                                  className="bg-muted/40 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all outline-none focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                   {/* Always allow viewing core roles */}
                                   <option value="VIEWER">VIEWER</option>
                                   <option value="ANALYST">ANALYST</option>
                                   
                                   {/* Hierarchical Visibility: 
                                       1. Show ADMIN if user IS admin (to display correctly)
                                       2. Show ADMIN if current user is SUPER_ADMIN (to allow promotion)
                                   */}
                                   {(u.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
                                       <option value="ADMIN">ADMIN</option>
                                   )}

                                   {/* Only SuperAdmin sees/applies SuperAdmin status */}
                                   {(u.role === 'SUPER_ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
                                       <option value="SUPER_ADMIN">SUPER ADMIN</option>
                                   )}
                                </select>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={16} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${u.isEmailVerified ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {u.isEmailVerified ? 'Active System User' : 'Pending Verification'}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button
                               onClick={() => deleteUser(u.id)}
                               disabled={isBusy || canNotManage}
                               className="h-10 w-10 flex items-center justify-center rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all disabled:opacity-0 active:scale-90"
                             >
                                {isBusy ? <Loader2 className="animate-spin" size={18} /> : <UserX size={18} />}
                             </button>
                          </td>
                        </motion.tr>
                    );
                 })}
              </AnimatePresence>
           </tbody>
        </table>
      </div>
    </div>
  );
}
