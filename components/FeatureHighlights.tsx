'use client';

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  FileCheck2,
  ServerOff,
  Globe2,
  HardDrive,
} from 'lucide-react';

export function FeatureHighlights() {
  const benefits = [
    {
      icon: ServerOff,
      title: 'Zero Server Uploads',
      description:
        'Documents are parsed, edited, and rendered locally in your browser memory. Your files never touch external storage or third-party servers.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      icon: Zap,
      title: 'Instant Local Speed',
      description:
        'Powered by compiled WebAssembly and native HTML5 canvas engines, processing begins immediately with zero upload queues.',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      icon: Lock,
      title: 'Bank-Grade Privacy',
      description:
        'Ideal for medical, legal, and financial records. File buffers are automatically purged upon tab closure or resetting the workspace.',
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      icon: Globe2,
      title: 'Universal Portability',
      description:
        'Runs seamlessly across modern browsers on macOS, Windows, Linux, Android, and iOS without native software installations.',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
  ];

  const formats = [
    { format: 'PDF', mime: 'application/pdf', role: 'Full read, write, manipulation & compression' },
    { format: 'DOCX', mime: 'application/vnd.openxmlformats...', role: 'Word document export and parsing' },
    { format: 'XLSX', mime: 'application/vnd.openxmlformats...', role: 'Excel worksheet data extraction & tables' },
    { format: 'PPTX', mime: 'application/vnd.openxmlformats...', role: 'PowerPoint presentation slide conversion' },
    { format: 'JPG / PNG', mime: 'image/jpeg, image/png', role: 'Lossless rendering & high-res image compiling' },
    { format: 'TXT / MD', mime: 'text/plain, text/markdown', role: 'Clean selectable text & markdown parsing' },
  ];

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Engineered for Security, Speed, and Portability
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            A self-contained client-side architecture that eliminates privacy vulnerabilities while delivering enterprise-grade performance.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${b.bg} ${b.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Supported Formats & Security Spec */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Supported File Formats & Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compliant with ISO 32000-1 PDF standard and ISO 19005-1 (PDF/A).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-rose-500" />
              <span>Native JavaScript & WebAssembly Engine</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formats.map((fmt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/40"
              >
                <div className="rounded-lg bg-rose-100 p-2 font-bold text-xs text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  {fmt.format}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {fmt.format} Processing
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {fmt.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
