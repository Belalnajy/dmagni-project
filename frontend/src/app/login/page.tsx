'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  Mail,
  User as UserIcon,
  Home,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { email, password, name };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success
      const { user } = data;

      // Basic cookie setup for demonstration routing
      document.cookie = `userId=${user.id}; path=/; max-age=604800`; // 7 days
      if (user.role === 'admin') {
        document.cookie = 'adminAuth=true; path=/; max-age=604800';
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-background via-background to-purple-900/10 dark:to-purple-900/20 relative">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <button
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          className="p-2 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground glass"
          title={locale === 'en' ? 'العربية' : 'English'}>
          <Languages className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground glass"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="w-full max-w-sm">
        <div className="glass p-8 rounded-3xl shadow-xl shadow-purple-500/10 border-white/10 dark:border-white/5 relative">
          <Link
            href="/"
            className="absolute top-6 left-6 text-foreground/40 hover:text-foreground transition-colors"
            title="Back to Home">
            <Home className="w-5 h-5" />
          </Link>
          <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            {isLogin ? t('login.welcome') : t('login.create')}
          </h1>
          <p className="text-sm text-center text-foreground/50 mb-8">
            {isLogin ? t('login.desc.login') : t('login.desc.create')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <div className="relative flex items-center">
                  <UserIcon className="absolute left-3 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    placeholder={t('login.fullname')}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            <div>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-5 h-5 text-foreground/40" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-5 h-5 text-foreground/40" />
                <input
                  type="password"
                  placeholder={t('login.password')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-foreground/5 dark:bg-foreground/10 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
              {loading
                ? t('login.wait')
                : isLogin
                  ? t('login.signin')
                  : t('login.signup')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-foreground/60 hover:text-foreground transition-colors font-medium">
              {isLogin ? t('login.toggle.signup') : t('login.toggle.login')}
            </button>
            <p className="text-[11px] text-foreground/30 mt-4">
              {t('login.demo')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
