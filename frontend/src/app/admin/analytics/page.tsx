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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Loader2 } from 'lucide-react';
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

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/admin/analytics')
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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          {t('admin.analytics')}
        </h1>
        <p className="text-xs sm:text-sm text-foreground/30 mt-1">
          Visual insights into platform usage and trends.
        </p>
      </div>

      {/* Daily Volume */}
      <div className="p-4 sm:p-6 rounded-2xl glass">
        <h3 className="text-sm sm:text-[15px] font-semibold text-foreground mb-4 sm:mb-6">
          {t('admin.generationVolume')} — {t('admin.last7days')}
        </h3>
        <div className="h-56 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.dailyData || []}>
              <defs>
                <linearGradient id="gMa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gUa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
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
                dataKey="newUsers"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#gUa)"
                strokeOpacity={0.6}
                name="New Users"
              />
              <Area
                type="monotone"
                dataKey="merges"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#gMa)"
                name="Merges"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bar Chart */}
        <div className="p-4 sm:p-6 rounded-2xl glass">
          <h3 className="text-sm sm:text-[15px] font-semibold text-foreground mb-4 sm:mb-6">
            Daily Merges vs New Users
          </h3>
          <div className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyData || []}>
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
                <Bar
                  dataKey="newUsers"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                  name="New Users"
                />
                <Bar
                  dataKey="merges"
                  fill="#7c3aed"
                  radius={[4, 4, 0, 0]}
                  name="Merges"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="p-4 sm:p-6 rounded-2xl glass">
          <h3 className="text-sm sm:text-[15px] font-semibold text-foreground mb-4 sm:mb-6">
            {t('admin.garmentCategories')}
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.garmentTypes || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value">
                  {(data?.garmentTypes || []).map((entry: any, idx: number) => (
                    <Cell key={idx} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {(data?.garmentTypes || []).map((item: any, i: number) => (
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
                  {item.count} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
