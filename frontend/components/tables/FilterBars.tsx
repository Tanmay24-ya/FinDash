// components/tables/FilterBar.tsx
export default function FilterBar() {
    return (
        <div className="flex flex-wrap gap-3 items-center bg-card p-4 rounded-2xl border mb-6">
            <select className="bg-muted px-4 py-2 rounded-xl text-sm font-medium outline-none border-none">
                <option>All Months</option>
                <option>January</option>
                <option>February</option>
            </select>

            <select className="bg-muted px-4 py-2 rounded-xl text-sm font-medium outline-none border-none">
                <option>2024</option>
                <option>2023</option>
            </select>

            <select className="bg-muted px-4 py-2 rounded-xl text-sm font-medium outline-none border-none">
                <option>All Categories</option>
                <option>Housing</option>
                <option>Lifestyle</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sort by:</span>
                <select className="bg-transparent font-bold text-sm outline-none border-none">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Highest Amount</option>
                </select>
            </div>
        </div>
    );
}
