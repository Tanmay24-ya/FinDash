"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { month: 'Jan', total: 2400 },
    { month: 'Feb', total: 1398 },
    { month: 'Mar', total: 9800 },
    { month: 'Apr', total: 3908 },
    { month: 'May', total: 4800 },
];

export default function BarMonthly() {
    return (
        <div className="h-[300px] w-full">
            <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Monthly Comparison</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.total > 5000 ? '#3b82f6' : '#93c5fd'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}