"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse font-bold text-primary text-xl tracking-tighter">
        FINANCE.IO
      </div>
    </div>
  );
}