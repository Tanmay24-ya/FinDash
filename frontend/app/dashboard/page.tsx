// app/dashboard/page.tsx
"use client";
import Protected from "@/components/layout/Protected";
import Navbar from "@/components/layout/Navbar";
import AreaTrend from "@/components/charts/AreaTrend";
import PieCategory from "@/components/charts/PieCategory";
import TransactionForm from "@/components/forms/TransactionForm";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function Dashboard() {
    return (
        <Protected>
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Executive Dashboard</h1>
                        <p className="text-muted-foreground">Real-time financial intelligence.</p>
                    </div>
                    <TransactionForm />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Income" val="$45,231" delta="+12%" up />
                    <StatCard title="Expenses" val="$12,840" delta="+2%" />
                    <StatCard title="Net Profit" val="$32,391" delta="+18%" up />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-card rounded-xl border"><AreaTrend /></div>
                    <div className="p-6 bg-card rounded-xl border"><PieCategory /></div>
                </div>
            </div>
        </Protected>
    );
}

function StatCard({ title, val, delta, up }: any) {
    return (
        <div className="bg-card p-6 rounded-xl border shadow-sm flex justify-between items-end">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <h3 className="text-3xl font-bold">{val}</h3>
            </div>
            <div className={`flex items-center text-sm font-bold ${up ? 'text-green-500' : 'text-red-500'}`}>
                {up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />} {delta}
            </div>
        </div>
    );
}