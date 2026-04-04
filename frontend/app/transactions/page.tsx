"use client";
import Protected from "@/components/layout/Protected";
import Navbar from "@/components/layout/Navbar";
import TransactionsTable from "@/components/tables/TransactionsTable";
import { exportToCSV } from "@/lib/csv";
import { Download, Filter } from "lucide-react";

export default function TransactionsPage() {
    const mockData = [
        { id: 1, date: '2024-03-01', category: 'Salary', amount: 5000, type: 'income', notes: 'Monthly pay' },
        { id: 2, date: '2024-03-02', category: 'Rent', amount: 1200, type: 'expense', notes: 'Downtown Apt' },
    ];

    return (
        <Protected>
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">Transactions</h1>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border hover:bg-background transition-all">
                            <Filter size={18} /> Filter
                        </button>
                        <button
                            onClick={() => exportToCSV(mockData, 'transactions')}
                            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border hover:bg-background transition-all"
                        >
                            <Download size={18} /> Export CSV
                        </button>
                    </div>
                </div>
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <TransactionsTable transactions={mockData} />
                </div>
            </div>
        </Protected>
    );
}