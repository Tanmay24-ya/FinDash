'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ShieldCheck, Loader2, ArrowRight, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { CustomSelect } from '@/components/ui/CustomSelect';

const ROLE_OPTIONS = [
  { label: 'VIEWER (Read Only)', value: 'VIEWER' },
  { label: 'ANALYST (Manage Records)', value: 'ANALYST' },
  { label: 'ADMIN (System Control)', value: 'ADMIN' },
];

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'VIEWER' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/auth/register', formData);
      toast.success("Security account created successfully. Establish your login session next.", { position: "top-right", theme: "dark" });
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || "Registration denied by server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background selection:bg-primary/20 overflow-hidden">
      {/* Decorative Branding Side */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-linear-to-br from-indigo-600 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/10 blur-[100px] animate-pulse" />
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="z-10 text-center"
        >
           <div className="mx-auto h-24 w-24 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
              <IndianRupee size={48} className="text-white" />
           </div>
           <h1 className="text-6xl font-black text-white tracking-tighter mb-4">FinDash</h1>
           <p className="text-xl text-white/80 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest text-[10px]">Scalable Financial Ledger Infrastructure</p>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-y-auto">
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md space-y-10 py-12"
        >
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter gradient-text">Create Account</h2>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Register new system identity</p>
          </div>

          <form className="space-y-8" onSubmit={handleRegister}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Full Identity Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-16 pl-12 pr-6 rounded-2xl bg-muted/40 border border-white/5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold" 
                    placeholder="Wade Wilson" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Security Mailbox</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-16 pl-12 pr-6 rounded-2xl bg-muted/40 border border-white/5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold" 
                    placeholder="agent@findash.io" 
                  />
                </div>
              </div>

              <CustomSelect 
                label="System Role Clearance"
                icon={ShieldCheck}
                options={ROLE_OPTIONS}
                value={formData.role}
                onChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Vault Passkey</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full h-16 pl-12 pr-6 rounded-2xl bg-muted/40 border border-white/5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold tracking-widest" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className="group relative w-full h-16 gradient-primary rounded-2xl text-white font-black text-lg shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 overflow-hidden"
            >
               <div className="flex items-center justify-center gap-3">
                 {loading ? <Loader2 className="animate-spin" /> : (
                   <>
                     <span>Establish Identity</span>
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </div>
            </button>
          </form>

          <p className="text-center text-sm font-bold text-muted-foreground">
            Known Identity? {" "}
            <Link href="/login" className="text-primary hover:underline uppercase tracking-widest text-[11px] font-black">Authorize Session</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
