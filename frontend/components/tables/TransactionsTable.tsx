"use client";
export default function TransactionsTable({ transactions }: { transactions: any[] }) {
    return (
        <table className="w-full text-left">
            <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-4 font-semibold text-sm">Date</th>
                    <th className="p-4 font-semibold text-sm">Category</th>
                    <th className="p-4 font-semibold text-sm">Type</th>
                    <th className="p-4 font-semibold text-sm text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4 text-sm">{t.date}</td>
                        <td className="p-4 text-sm font-medium">{t.category}</td>
                        <td className="p-4 text-sm">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {t.type}
                            </span>
                        </td>
                        <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}