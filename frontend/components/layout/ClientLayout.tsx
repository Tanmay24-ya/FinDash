'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname } from 'next/navigation';
import Protected from '@/components/layout/Protected';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  // Define public routes that don't need a sidebar or protection
  const isPublicRoute = ['/', '/login', '/register'].includes(pathname);

  if (isPublicRoute) {
     return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <Protected>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-72 flex flex-col p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
           {children}
        </main>
      </div>
    </Protected>
  );
}
