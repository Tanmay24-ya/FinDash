// components/layout/Protected.tsx
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function Protected({ children, allowedRoles }: Props) {
    const { user, token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h2 className="text-xl font-semibold">Access Denied: Insufficient Permissions</h2>
            </div>
        );
    }

    return <>{children}</>;
}