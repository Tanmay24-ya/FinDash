import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinDash | Financial Intelligence",
  description: "Advanced financial dashboard for assets and wealth management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
             {children}
          </ClientLayout>
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false}
            newestOnTop={true} 
            closeOnClick
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            theme="dark"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
