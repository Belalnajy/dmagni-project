'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle,
  Loader2,
  ImageIcon,
  Shirt,
  Wand2,
  Lock,
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { api, apiUpload } from '@/lib/api';

type StatusType = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export default function TryOnComponent() {
  const { t } = useLanguage();
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(document.cookie.includes('userId='));
    };
    checkAuth();
    // Re-check on focus
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const handleFileSelect = useCallback(
    (type: 'model' | 'garment') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'model') {
          setModelFile(file);
          setModelPreview(reader.result as string);
        } else {
          setGarmentFile(file);
          setGarmentPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleMerge = async () => {
    if (!modelFile || !garmentFile) return;
    setStatus('uploading');

    try {
      const modelFormData = new FormData();
      modelFormData.append('file', modelFile);
      const modelData = await apiUpload<{ url: string }>(
        '/tryon/upload-model',
        modelFormData,
      );

      const garmentFormData = new FormData();
      garmentFormData.append('file', garmentFile);
      const garmentData = await apiUpload<{ url: string }>(
        '/tryon/upload-garment',
        garmentFormData,
      );

      setStatus('processing');

      const mergeData = await api<{ resultUrl: string }>('/tryon/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humanUrl: modelData.url,
          garmUrl: garmentData.url,
        }),
      });

      setResultUrl(
        typeof mergeData.resultUrl === 'string'
          ? mergeData.resultUrl
          : String(mergeData.resultUrl),
      );
      setStatus('completed');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          label: t('tryon.uploading'),
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          color: 'from-blue-500 to-indigo-600',
        };
      case 'processing':
        return {
          label: t('tryon.processing'),
          icon: <Sparkles className="w-5 h-5 animate-pulse" />,
          color: 'from-purple-500 to-violet-600',
        };
      case 'completed':
        return {
          label: t('tryon.done'),
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'from-emerald-500 to-green-600',
        };
      case 'error':
        return {
          label: t('tryon.error'),
          icon: <Loader2 className="w-5 h-5" />,
          color: 'from-red-500 to-rose-600',
        };
      default:
        return {
          label: t('tryon.mergeBtn'),
          icon: <Wand2 className="w-5 h-5" />,
          color: 'from-purple-600 to-indigo-600',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <section id="try-on" className="py-24 px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-500 dark:text-purple-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {t('tryon.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('tryon.title')}{' '}
            <span className="gradient-text">{t('tryon.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-foreground/40 max-w-xl mx-auto">
            {t('tryon.subtitle')}
          </p>
        </div>

        <div className="relative">
          {!isLoggedIn && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-background/40 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center border border-white/10 animate-scale-in">
              <div className="w-20 h-20 rounded-3xl bg-purple-600/20 flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/20">
                <Lock className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {t('tryon.loginRequired')}
              </h3>
              <p className="text-foreground/60 max-w-sm mb-8">
                {t('tryon.loginRequiredDesc')}
              </p>
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-purple-500/25">
                {t('tryon.loginBtn')}
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Step 1 */}
            <div
              className={`upload-zone p-8 flex flex-col items-center justify-center min-h-[320px] group ${modelFile ? 'has-file' : ''}`}
              onClick={() => modelInputRef.current?.click()}>
              <input
                ref={modelInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect('model')}
                className="hidden"
              />
              {modelPreview ? (
                <div className="w-full flex flex-col items-center">
                  <img
                    src={modelPreview}
                    alt="Model"
                    className="max-h-48 rounded-xl object-cover shadow-lg mb-4"
                  />
                  <span className="text-sm text-emerald-500 font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> {t('tryon.step1.done')}
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-center justify-center mb-5 group-hover:border-purple-500/30 transition-colors">
                    <ImageIcon className="w-8 h-8 text-foreground/20 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400 mb-2 block">
                      {t('tryon.step1')}
                    </span>
                    <p className="text-foreground font-semibold text-lg mb-1">
                      {t('tryon.step1.title')}
                    </p>
                    <p className="text-sm text-foreground/40">
                      {t('tryon.step1.desc')}
                    </p>
                    <p className="text-xs text-foreground/20 mt-2">
                      {t('tryon.format')}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Step 2 */}
            <div
              className={`upload-zone p-8 flex flex-col items-center justify-center min-h-[320px] group ${garmentFile ? 'has-file' : ''}`}
              onClick={() => garmentInputRef.current?.click()}>
              <input
                ref={garmentInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect('garment')}
                className="hidden"
              />
              {garmentPreview ? (
                <div className="w-full flex flex-col items-center">
                  <img
                    src={garmentPreview}
                    alt="Garment"
                    className="max-h-48 rounded-xl object-cover shadow-lg mb-4"
                  />
                  <span className="text-sm text-emerald-500 font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> {t('tryon.step2.done')}
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] flex items-center justify-center mb-5 group-hover:border-purple-500/30 transition-colors">
                    <Shirt className="w-8 h-8 text-foreground/20 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400 mb-2 block">
                      {t('tryon.step2')}
                    </span>
                    <p className="text-foreground font-semibold text-lg mb-1">
                      {t('tryon.step2.title')}
                    </p>
                    <p className="text-sm text-foreground/40">
                      {t('tryon.step2.desc')}
                    </p>
                    <p className="text-xs text-foreground/20 mt-2">
                      {t('tryon.format')}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Step 3 */}
            <div
              className={`upload-zone p-8 flex flex-col items-center justify-center min-h-[320px] ${resultUrl ? 'has-file' : ''}`}
              style={
                resultUrl
                  ? {
                      borderColor: 'rgba(124, 58, 237, 0.5)',
                      borderStyle: 'solid',
                    }
                  : undefined
              }>
              {status === 'processing' ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full h-48 bg-foreground/5 rounded-xl animate-pulse flex items-center justify-center">
                    <Wand2 className="w-12 h-12 text-purple-500/20 animate-bounce" />
                  </div>
                  <div className="h-4 w-24 bg-foreground/5 rounded mt-4 animate-pulse"></div>
                </div>
              ) : resultUrl ? (
                <div className="w-full flex flex-col items-center animate-scale-in">
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="max-h-48 rounded-xl object-cover shadow-2xl shadow-purple-500/20 mb-4"
                  />
                  <span className="text-sm text-purple-500 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> {t('tryon.step3.done')}
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/5 flex items-center justify-center mb-5">
                    <Sparkles className="w-8 h-8 text-foreground/15" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground/25 mb-2 block">
                      {t('tryon.step3')}
                    </span>
                    <p className="text-foreground/30 font-semibold text-lg mb-1">
                      {t('tryon.step3.title')}
                    </p>
                    <p className="text-sm text-foreground/20">
                      {t('tryon.step3.desc')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {status !== 'idle' && status !== 'completed' && (
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl glass">
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${statusConfig.color} animate-pulse`}
              />
              <span className="text-sm text-foreground/60 font-medium">
                {statusConfig.label}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleMerge}
            disabled={
              !modelFile ||
              !garmentFile ||
              (status !== 'idle' &&
                status !== 'completed' &&
                status !== 'error')
            }
            className={`relative group flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r ${statusConfig.color} shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 ease-out`}>
            {statusConfig.icon}
            {statusConfig.label}
          </button>
        </div>
      </div>
    </section>
  );
}
