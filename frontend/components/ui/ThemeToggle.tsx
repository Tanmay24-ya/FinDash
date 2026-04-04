'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-10 w-10 bg-muted/40 rounded-xl" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-10 w-20 items-center rounded-2xl bg-card border border-white/10 dark:border-white/5 p-1 shadow-lg cursor-pointer transition-colors"
      aria-label="Toggle Theme"
    >
      <div className="flex-1 flex items-center justify-center text-amber-500">
         <Sun size={14} className={!isDark ? 'opacity-100 scale-100' : 'opacity-40 scale-75'} />
      </div>
      <div className="flex-1 flex items-center justify-center text-primary">
         <Moon size={14} className={isDark ? 'opacity-100 scale-100' : 'opacity-40 scale-75'} />
      </div>

      <motion.div
        layout
        className="absolute left-1 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xl"
        initial={false}
        animate={{
          x: isDark ? 40 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </motion.div>
    </button>
  );
}
