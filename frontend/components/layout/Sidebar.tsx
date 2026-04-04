'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  IndianRupee, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const cn = (...args: any[]) => twMerge(clsx(args));

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'Transactions', icon: IndianRupee, href: '/transactions', roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'Admin Panel', icon: Users, href: '/admin', roles: ['ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const currentRole = user?.role || 'VIEWER';

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-white/10 glass bg-card/40 md:flex">
      <div className="flex h-24 items-center justify-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg group-hover:scale-110 transition-transform">
             <IndianRupee className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight gradient-text">FinDash</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-6">
        {NAV_ITEMS.filter(item => item.roles.includes(currentRole)).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group relative flex items-center justify-between gap-3 rounded-2xl px-4 py-4 transition-all duration-300",
                  isActive 
                    ? "bg-primary/20 text-primary shadow-inner" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={22} className={cn(isActive && "text-primary animate-pulse")} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="h-6 w-1 rounded-full bg-primary" />
                )}
                {!isActive && <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 p-2">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Light/Dark</span>
            <ThemeToggle />
        </div>

        <div className="rounded-3xl bg-muted/40 p-4 border border-white/5 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                 {user?.name?.[0].toUpperCase()}
              </div>
              <div>
                 <p className="text-sm font-black truncate max-w-[120px]">{user?.name}</p>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{user?.role}</p>
              </div>
           </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl p-4 text-sm font-black text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
