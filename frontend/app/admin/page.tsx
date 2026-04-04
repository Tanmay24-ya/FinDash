// app/admin/page.tsx
"use client";
import Protected from "@/components/layout/Protected";
import Navbar from "@/components/layout/Navbar";
import UsersTable from "@/components/tables/UsersTable";

export default function AdminPage() {
    return (
        <Protected allowedRoles={['Admin']}>
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Control system access and assign roles.</p>
                </div>
                <UsersTable users={[
                    { id: '1', name: 'John Doe', email: 'j@example.com', role: 'Admin', status: 'active' },
                    { id: '2', name: 'Jane Smith', email: 's@example.com', role: 'Analyst', status: 'active' },
                    { id: '3', name: 'Bob Wilson', email: 'b@example.com', role: 'Viewer', status: 'inactive' },
                ]} />
            </div>
        </Protected>
    );
}