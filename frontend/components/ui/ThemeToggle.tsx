"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useThemeStore();

    // Sync the class with the state
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-all active:scale-95"
        >
            {isDark ? (
                <Sun size={20} className="text-yellow-400 fill-yellow-400" />
            ) : (
                <Moon size={20} className="text-slate-700 fill-slate-700" />
            )}
        </button>
    );
}