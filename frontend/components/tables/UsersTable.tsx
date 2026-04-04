"use client";
import { UserCog, Trash2, ShieldCheck, MailCheck, MailX, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useState } from "react";
import { CustomSelect } from "../ui/CustomSelect";

interface UsersTableProps {
    users: any[];
    onRefresh: () => void;
}

export default function UsersTable({ users, onRefresh }: UsersTableProps) {
    const { user: currentUser } = useAuthStore();
    const [actionId, setActionId] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, targetRole: string, currentRole: string) => {
        try {
            setActionId(userId);
            const isPromotion = 
                (currentRole === 'VIEWER' && (targetRole === 'ANALYST' || targetRole === 'ADMIN')) ||
                (currentRole === 'ANALYST' && targetRole === 'ADMIN');

            const endpoint = isPromotion ? `/users/${userId}/promote` : `/users/${userId}/demote`;
            
            await api.put(endpoint, { role: targetRole });
            toast.success(`Identity clearance updated to ${targetRole}`);
            onRefresh();
        } catch (err: any) {
            toast.error(err.message || 'Governance update failed');
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Decommission this identity? This action is reversible by Super Admin only.")) return;
        try {
            setActionId(userId);
            await api.delete(`/users/${userId}`);
            toast.success("Identity decommissioned");
            onRefresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionId(null);
        }
    };

    // Governance Logic Helper
    const canManageUser = (targetUser: any) => {
        if (targetUser.id === currentUser?.id) return false; // Cannot manage self
        if (currentUser?.role === 'SUPER_ADMIN') return true; // SuperAdmin can manage everyone else
        if (currentUser?.role === 'ADMIN') {
            // Admin can only manage non-admins
            return targetUser.role !== 'ADMIN' && targetUser.role !== 'SUPER_ADMIN';
        }
        return false;
    };

    return (
        <div className="overflow-x-auto rounded-[2.5rem] glass border border-white/5 shadow-2xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-muted/30 border-b border-white/5">
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[40%]">User Identity</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Clearance Level</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                        {users.map((user) => {
                            const manageable = canManageUser(user);
                            const isLoading = actionId === user.id;

                            return (
                                <motion.tr 
                                    key={user.id} 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-muted/10 transition-colors group"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                                user.role === 'SUPER_ADMIN' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 
                                                user.role === 'ADMIN' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                                                'bg-primary/20 text-primary'
                                            }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-sm tracking-tight flex items-center gap-2">
                                                    {user.name}
                                                    {user.isEmailVerified ? (
                                                        <span title="Verified Identity">
                                                            <MailCheck size={14} className="text-emerald-500" />
                                                        </span>
                                                    ) : (
                                                        <span title="Unverified">
                                                            <MailX size={14} className="text-rose-500" />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="min-w-[140px]">
                                            {manageable ? (
                                                <select
                                                    disabled={isLoading}
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value, user.role)}
                                                    className="w-full bg-muted/40 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                >
                                                    <option value="VIEWER">Viewer</option>
                                                    <option value="ANALYST">Analyst</option>
                                                    <option value="ADMIN">Admin</option>
                                                    {currentUser?.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Admin</option>}
                                                </select>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    <ShieldCheck size={14} className="text-primary" />
                                                    {user.role}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            user.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                        }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                                            {user.isActive ? 'Active' : 'Deactivated'}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        {manageable ? (
                                            <button 
                                                disabled={isLoading}
                                                onClick={() => handleDelete(user.id)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                            >
                                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                            </button>
                                        ) : (
                                            <div className="h-10 w-10 flex items-center justify-center text-muted-foreground/30">
                                                <AlertCircle size={18} />
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
