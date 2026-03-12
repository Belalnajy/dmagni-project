'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  Loader2,
  CheckCircle2,
  Clock,
  Trash2,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/contact`);
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, currentReadStatus: boolean) => {
    if (currentReadStatus) return;

    try {
      await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH',
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
      );
    } catch (err) {
      console.error('Failed to mark message as read', err);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('messages.title')}
          </h1>
          <p className="text-foreground/50 text-sm mt-1">
            {t('messages.desc')}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder={t('messages.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
          />
        </div>
      </div>

      <div className="glass rounded-2xl border border-foreground/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-500/5">
            {error}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              {t('messages.empty.title')}
            </h3>
            <p className="text-foreground/50">{t('messages.empty.desc')}</p>
          </div>
        ) : (
          <div className="divide-y divide-foreground/5">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 transition-colors duration-200 ${msg.isRead ? 'bg-background' : 'bg-purple-500/5 border-l-2 border-l-purple-500'}`}
                onMouseEnter={() => markAsRead(msg.id, msg.isRead)}>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground font-semibold">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        {msg.name}
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 text-[10px] uppercase font-bold tracking-wider">
                            New
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-foreground/50">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/40 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="pl-13 mt-3">
                  <p className="text-foreground/80 text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
