'use client';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'ANALYST' | 'VIEWER')[];
}

export default function Protected({ children, allowedRoles }: Props) {
  const { user, token, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for store to rehydrate if needed
    const timeout = setTimeout(() => {
       if (!token || !isAuthenticated) {
         router.replace("/login");
       } else {
         setChecking(false);
       }
    }, 100);
    return () => clearTimeout(timeout);
  }, [token, isAuthenticated, router]);

  if (checking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Establishing Security protocol...</p>
      </div>
    );
  }

  const hasAccess = !allowedRoles || (user && allowedRoles.includes(user.role));

  if (!hasAccess) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background p-6">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="glass-card max-w-md w-full p-12 text-center"
        >
           <div className="h-20 w-20 rounded-3xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/10">
              <ShieldAlert size={40} />
           </div>
           <h2 className="text-3xl font-black gradient-text mb-4">Access Denied</h2>
           <p className="text-muted-foreground font-bold mb-8">Your security clearance Level ({user?.role}) is insufficient for this sector.</p>
           
           <Link href="/dashboard" className="flex items-center justify-center gap-2 h-14 w-full bg-muted rounded-2xl font-black text-foreground hover:bg-muted/60 transition-all">
              <Home size={20} /> Return to Dashboard
           </Link>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
