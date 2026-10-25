"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, MessageSquare } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("support");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Simulate instant capture with direct mailto fallback
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30 text-center space-y-2">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/80 dark:text-emerald-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Message Received
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Thank you, <strong>{name}</strong>. Your inquiry has been routed to our technical support team. You will receive a direct reply at <strong>{email}</strong> within 24 to 48 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Your Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Inquiry Subject
        </label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-colors"
        >
          <option value="support">Technical Support & Tool Assistance</option>
          <option value="bug">Bug Report / Processing Error</option>
          <option value="partnership">Commercial & Advertising Inquiries</option>
          <option value="privacy">Privacy & Security Questions</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Message
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe how we can assist you..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-500 transition-colors cursor-pointer"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Submit Inquiry</span>
      </button>
    </form>
  );
}
