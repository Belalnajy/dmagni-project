'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  Activity,
  BarChart3,
  CreditCard,
  Settings,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';

const navItems = [
  { href: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard },
  { href: '/admin/users', labelKey: 'admin.users', icon: Users },
  { href: '/admin/messages', labelKey: 'Messages', icon: MessageSquare },
  { href: '/admin/analytics', labelKey: 'admin.analytics', icon: BarChart3 },
  { href: '/admin/billing', labelKey: 'admin.billing', icon: CreditCard },
  { href: '/admin/settings', labelKey: 'admin.settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'userId=; path=/; max-age=0';
    document.cookie = 'adminAuth=; path=/; max-age=0';
    window.location.href = '/login';
  };

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Dmagni
            </h2>
            <p className="text-[11px] text-foreground/30 font-medium">
              {t('admin.title')}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-foreground/5 transition-colors hidden lg:block"
          title={t('admin.backToSite')}>
          <ChevronLeft className="w-4 h-4 text-foreground/30" />
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-foreground/5 transition-colors lg:hidden">
          <X className="w-4 h-4 text-foreground/30" />
        </button>
      </div>

      <div className="mx-4 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">
            {t('admin.systemOnline')}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <Activity className="w-3 h-3 text-emerald-500/60 dark:text-emerald-400/60" />
          <span className="text-[11px] text-emerald-500/50 dark:text-emerald-400/50">
            {t('admin.allServices')}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-foreground/20 font-bold px-3 mb-3">
          {t('admin.navigation')}
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${isActive ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/15' : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.03]'}`}>
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
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-foreground/[0.06] bg-card">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-foreground/[0.06] transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      <main className="flex-1 overflow-y-auto bg-background">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-foreground/[0.06] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors">
            <Menu className="w-5 h-5 text-foreground/60" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-xs">D</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Dmagni</span>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
