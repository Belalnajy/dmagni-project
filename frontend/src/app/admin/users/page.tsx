'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { api } from '@/lib/api';

export default function UsersPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async (p: number) => {
    setLoading(true);
    try {
      const res = await api(`/admin/users?page=${p}&limit=15`);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleTierChange = async (userId: string, newTier: string) => {
    try {
      await api(`/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier }),
      });
      fetchUsers(page);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered =
    data?.users?.filter(
      (u: any) =>
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {t('admin.users')}
          </h1>
          <p className="text-xs sm:text-sm text-foreground/30 mt-1">
            {data?.total || 0} total users
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-purple-500/30 w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((user: any) => (
              <div key={user.id} className="p-4 rounded-2xl glass space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/10 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-purple-500 dark:text-purple-400">
                        {(user.name || '?').split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground/70">{user.name}</p>
                      <p className="text-[11px] text-foreground/40">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${user.plan === 'premium' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/15' : 'bg-foreground/[0.03] text-foreground/40 border border-foreground/[0.06]'}`}>
                    {user.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-foreground/40">
                  <span>Merges: <span className="font-mono text-foreground/60">{user.totalMerges}</span></span>
                  <span>Credits: <span className="font-mono text-foreground/60">{user.creditsLeft}</span></span>
                  <select
                    value={user.plan}
                    onChange={(e) => handleTierChange(user.id, e.target.value)}
                    className="text-xs bg-foreground/[0.03] border border-foreground/[0.06] text-foreground/60 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-purple-500/30">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="rounded-2xl glass overflow-hidden hidden md:block">
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
                      'Actions',
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
                  {filtered.map((user: any) => (
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
                          className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${user.plan === 'premium' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/15' : 'bg-foreground/[0.03] text-foreground/40 border border-foreground/[0.06]'}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-foreground/45 font-mono">
                        {user.totalMerges}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-foreground/45 font-mono">
                        {user.creditsLeft}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.plan}
                          onChange={(e) =>
                            handleTierChange(user.id, e.target.value)
                          }
                          className="text-xs bg-foreground/[0.03] border border-foreground/[0.06] text-foreground/60 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:border-purple-500/30">
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/30">
              Page {data?.page} of {data?.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg glass hover:bg-foreground/[0.04] disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4 text-foreground/50" />
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data?.totalPages || 1, p + 1))
                }
                disabled={page >= (data?.totalPages || 1)}
                className="p-2 rounded-lg glass hover:bg-foreground/[0.04] disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4 text-foreground/50" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
