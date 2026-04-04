"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mocking API call - Replace with your actual backend call
        setTimeout(() => {
            setAuth({ id: '1', name: 'Admin User', email: 'admin@finance.io', role: 'Admin', status: 'active' }, 'fake-token');
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-primary">Welcome Back</h2>
                    <p className="text-muted-foreground mt-2">Enter your credentials to access your dashboard</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <input type="email" required className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="name@company.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <input type="password" required className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}