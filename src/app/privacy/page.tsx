import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Cookie, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — In-Browser PDF Processing",
  description:
    "How iKnowAPDF handles your data: PDF tools process files in your browser without uploading them, plus details on cookies, ads, analytics and payments.",
  alternates: {
    canonical: "https://iknowapdf.lol/privacy",
  },
  openGraph: { images: ["/opengraph-image.png"],
    title: "Privacy Policy | iKnowAPDF",
    description:
      "How iKnowAPDF handles files, cookies, ads, analytics and payments.",
    url: "https://iknowapdf.lol/privacy",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: November 2026
              </p>
            </div>
          </div>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-rose-600" />
              <span>1. In-Browser Document Processing (No File Uploads)</span>
            </h2>
            <p>
              At <strong>iKnowAPDF</strong>, PDF and image operations—including editing text, compressing, merging, splitting, signing, scanning, rotating, converting, and cleaning metadata—run <strong>locally inside your web browser</strong> using JavaScript libraries (PDF.js, pdf-lib) and the HTML5 Canvas API.
            </p>
            <p>
              The files you process are <strong>not uploaded to or stored on</strong> our servers or any third-party storage. They are held in your browser tab&apos;s memory while you work and released when you close or refresh the tab. Camera images used by the document scanner also stay on your device.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-rose-600" />
              <span>2. Personal Data & Local Storage</span>
            </h2>
            <p>
              We do not require account registration, and we do not collect document contents. We use your browser&apos;s <code>localStorage</code> on your device to remember your language (<code>EN</code>, <code>FR</code>, <code>ES</code>, <code>RU</code>, <code>AR</code>) and theme, your cookie choice, a signature you choose to save in the Sign PDF tool, and whether an ad-free pass is active in that browser. This data stays in your browser and can be removed by clearing site data.
            </p>
            <p>
              <strong>Analytics:</strong> We may use Google Analytics to understand aggregate usage (pages visited, browser type, approximate location). It does not receive the contents of your files.
            </p>
            <p>
              <strong>Payments:</strong> The optional ad-free pass is paid through PayPal. PayPal processes your payment details under its own privacy policy; we do not receive your card number.
            </p>
            <p>
              <strong>Email:</strong> If you email us, we use your address and message only to reply.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cookie className="h-4 w-4 text-rose-600" />
              <span>3. Cookies & Third-Party Advertising (Google, NitroPay & Programmatic Partners)</span>
            </h2>
            <p>
              To keep iKnowAPDF free to use, we may display advertisements provided by third-party ad networks, including <strong>Google AdSense</strong>, <strong>NitroPay</strong>, and their programmatic demand partners:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Third-party vendors and ad exchanges (including Google and NitroPay), use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to iKnowAPDF and/or other sites on the Internet.
              </li>
              <li>
                <strong>CCPA / US State Privacy Rights:</strong> We do not sell or share personal files or documents. You may opt out of personalized third-party ad tracking at any time using the opt-out links below.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 underline hover:text-rose-500"
                >
                  Google Ads Settings
                </a>{" "}
                or{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 underline hover:text-rose-500"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or our client-side security practices, please visit our{" "}
              <Link href="/contact" className="text-rose-600 underline hover:text-rose-500">
                Contact Page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


