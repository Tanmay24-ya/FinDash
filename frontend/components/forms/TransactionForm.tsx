// components/forms/TransactionForm.tsx
"use client";
import { useState } from "react";
import { Plus, X, DollarSign, Calendar, Tag } from "lucide-react";

export default function TransactionForm() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20"
            >
                <Plus size={20} /> Add Transaction
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                    <div className="bg-card w-full max-w-lg border rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsOpen(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">New Record</h2>

                        <form className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="py-3 rounded-2xl border-2 border-primary bg-primary/5 text-primary font-bold">Income</button>
                                <button type="button" className="py-3 rounded-2xl border-2 border-transparent bg-muted text-muted-foreground font-bold hover:bg-muted/80">Expense</button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Amount</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                    <input type="number" className="w-full bg-muted/50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                        <select className="w-full bg-muted/50 border-none rounded-2xl py-3.5 pl-12 pr-4 appearance-none outline-none">
                                            <option>Salary</option>
                                            <option>Investment</option>
                                            <option>Food</option>
                                            <option>Rent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
                                        <input type="date" className="w-full bg-muted/50 border-none rounded-2xl py-3.5 pl-12 pr-4 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg mt-4 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity">
                                Create Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}