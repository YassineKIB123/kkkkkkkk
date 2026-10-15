"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck, Globe, Cpu, Lock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to iKnowAPDF Home</span>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/50 dark:border-blue-900">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                About Us & Contact
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learn how iKnowAPDF protects your document privacy and get in touch with our team
              </p>
            </div>
          </div>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-rose-600" />
              <span>About iKnowAPDF (iknowapdf.lol)</span>
            </h2>
            <p>
              <strong>iKnowAPDF</strong> was built with a simple mission: to provide fast, studio-quality PDF editing, compression, merging, splitting, signing, scanning, and conversion tools that run <strong>100% locally in your browser</strong>—without forcing you to upload sensitive documents to unknown cloud servers or pay expensive monthly subscriptions.
            </p>
            <p>
              Whether you are preparing job applications, signing legal contracts, compressing bank statements for portal uploads, or converting academic research papers, our tools are engineered to work immediately on Windows, macOS, Linux, iOS, and Android without watermarks or registration walls.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>How Our Client-Side Security Architecture Works</span>
            </h2>
            <p>
              Traditional online PDF websites require you to upload your files to a remote backend server, process them in the cloud, and download the result. That approach creates unnecessary privacy risks for personal tax forms, IDs, medical records, and business agreements.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Zero Cloud Uploads:</strong> iKnowAPDF processes every byte inside your browser&apos;s sandboxed memory using WebAssembly, PDF.js, and HTML5 Canvas APIs.
              </li>
              <li>
                <strong>Zero Data Retention:</strong> We do not operate file-storage databases. The moment you close your browser tab, your document data is permanently cleared from RAM.
              </li>
              <li>
                <strong>Offline Capability:</strong> Once loaded, our Progressive Web App (PWA) can process documents even if you disconnect from the internet.
              </li>
            </ul>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Contact Our Support Team</span>
            </h2>
            <p>
              Have a question, bug report, DMCA/legal inquiry, or feature request? Reach out to our support team anytime and we will respond within 24–48 business hours:
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Direct Email Support
              </p>
              <a
                href="mailto:cabronejizzy@gmail.com"
                className="text-sm font-bold text-rose-600 hover:underline"
              >
                cabronejizzy@gmail.com
              </a>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-5 text-xs font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-rose-600 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-rose-600 underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}