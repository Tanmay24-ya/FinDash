// components/charts/AreaTrend.tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 3000, expense: 1398 },
    { name: 'Mar', income: 2000, expense: 9800 },
    { name: 'Apr', income: 2780, expense: 3908 },
];

export default function AreaTrend() {
    return (
        <div className="h-[300px] w-full">
            <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Cashflow Trend</h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="income" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={2} />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={0.1} fill="#ef4444" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}