import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import React from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl opacity-60" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-white transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Tools</span>
            </Link>

            {/* Privacy Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">100% Client-Side Only (Zero Uploads)</span>
              <span className="sm:hidden">100% Private</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-zinc-400">
              {description}
            </p>
          </div>
        </header>

        {/* Tool Content Workspace */}
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}