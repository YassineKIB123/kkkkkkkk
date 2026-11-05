/**
 * qpdf (C++, Apache-2.0) compiled to WebAssembly — loaded on demand from /public, like pdf.js.
 * Source: @neslinesli93/qpdf-wasm 0.3.1 (ISC). Files live in /public/qpdf/<version>/ so they can
 * be cached forever; bump QPDF_BASE when upgrading.
 *
 * Each call creates a fresh module instance: qpdf's main() is not designed to be re-entered,
 * and an instance costs only a few tens of milliseconds once the .wasm is in the HTTP cache.
 */

const QPDF_BASE = "/qpdf/0.3.1";

interface QpdfFS {
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
}

interface QpdfInstance {
  callMain: (args: string[]) => number;
  FS: QpdfFS;
}

type QpdfFactory = (opts: Record<string, unknown>) => Promise<QpdfInstance>;

declare global {
  interface Window {
    Module?: unknown;
  }
}

let factoryPromise: Promise<QpdfFactory> | null = null;

function loadFactory(): Promise<QpdfFactory> {
  if (typeof window === "undefined") return Promise.reject(new Error("qpdf requires a browser."));
  if (factoryPromise) return factoryPromise;
  factoryPromise = new Promise<QpdfFactory>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${QPDF_BASE}/qpdf.js`;
    script.async = true;
    script.onload = () => {
      // The emscripten bundle declares a global `Module` factory; take it and clear the global.
      const factory = window.Module as QpdfFactory | undefined;
      window.Module = undefined;
      if (typeof factory === "function") resolve(factory);
      else {
        factoryPromise = null;
        reject(new Error("The PDF unlock engine failed to start."));
      }
    };
    script.onerror = () => {
      script.remove();
      factoryPromise = null;
      reject(new Error("Network error while loading the PDF unlock engine."));
    };
    document.head.appendChild(script);
  });
  return factoryPromise;
}

export interface QpdfResult {
  /** qpdf exit status: 0 = success, 3 = success with warnings, 2 = error. */
  code: number;
  /** /out.pdf when the command produced it. */
  output: Uint8Array | null;
  /** Everything qpdf printed (stdout + stderr). */
  log: string;
}

/**
 * Runs qpdf with `args`. The input is available as "/in.pdf"; write output to "/out.pdf".
 * Passwords must be passed as `--password=...` (never logged by this module).
 */
export async function runQpdf(args: string[], input: Uint8Array): Promise<QpdfResult> {
  const factory = await loadFactory();
  const lines: string[] = [];

  // This build binds console.log / console.error when the instance is created, so route them
  // into `lines` for exactly that synchronous moment, then restore the real console.
  const realLog = console.log;
  const realErr = console.error;
  console.log = (...a: unknown[]) => lines.push(a.map(String).join(" "));
  console.error = (...a: unknown[]) => lines.push(a.map(String).join(" "));
  let pending: Promise<QpdfInstance>;
  try {
    pending = factory({
      noInitialRun: true,
      locateFile: (path: string) => `${QPDF_BASE}/${path}`,
    });
  } finally {
    console.log = realLog;
    console.error = realErr;
  }
  const qpdf = await pending;

  qpdf.FS.writeFile("/in.pdf", input);
  let code: number;
  try {
    code = qpdf.callMain(args);
  } catch (e: unknown) {
    const status = (e as { status?: unknown })?.status;
    code = typeof status === "number" ? status : 2;
  }
  let output: Uint8Array | null = null;
  try {
    output = qpdf.FS.readFile("/out.pdf");
  } catch {
    output = null;
  }
  return { code, output, log: lines.join("\n") };
}
