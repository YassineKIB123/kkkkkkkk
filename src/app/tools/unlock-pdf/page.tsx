"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";
import { downloadBlob } from "@/lib/pdf/pdf-utils";
import { inspectPdfLock, checkPassword, unlockPdf, UnlockError, type PdfLockState } from "@/lib/pdf/unlock-pdf";
import { AlertCircle, Eye, EyeOff, FileText, KeyRound, Loader2, LockOpen, ShieldCheck, X } from "lucide-react";

type Phase = "idle" | "inspecting" | "ready" | "unlocking" | "done";

function unlockedName(name: string): string {
  return `${name.replace(/\.pdf$/i, "")}_unlocked.pdf`;
}

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [lock, setLock] = useState<PdfLockState | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<{ data: Uint8Array; name: string } | null>(null);

  const reset = () => {
    setFile(null);
    setBytes(null);
    setLock(null);
    setPhase("idle");
    setPassword("");
    setShowPassword(false);
    setError(null);
    setSuccess(null);
    setResult(null);
  };

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    reset();
    setFile(f);
    setPhase("inspecting");
    try {
      const data = new Uint8Array(await f.arrayBuffer());
      setBytes(data);
      setLock(await inspectPdfLock(data));
      setPhase("ready");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "This file couldn't be read.");
      setPhase("ready");
    }
  };

  const handleUnlock = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!file || !bytes || !lock || lock.kind === "not-encrypted") return;
    setError(null);
    setSuccess(null);
    if (lock.kind === "needs-password") {
      if (!password) {
        setError("Enter the password you use to open this PDF.");
        return;
      }
    }
    setPhase("unlocking");
    try {
      if (lock.kind === "needs-password" && !(await checkPassword(bytes, password))) {
        setError("That password doesn't open this PDF. Check capital letters and try again.");
        setPhase("ready");
        return;
      }
      const out = await unlockPdf(bytes, lock.kind === "needs-password" ? password : undefined);
      const name = unlockedName(file.name);
      setResult({ data: out, name });
      downloadBlob(out, name);
      setSuccess(`Done. "${name}" has been downloaded without a password or restrictions.`);
      setPhase("done");
    } catch (err: unknown) {
      if (err instanceof UnlockError && err.reason === "wrong-password") {
        setError("That password doesn't open this PDF. Check capital letters and try again.");
      } else {
        setError(err instanceof Error ? err.message : "This PDF couldn't be unlocked.");
      }
      setPhase("ready");
    }
  };

  const busy = phase === "inspecting" || phase === "unlocking";

  return (
    <ToolLayout
      toolId="unlockPdf"
      title="Unlock PDF – Remove PDF Password"
      description="Remove the password from a PDF you can open, or lift print, copy and edit restrictions. Works for Aadhaar, e-PAN and bank statement PDFs. Runs in your browser; nothing is uploaded."
      faqs={[
        {
          question: "How do I remove the password from a PDF?",
          answer:
            "Add the PDF above, type the password you normally use to open it, and click 'Unlock & download'. You get a copy that opens without asking for a password. The text, links, bookmarks and form fields are kept exactly as they were.",
        },
        {
          question: "Can you unlock a PDF if I don't know the password?",
          answer:
            "If the PDF asks for a password to open, you need that password: this tool does not guess or crack passwords. If the PDF opens normally but blocks printing, copying or editing, those restrictions can be removed without any password.",
        },
        {
          question: "What is the password for an Aadhaar card PDF?",
          answer:
            "The e-Aadhaar PDF password is usually the first four letters of your name as printed on the Aadhaar, in capital letters, followed by your year of birth in four digits. For example, ARUN KUMAR born in 1976 would use ARUN1976.",
        },
        {
          question: "What is the password for an e-PAN PDF?",
          answer:
            "The e-PAN PDF password is usually your date of birth written as DDMMYYYY with no spaces or slashes, for example 05081990. For companies and firms it is usually the date of incorporation in the same format.",
        },
        {
          question: "What is the password for my bank statement or credit card PDF?",
          answer:
            "It depends on the bank. The email that came with the statement normally explains the format, which is often a mix of the first letters of your name, your date of birth, or part of your customer ID or card number.",
        },
        {
          question: "Is my PDF uploaded anywhere?",
          answer:
            "No. The file is checked and decrypted inside your browser using the open-source qpdf engine compiled to WebAssembly. Neither the PDF nor the password is sent to a server.",
        },
      ]}
    >
      <div className="space-y-5">
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFiles}
            title="Drop a password-protected PDF here"
            description="The file is unlocked on this device and never uploaded."
          />
        )}

        {file && (
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                    {lock && lock.kind !== "needs-password" ? ` • ${lock.pageCount} page(s)` : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                disabled={phase === "unlocking"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span>Change file</span>
              </button>
            </div>

            {phase === "inspecting" && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin text-rose-600" aria-hidden="true" />
                <span>Checking how this PDF is protected…</span>
              </div>
            )}

            {lock?.kind === "not-encrypted" && (
              <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  This PDF isn&apos;t password-protected. There is nothing to unlock.
                </p>
                <p className="text-xs">
                  Need something else?{" "}
                  <Link href="/tools/compress-pdf" className="font-semibold underline">Compress it</Link>,{" "}
                  <Link href="/tools/edit-pdf" className="font-semibold underline">edit it</Link> or{" "}
                  <Link href="/tools/split-pdf" className="font-semibold underline">split it</Link>.
                </p>
              </div>
            )}

            {lock?.kind === "restricted" && phase !== "done" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                  <p className="font-semibold">This PDF opens without a password, but it is restricted.</p>
                  {lock.restrictions.length > 0 ? (
                    <p className="mt-1 text-xs">Blocked: {lock.restrictions.join(", ")}.</p>
                  ) : (
                    <p className="mt-1 text-xs">It is encrypted, which some apps and upload portals reject.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleUnlock()}
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-40 sm:w-auto"
                >
                  {phase === "unlocking" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <LockOpen className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{phase === "unlocking" ? "Removing restrictions…" : "Remove restrictions & download"}</span>
                </button>
              </div>
            )}

            {lock?.kind === "needs-password" && phase !== "done" && (
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pdf-password" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <KeyRound className="h-4 w-4 text-rose-600" aria-hidden="true" />
                    Password to open this PDF
                  </label>
                  <div className="relative">
                    <input
                      id="pdf-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      autoFocus
                      disabled={busy}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-11 font-mono text-sm text-slate-900 focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="e.g. ARUN1976"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <details className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-100">
                    Don&apos;t know the password? Common formats
                  </summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      <strong>Aadhaar (e-Aadhaar):</strong> first 4 letters of your name in CAPITALS + year of birth, e.g. ARUN1976.
                    </li>
                    <li>
                      <strong>e-PAN:</strong> date of birth as DDMMYYYY, e.g. 05081990.
                    </li>
                    <li>
                      <strong>Bank or card statements:</strong> check the email the statement came with; banks explain their format there.
                    </li>
                  </ul>
                </details>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-40 sm:w-auto"
                >
                  {phase === "unlocking" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <LockOpen className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{phase === "unlocking" ? "Unlocking…" : "Unlock & download"}</span>
                </button>
              </form>
            )}

            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {phase === "done" && success && (
              <div className="space-y-3">
                <ToolSuccessAlert message={success} />
                <div className="flex flex-col gap-2 sm:flex-row">
                  {result && (
                    <button
                      type="button"
                      onClick={() => downloadBlob(result.data, result.name)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    >
                      Download again
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    Unlock another PDF
                  </button>
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Only unlock files you own or have permission to use. The PDF and password stay on this device.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
