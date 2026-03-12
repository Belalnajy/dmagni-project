'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { Sun, Moon, Languages, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Basic client-side check for auth cookies
    const cookies = document.cookie;
    setIsLoggedIn(cookies.includes('userId='));
    setIsAdmin(cookies.includes('adminAuth=true'));
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-foreground/3 backdrop-blur-3xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full group-hover:bg-purple-500/50 transition-all duration-500 scale-125"></div>
            <img
              src="/logo-remove.png"
              alt="Dmagni"
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-110 relative z-10"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter leading-none group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              Dmagni
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-foreground/2 p-1.5 rounded-full border border-foreground/4">
          <Link
            href="#features"
            className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/4 px-4 py-2 rounded-full transition-all duration-300">
            {t('nav.features')}
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/4 px-4 py-2 rounded-full transition-all duration-300">
            {t('nav.howItWorks')}
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/4 px-4 py-2 rounded-full transition-all duration-300">
            {t('nav.pricing')}
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/4 px-4 py-2 rounded-full transition-all duration-300">
            {t('nav.contact')}
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground border border-transparent hover:border-foreground/10"
            title={locale === 'en' ? 'العربية' : 'English'}>
            <Languages className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground border border-transparent hover:border-foreground/10"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            ) : (
              <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            )}
          </button>

          <div className="w-px h-6 bg-foreground/10 mx-1 sm:mx-2 hidden sm:block"></div>

          {isAdmin ? (
            <Link
              href="/admin"
              className="text-sm font-semibold text-foreground/70 hover:text-purple-500 transition-colors duration-300 px-3 py-2 flex items-center gap-1.5 bg-foreground/5 rounded-xl hover:bg-purple-500/10 border border-foreground/5 hover:border-purple-500/20">
              <span className="hidden sm:inline">{t('nav.admin')}</span>
            </Link>
          ) : isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-foreground/70 hover:text-blue-500 transition-colors duration-300 px-3 py-2 flex items-center gap-1.5 bg-foreground/5 rounded-xl hover:bg-blue-500/10 border border-foreground/5 hover:border-blue-500/20">
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('nav.dashboard')}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors duration-300 px-3 py-2">
              <span className="hidden sm:inline">{t('nav.signin')}</span>
            </Link>
          )}

          <Link
            href="#try-on"
            className="text-[13px] sm:text-sm font-bold text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5">
            {t('nav.tryNow')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
