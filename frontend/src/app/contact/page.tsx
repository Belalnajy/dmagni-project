'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  Send,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Home,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.04] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-16 px-6 max-w-2xl mx-auto flex justify-center items-center min-h-screen">
        <div className="w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('contact.title')}{' '}
              <span className="gradient-text">
                {t('contact.titleHighlight')}
              </span>
            </h1>
            <p className="text-lg text-foreground/50">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="glass p-8 rounded-3xl shadow-xl border border-white/5 relative">
            <Link
              href="/"
              className="absolute top-6 left-6 text-foreground/40 hover:text-foreground transition-colors"
              title={t('contact.back')}>
              <Home className="w-5 h-5" />
            </Link>

            <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8">
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>

            {success ? (
              <div className="text-center py-8 animate-fade-in-up">
                <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('contact.sent.title')}
                </h3>
                <p className="text-foreground/50 mb-8">
                  {t('contact.sent.desc')}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 rounded-xl border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors font-medium">
                  {t('contact.sent.btn')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !name || !email || !message}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-purple-500/20">
                  {loading ? t('contact.form.sending') : t('contact.form.send')}
                  {!loading && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
