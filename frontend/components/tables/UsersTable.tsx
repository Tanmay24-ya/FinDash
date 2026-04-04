"use client";
import StatusBadge from "../ui/StatusBadge";
import { UserCog, Trash2, Shield } from "lucide-react";

export default function UsersTable({ users }: { users: any[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b">
                    <tr>
                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground">User Details</th>
                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Access Level</th>
                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground">Status</th>
                        <th className="p-4 text-xs font-bold uppercase text-muted-foreground text-right">Management</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="p-4">
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className="text-primary" />
                                    <select
                                        defaultValue={user.role}
                                        className="bg-transparent text-sm font-medium focus:outline-none border rounded px-2 py-1"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Analyst">Analyst</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                </div>
                            </td>
                            <td className="p-4">
                                <StatusBadge status={user.status} />
                            </td>
                            <td className="p-4 text-right">
                                <button className="text-muted-foreground hover:text-red-500 transition-colors p-2">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
