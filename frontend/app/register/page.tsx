"use client";
import Link from "next/link";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md bg-card p-8 rounded-2xl border shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary">Create Account</h2>
                    <p className="text-muted-foreground mt-2">Join Finance.io to track your wealth</p>
                </div>
                <form className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <input type="text" className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background" placeholder="Alex Doe" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <input type="email" className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background" placeholder="alex@example.com" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <input type="password" className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background" placeholder="••••••••" />
                        </div>
                    </div>
                    <button className="w-full bg-primary text-white py-3 rounded-lg font-bold mt-4 hover:opacity-90 flex items-center justify-center gap-2">
                        <ShieldCheck size={20} /> Register Now
                    </button>
                </form>
                <p className="text-center text-sm mt-6 text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}