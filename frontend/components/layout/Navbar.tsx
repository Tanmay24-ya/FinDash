// components/layout/Navbar.tsx
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import ThemeToggle from "../ui/ThemeToggle";
import Link from "next/link";
import { LogOut, LayoutDashboard, ReceiptText, ShieldCheck } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    return (
        <nav className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <span className="font-bold text-xl tracking-tight text-primary">FINANCE.IO</span>
                <div className="flex gap-4 text-sm font-medium">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors"><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link href="/transactions" className="flex items-center gap-2 hover:text-primary transition-colors"><ReceiptText size={18} /> Transactions</Link>
                    {user?.role === 'Admin' && (
                        <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <ShieldCheck size={18} /> Admin
                        </Link>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="text-right mr-2">
                    <p className="text-sm font-bold leading-none">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <button onClick={logout} className="p-2 hover:bg-muted rounded-full text-red-500"><LogOut size={20} /></button>
            </div>
        </nav>
    );
}
