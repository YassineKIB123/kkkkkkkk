/**
 * Unlock PDF: detect what kind of protection a file has (pdf.js), check a password (pdf.js),
 * then remove the encryption losslessly with qpdf --decrypt (text, links, forms and bookmarks
 * are kept exactly; nothing is re-rendered). Everything runs in the browser.
 *
 * This never guesses or cracks passwords: files that need an open password can only be
 * unlocked with that password. Files that open without one but block printing/copying/editing
 * ("owner" restrictions) can have those restrictions removed directly.
 */
import { loadPdfJs } from "@/lib/pdf/pdf-utils";
import { runQpdf } from "@/lib/pdf/qpdf";

export type PdfLockState =
  | { kind: "not-encrypted"; pageCount: number }
  /** Opens without a password; `restrictions` lists what is blocked (may be empty). */
  | { kind: "restricted"; pageCount: number; restrictions: string[] }
  | { kind: "needs-password" };

export class UnlockError extends Error {
  constructor(
    message: string,
    public readonly reason: "wrong-password" | "damaged" | "engine"
  ) {
    super(message);
    this.name = "UnlockError";
  }
}

// pdf.js PermissionFlag values (stable across versions).
const PERMISSIONS: { flag: number; label: string }[] = [
  { flag: 4, label: "Printing" },
  { flag: 16, label: "Copying text and images" },
  { flag: 8, label: "Editing" },
  { flag: 32, label: "Adding comments" },
  { flag: 256, label: "Filling forms" },
  { flag: 1024, label: "Inserting, deleting or rotating pages" },
  { flag: 2048, label: "High-quality printing" },
];

function isPasswordError(err: unknown): err is { name: string; code: number } {
  return typeof err === "object" && err !== null && (err as { name?: string }).name === "PasswordException";
}

/** Opens the PDF with pdf.js (optionally with a password); throws pdf.js errors unchanged. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function openWithPdfJs(bytes: Uint8Array, password?: string): Promise<any> {
  const pdfjs = await loadPdfJs();
  return pdfjs.getDocument({
    data: bytes.slice(), // pdf.js transfers (detaches) the buffer it is given
    password,
    isEvalSupported: false,
  }).promise;
}

export async function inspectPdfLock(bytes: Uint8Array): Promise<PdfLockState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdf: any = null;
  try {
    pdf = await openWithPdfJs(bytes);
  } catch (err: unknown) {
    if (isPasswordError(err)) return { kind: "needs-password" };
    throw new UnlockError(
      "This file couldn't be read as a PDF. It may be damaged or not a real PDF.",
      "damaged"
    );
  }
  try {
    const pageCount: number = pdf.numPages;
    const { info } = await pdf.getMetadata().catch(() => ({ info: {} }));
    const encrypted = Boolean(info && (info as { EncryptFilterName?: string | null }).EncryptFilterName);
    if (!encrypted) return { kind: "not-encrypted", pageCount };
    // pdf.js 3.x returns an array of allowed flags, newer versions a Set; null = no restrictions.
    const raw: Iterable<number> | null = await pdf.getPermissions().catch(() => null);
    const allowed = raw ? Array.from(raw) : null;
    const restrictions = allowed ? PERMISSIONS.filter((p) => !allowed.includes(p.flag)).map((p) => p.label) : [];
    return { kind: "restricted", pageCount, restrictions };
  } finally {
    pdf.destroy?.();
  }
}

/** True when `password` opens the file. */
export async function checkPassword(bytes: Uint8Array, password: string): Promise<boolean> {
  try {
    const pdf = await openWithPdfJs(bytes, password);
    pdf.destroy?.();
    return true;
  } catch (err: unknown) {
    if (isPasswordError(err)) return false;
    throw new UnlockError("This file couldn't be read as a PDF. It may be damaged.", "damaged");
  }
}

/**
 * Returns a copy of the PDF with all encryption removed. Pass the open password for files that
 * need one; omit it for files that only have owner restrictions.
 */
export async function unlockPdf(bytes: Uint8Array, password?: string): Promise<Uint8Array> {
  const args = [...(password !== undefined ? [`--password=${password}`] : []), "--decrypt", "/in.pdf", "/out.pdf"];
  let result;
  try {
    result = await runQpdf(args, bytes);
  } catch (err: unknown) {
    throw new UnlockError(err instanceof Error ? err.message : "The unlock engine failed to load.", "engine");
  }
  // 0 = success, 3 = success with warnings (minor damage that qpdf repaired).
  if ((result.code === 0 || result.code === 3) && result.output && result.output.length > 0) return result.output;
  if (/invalid password/i.test(result.log)) {
    throw new UnlockError("That password is not correct for this PDF.", "wrong-password");
  }
  throw new UnlockError("This PDF couldn't be unlocked. The file may be damaged.", "damaged");
}
