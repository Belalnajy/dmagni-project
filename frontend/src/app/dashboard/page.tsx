'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Zap,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  subscription: {
    tier: string;
    creditsLeft: number;
  };
  generations: {
    id: string;
    imageUrl: string;
    createdAt: string;
    garmentCategory: string;
    status: string;
  }[];
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookies = document.cookie.split('; ');
        const userIdCookie = cookies.find((row) => row.startsWith('userId='));

        if (!userIdCookie) {
          throw new Error('Not authenticated properly');
        }

        const id = userIdCookie.split('=')[1];

        const res = await fetch(`http://localhost:5000/user/profile/${id}`);
        if (!res.ok) throw new Error('Failed to fetch profile data');

        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-foreground/50">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p>{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center p-8 bg-card border border-red-500/20 rounded-2xl max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {t('dashboard.error')}
          </h2>
          <p className="text-foreground/50">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')},{' '}
          {profile.name || profile.email.split('@')[0]}!
        </h1>
        <p className="text-foreground/50 mt-1">{t('dashboard.overview')}</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-foreground/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 relative z-10">
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-sm font-medium text-foreground/50 relative z-10">
            {t('dashboard.plan')}
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h3 className="text-3xl font-bold text-foreground capitalize">
              {profile.subscription?.tier || 'Free'}
            </h3>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-foreground/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 relative z-10">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-foreground/50 relative z-10">
            {t('dashboard.credits')}
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h3 className="text-3xl font-bold text-foreground">
              {profile.subscription?.creditsLeft ?? 0}
            </h3>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-foreground/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 relative z-10">
            <ImageIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-foreground/50 relative z-10">
            {t('dashboard.totalGen')}
          </p>
          <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <h3 className="text-3xl font-bold text-foreground">
              {profile.generations.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {t('dashboard.gallery')}
        </h2>
        {profile.generations.length === 0 ? (
          <div className="text-center p-12 bg-card rounded-3xl border border-dashed border-foreground/10">
            <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              {t('dashboard.empty.title')}
            </h3>
            <p className="text-foreground/50">{t('dashboard.empty.desc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.generations.map((gen) => (
              <div
                key={gen.id}
                className="group relative rounded-2xl overflow-hidden bg-card border border-foreground/5">
                <div className="aspect-[3/4] relative">
                  <img
                    src={gen.imageUrl}
                    alt="Generated outfit"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-xs font-semibold px-2 py-1 bg-white/20 backdrop-blur-md rounded-md capitalize">
                      {gen.garmentCategory}
                    </span>
                    <span className="text-[10px] text-white/70">
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
