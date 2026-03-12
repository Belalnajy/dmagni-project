'use client';

import React, { useEffect, useState } from 'react';
import {
  Shield,
  Server,
  Clock,
  Zap,
  Database,
  Globe,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/admin/stats')
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
      </div>
    );
  }

  const systemInfo = [
    { label: 'Backend Framework', value: 'NestJS v10', icon: Server },
    { label: 'Frontend Framework', value: 'Next.js 16', icon: Globe },
    { label: 'Database', value: 'PostgreSQL (Prisma ORM)', icon: Database },
    { label: 'AI Model', value: 'IDM-VTON via Replicate', icon: Zap },
    { label: 'Image Storage', value: 'Cloudinary', icon: Shield },
    { label: 'Rate Limit', value: '10 requests / 60s', icon: Clock },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('admin.settings')}
        </h1>
        <p className="text-sm text-foreground/30 mt-1">
          System configuration and information.
        </p>
      </div>

      {/* System Info */}
      <div className="rounded-2xl glass overflow-hidden">
        <div className="p-6 border-b border-foreground/[0.04]">
          <h3 className="text-[15px] font-semibold text-foreground">
            System Information
          </h3>
        </div>
        <div className="divide-y divide-foreground/[0.03]">
          {systemInfo.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.01] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                </div>
                <span className="text-[13px] text-foreground/60">
                  {item.label}
                </span>
              </div>
              <span className="text-[13px] font-medium text-foreground/80 font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="rounded-2xl glass overflow-hidden">
        <div className="p-6 border-b border-foreground/[0.04]">
          <h3 className="text-[15px] font-semibold text-foreground">
            Platform Stats
          </h3>
        </div>
        <div className="divide-y divide-foreground/[0.03]">
          {[
            {
              label: 'Total Users',
              value: stats?.totalUsers?.toLocaleString() || '0',
            },
            {
              label: 'Premium Users',
              value: stats?.premiumUsers?.toLocaleString() || '0',
            },
            {
              label: 'Free Users',
              value: stats?.freeUsers?.toLocaleString() || '0',
            },
            {
              label: 'Total Generations',
              value: stats?.totalGenerations?.toLocaleString() || '0',
            },
            {
              label: 'This Week Generations',
              value: stats?.thisWeekGenerations?.toLocaleString() || '0',
            },
            {
              label: 'Estimated Total Cost',
              value: `$${(stats?.estimatedCost || 0).toFixed(2)}`,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.01] transition-colors">
              <span className="text-[13px] text-foreground/50">
                {item.label}
              </span>
              <span className="text-[13px] font-semibold text-foreground/80 font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* API Configuration */}
      <div className="rounded-2xl glass overflow-hidden">
        <div className="p-6 border-b border-foreground/[0.04]">
          <h3 className="text-[15px] font-semibold text-foreground">
            API Configuration
          </h3>
        </div>
        <div className="divide-y divide-foreground/[0.03]">
          {[
            { label: 'REPLICATE_API_TOKEN', status: true },
            { label: 'CLOUDINARY_CLOUD_NAME', status: true },
            { label: 'CLOUDINARY_API_KEY', status: true },
            { label: 'CLOUDINARY_API_SECRET', status: true },
            { label: 'DATABASE_URL', status: true },
            { label: 'STRIPE_WEBHOOK_SECRET', status: false },
            { label: 'PAYMOB_HMAC_SECRET', status: false },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.01] transition-colors">
              <span className="text-[13px] text-foreground/50 font-mono">
                {item.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${item.status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                <div
                  className={`w-1.5 h-1.5 rounded-full ${item.status ? 'bg-emerald-400' : 'bg-yellow-400'}`}
                />
                {item.status ? 'Configured' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
