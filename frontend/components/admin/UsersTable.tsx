'use client';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  UserCircle, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  Trash2, 
  UserX,
  Mail,
  Calendar,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ROLE_ICONS = {
  ADMIN: { icon: ShieldCheck, color: 'text-primary' },
  ANALYST: { icon: ShieldAlert, color: 'text-amber-500' },
  VIEWER: { icon: ShieldQuestion, color: 'text-muted-foreground' }
};

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, role: string) => {
    try {
      await api.put(`/users/${userId}`, { role });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
       return toast.error("You cannot delete yourself, admin!");
    }
    if (!confirm('Are you sure? This will remove all their financial access.')) return;
    try {
      await api.delete(`/users/${userId}`);
      toast.success('User soft-deleted successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="glass-card overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black gradient-text">User Authorities</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Manage network access control</p>
         </div>
         <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg ring-1 ring-primary/30">
            <Settings2 size={24} />
         </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-muted/10">
                 <th className="px-8 py-4 text-xs font-black uppercase text-muted-foreground tracking-widest">Identify</th>
                 <th className="px-8 py-4 text-xs font-black uppercase text-muted-foreground tracking-widest">Authority Level</th>
                 <th className="px-8 py-4 text-xs font-black uppercase text-muted-foreground tracking-widest">Status</th>
                 <th className="px-8 py-4 text-right text-xs font-black uppercase text-muted-foreground tracking-widest">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                 {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="px-8 py-4"><td colSpan={4}><div className="h-10 w-full shimmer-loading rounded-xl mx-8 my-4" /></td></tr>
                 )) : users.map((u, idx) => {
                    const RoleMeta = ROLE_ICONS[u.role as keyof typeof ROLE_ICONS];
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
                                <div className="h-12 w-12 rounded-2xl gradient-primary shadow-xl flex items-center justify-center text-white text-xl font-black">
                                   {u.name[0].toUpperCase()}
                                </div>
                                <div className="max-w-[200px]">
                                   <p className="font-black text-sm truncate">{u.name} {u.id === currentUser?.id && <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">YOU</span>}</p>
                                   <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate"><Mail size={12} /> {u.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <RoleMeta.icon className={RoleMeta.color} size={20} />
                                <select 
                                  value={u.role}
                                  disabled={u.id === currentUser?.id}
                                  onChange={(e) => updateRole(u.id, e.target.value)}
                                  className="bg-muted/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all outline-none focus:border-primary disabled:opacity-50"
                                >
                                   <option value="ADMIN">ADMIN</option>
                                   <option value="ANALYST">ANALYST</option>
                                   <option value="VIEWER">VIEWER</option>
                                </select>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={16} />
                                <span className="text-xs font-black uppercase text-emerald-500 tracking-widest">Active System user</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button
                               onClick={() => deleteUser(u.id)}
                               disabled={u.id === currentUser?.id}
                               className="h-10 w-10 flex items-center justify-center rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all disabled:opacity-0 active:scale-90"
                             >
                                <UserX size={20} />
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
