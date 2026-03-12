'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { api } from '@/lib/api';

const tooltipStyle = {
  contentStyle: {
    background: 'var(--card)',
    border: '1px solid rgba(128,128,128,0.15)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    padding: '10px 14px',
  },
  labelStyle: {
    color: 'var(--muted-foreground)',
    fontSize: '12px',
    marginBottom: '4px',
  },
  itemStyle: { color: 'var(--foreground)', fontSize: '13px' },
};

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, a, u] = await Promise.all([
          api('/admin/stats'),
          api('/admin/analytics'),
          api('/admin/users?limit=5'),
        ]);
        setStats(s);
        setAnalytics(a);
        setUsers(u);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-3 text-foreground/40">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t('admin.loading')}</span>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: t('admin.totalUsers'),
      value: stats?.totalUsers?.toLocaleString() || '0',
      change: stats?.generationGrowth || '0%',
      up: true,
      icon: Users,
      color: 'purple',
    },
    {
      title: t('admin.totalGenerations'),
      value: stats?.totalGenerations?.toLocaleString() || '0',
      change: stats?.generationGrowth || '0%',
      up: true,
      icon: TrendingUp,
      color: 'indigo',
    },
    {
      title: t('admin.apiCosts'),
      value: `$${(stats?.estimatedCost || 0).toFixed(2)}`,
      change: '+5.1%',
      up: false,
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: t('admin.avgProcessing'),
      value: '14.2s',
      change: '-8.3%',
      up: true,
      icon: Zap,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-sm text-foreground/30 mt-1">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl glass hover:bg-foreground/[0.02] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-${kpi.color}-500/10 border border-${kpi.color}-500/10 flex items-center justify-center`}>
                <kpi.icon
                  className={`w-5 h-5 text-${kpi.color}-500 dark:text-${kpi.color}-400`}
                />
              </div>
            </div>
            <p className="text-[13px] text-foreground/40 font-medium mb-1">
              {kpi.title}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${kpi.up ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                {kpi.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-semibold text-foreground">
              {t('admin.generationVolume')}
            </h3>
            <div className="flex items-center gap-4 text-xs text-foreground/30">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />{' '}
                {t('admin.merges')}
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyData || []}>
                <defs>
                  <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(128,128,128,0.1)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(128,128,128,0.5)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(128,128,128,0.5)', fontSize: 12 }}
                />
                <Tooltip {...tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="merges"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  fill="url(#gM)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass">
          <h3 className="text-[15px] font-semibold text-foreground mb-6">
            {t('admin.garmentCategories')}
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.garmentTypes || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value">
                  {(analytics?.garmentTypes || []).map(
                    (entry: any, index: number) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ),
                  )}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {(analytics?.garmentTypes || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-foreground/45">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-foreground/60">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl glass overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-foreground/[0.04]">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">
              {t('admin.recentUsers')}
            </h3>
            <p className="text-xs text-foreground/25 mt-1">
              {t('admin.latestRegistrations')}
            </p>
          </div>
          <a
            href="/admin/users"
            className="text-xs font-semibold text-purple-500 dark:text-purple-400 hover:opacity-80 transition-opacity">
            {t('admin.viewAll')}
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-foreground/[0.04]">
                {[
                  t('admin.user'),
                  t('admin.email'),
                  t('admin.plan'),
                  t('admin.totalMerges'),
                  t('admin.credits'),
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/25">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(users?.users || []).map((user: any) => (
                <tr
                  key={user.id}
                  className="border-b border-foreground/[0.02] hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/10 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-purple-500 dark:text-purple-400">
                          {(user.name || '?')
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <span className="text-[13px] font-medium text-foreground/70">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-foreground/40">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${user.plan === 'premium' ? 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/15' : 'bg-foreground/[0.03] text-foreground/40 border border-foreground/[0.06]'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-foreground/45 font-mono">
                    {user.totalMerges}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-foreground/45 font-mono">
                    {user.creditsLeft}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
