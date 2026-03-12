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
} from 'recharts';
import {
  Loader2,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
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
  labelStyle: { color: 'var(--muted-foreground)', fontSize: '12px' },
  itemStyle: { color: 'var(--foreground)', fontSize: '13px' },
};

export default function BillingPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/admin/usage')
      .then(setData)
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

  const kpis = [
    {
      title: 'Total This Month',
      value: data?.totalThisMonth || 0,
      icon: TrendingUp,
      color: 'purple',
    },
    {
      title: 'Estimated Cost',
      value: `$${(data?.estimatedMonthlyCost || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Success Rate',
      value: `${data?.successRate || 0}%`,
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      title: 'Failed',
      value: data?.failedThisMonth || 0,
      icon: XCircle,
      color: 'rose',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {t('admin.billing')}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/30 mt-1">
          API usage, costs, and payment gateway status.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-3 sm:p-5 rounded-2xl glass">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-${kpi.color}-500/10 border border-${kpi.color}-500/10 flex items-center justify-center mb-2 sm:mb-4`}>
              <kpi.icon
                className={`w-4 h-4 sm:w-5 sm:h-5 text-${kpi.color}-500 dark:text-${kpi.color}-400`}
              />
            </div>
            <p className="text-[11px] sm:text-[13px] text-foreground/40 mb-1">{kpi.title}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Daily Cost Chart */}
      <div className="p-4 sm:p-6 rounded-2xl glass">
        <h3 className="text-sm sm:text-[15px] font-semibold text-foreground mb-4 sm:mb-6">
          Daily API Costs — Last 30 Days
        </h3>
        <div className="h-52 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.dailyCosts || []}>
              <defs>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(128,128,128,0.1)"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(128,128,128,0.5)', fontSize: 10 }}
                interval={4}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(128,128,128,0.5)', fontSize: 12 }}
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [`$${Number(value).toFixed(3)}`, 'Cost']}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gC)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users */}
      <div className="rounded-2xl glass overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-foreground/[0.04]">
          <h3 className="text-sm sm:text-[15px] font-semibold text-foreground">
            Top Users by Usage
          </h3>
          <p className="text-[11px] sm:text-xs text-foreground/25 mt-1">
            Highest API consumers this period
          </p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b border-foreground/[0.04]">
              {['#', 'User', 'Email', 'Plan', 'Total Merges'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/25">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.topUsers || []).map((user: any, i: number) => (
              <tr
                key={user.id}
                className="border-b border-foreground/[0.02] hover:bg-foreground/[0.02] transition-colors">
                <td className="px-6 py-4 text-[13px] text-foreground/30 font-mono">
                  {i + 1}
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-foreground/70">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-[13px] text-foreground/40">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${user.plan === 'premium' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/15' : 'bg-foreground/[0.03] text-foreground/40 border border-foreground/[0.06]'}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] text-foreground/45 font-mono">
                  {user.totalMerges}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Payment Gateway Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-500">S</span>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">
                Stripe
              </h3>
              <p className="text-xs text-foreground/30">
                Webhook: /payment/webhook/stripe
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-500 font-medium">
              Ready for Integration
            </span>
          </div>
          <p className="text-xs text-foreground/25 mt-2">
            Set STRIPE_WEBHOOK_SECRET in .env to activate.
          </p>
        </div>
        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-500">P</span>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">
                Paymob
              </h3>
              <p className="text-xs text-foreground/30">
                Webhook: /payment/webhook/paymob
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-500 font-medium">
              Ready for Integration
            </span>
          </div>
          <p className="text-xs text-foreground/25 mt-2">
            Set PAYMOB_HMAC_SECRET in .env to activate.
          </p>
        </div>
      </div>
    </div>
  );
}
