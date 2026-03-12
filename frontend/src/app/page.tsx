'use client';

import Navbar from '@/components/Navbar';
import TryOnComponent from '@/components/TryOnComponent';
import {
  Sparkles,
  Shield,
  Zap,
  Eye,
  CreditCard,
  Lock,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useState } from 'react';

export default function Home() {
  const { t } = useLanguage();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = (tier: string) => {
    setLoadingTier(tier);
    // Simulate a network request for checkout session creation
    setTimeout(() => {
      setLoadingTier(null);
      alert(
        `Simulation: Redirecting to Stripe/Paymob checkout for ${tier} plan...`,
      );
    }, 1500);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      titleKey: 'features.fast.title',
      descKey: 'features.fast.desc',
      color: 'text-yellow-500 dark:text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/10',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      titleKey: 'features.realistic.title',
      descKey: 'features.realistic.desc',
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/10',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      titleKey: 'features.privacy.title',
      descKey: 'features.privacy.desc',
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/10',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      titleKey: 'features.free.title',
      descKey: 'features.free.desc',
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/10',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      titleKey: 'features.secure.title',
      descKey: 'features.secure.desc',
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/10',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      titleKey: 'features.categories.title',
      descKey: 'features.categories.desc',
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/[0.04] blur-[100px] animate-float" />
        <div
          className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.03] blur-[100px] animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/[0.03] blur-[100px] animate-float"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <Navbar />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/15 bg-purple-500/5 text-purple-500 dark:text-purple-400 text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            {t('hero.badge')}
          </div>
          <h1
            className="animate-fade-in-up text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6"
            style={{ animationDelay: '0.1s' }}>
            {t('hero.title1')}
            <br />
            <span className="gradient-text">{t('hero.title2')}</span>
          </h1>
          <p
            className="animate-fade-in-up text-lg md:text-xl text-foreground/40 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: '0.3s' }}>
            <a
              href="#try-on"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-lg font-semibold text-white gradient-brand shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              {t('hero.cta')}
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-medium text-foreground/50 glass hover:text-foreground hover:bg-foreground/[0.04] transition-all duration-300">
              {t('hero.learnMore')}
            </a>
          </div>
          <div
            className="animate-fade-in-up mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">12K+</p>
              <p className="text-sm text-foreground/30 mt-1">
                {t('hero.stat.tryons')}
              </p>
            </div>
            <div className="text-center border-x border-foreground/[0.06]">
              <p className="text-3xl font-bold text-foreground">98%</p>
              <p className="text-sm text-foreground/30 mt-1">
                {t('hero.stat.accuracy')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">~15s</p>
              <p className="text-sm text-foreground/30 mt-1">
                {t('hero.stat.processing')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <TryOnComponent />

      {/* Features */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('features.title')}{' '}
              <span className="gradient-text">
                {t('features.titleHighlight')}
              </span>
              ?
            </h2>
            <p className="text-lg text-foreground/35 max-w-xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group p-7 rounded-2xl border ${f.border} ${f.bg} hover:scale-[1.02] hover:shadow-lg transition-all duration-300`}>
                <div
                  className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(f.titleKey)}
                </h3>
                <p className="text-sm text-foreground/35 leading-relaxed">
                  {t(f.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('pricing.title')}{' '}
              <span className="gradient-text">
                {t('pricing.titleHighlight')}
              </span>
            </h2>
            <p className="text-lg text-foreground/35">
              {t('pricing.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl glass hover:bg-foreground/[0.02] transition-all duration-300">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('pricing.free')}
              </h3>
              <p className="text-4xl font-bold text-foreground mb-1">
                {t('pricing.free.price')}{' '}
                <span className="text-base text-foreground/35 font-normal">
                  {t('pricing.free.period')}
                </span>
              </p>
              <p className="text-sm text-foreground/35 mb-8">
                {t('pricing.free.desc')}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'pricing.free.f1',
                  'pricing.free.f2',
                  'pricing.free.f3',
                  'pricing.free.f4',
                ].map((k, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-foreground/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                    {t(k)}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('free')}
                disabled={loadingTier === 'free'}
                className="w-full py-3 rounded-xl border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 flex items-center justify-center gap-2 transition-all text-sm font-medium disabled:opacity-50">
                {loadingTier === 'free' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('pricing.free.btn')
                )}
              </button>
            </div>
            <div className="relative p-8 rounded-2xl glass-strong border-purple-500/20 hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-brand text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-500/30">
                {t('pricing.premium.badge')}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('pricing.premium')}
              </h3>
              <p className="text-4xl font-bold text-foreground mb-1">
                {t('pricing.premium.price')}{' '}
                <span className="text-base text-foreground/35 font-normal">
                  {t('pricing.premium.period')}
                </span>
              </p>
              <p className="text-sm text-foreground/35 mb-8">
                {t('pricing.premium.desc')}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'pricing.premium.f1',
                  'pricing.premium.f2',
                  'pricing.premium.f3',
                  'pricing.premium.f4',
                  'pricing.premium.f5',
                  'pricing.premium.f6',
                ].map((k, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-foreground/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {t(k)}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('premium')}
                disabled={loadingTier === 'premium'}
                className="w-full py-3 rounded-xl gradient-brand text-white flex items-center justify-center gap-2 font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 disabled:opacity-50">
                {loadingTier === 'premium' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  t('pricing.premium.btn')
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-foreground/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-sm text-foreground/35">
              {t('footer.rights')}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-foreground/25 hover:text-foreground/50 transition-colors">
              {t('footer.privacy')}
            </a>
            <a
              href="#"
              className="text-sm text-foreground/25 hover:text-foreground/50 transition-colors">
              {t('footer.terms')}
            </a>
            <a
              href="#"
              className="text-sm text-foreground/25 hover:text-foreground/50 transition-colors">
              {t('footer.support')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
