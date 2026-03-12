'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserCircle,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ChevronLeft,
  Settings,
  Languages,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';

const navItems = [
  { href: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; max-age=0';
    document.cookie = 'adminAuth=; path=/; max-age=0';
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden flex-col md:flex-row">
      <aside className="w-full md:w-72 flex flex-col border-r border-foreground/[0.06] bg-card">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-125"></div>
              <img
                src="/logo.png"
                alt="Dmagni"
                className="w-12 h-12 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              />
            </div>
            <div>
              <h2 className="text-2xl font-black bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Dmagni
              </h2>
              <p className="text-[10px] text-purple-500/50 font-bold uppercase tracking-widest mt-0.5">
                {t('admin.user')}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
            title={t('admin.backToSite')}>
            <ChevronLeft className="w-4 h-4 text-foreground/30" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/4 font-medium transition-all duration-200 ${isActive ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/15' : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/3'}`}>
                <item.icon className="w-[18px] h-[18px]" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-foreground/[0.04]">
          <div className="flex items-center gap-1 mb-3">
            <button
              onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-foreground/40 hover:text-foreground"
              title={locale === 'en' ? 'العربية' : 'English'}>
              <Languages className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-foreground/40 hover:text-foreground">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 w-full text-left rounded-lg hover:bg-red-500/5 transition-colors text-red-400/60 hover:text-red-400 text-[13px]">
            <LogOut className="w-4 h-4" />
            {t('admin.signout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
