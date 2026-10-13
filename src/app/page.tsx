import Link from "next/link";
import {
  ShieldCheck,
  ScanLine,
  Combine,
  Scissors,
  RotateCw,
  Images,
  FileType,
  ArrowRight,
  Zap,
  Lock,
  HardDriveDownload,
  CheckCircle2,
} from "lucide-react";

// Zero-dependency SVG for GitHub since lucide-react removed brand logos
function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

interface ToolItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ToolCategory {
  category: string;
  description: string;
  tools: ToolItem[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    category: "Scanner",
    description: "Camera capture, automatic corner detection, and document enhancement.",
    tools: [
      {
        title: "Mobile / Web CamScanner",
        description:
          "Scan paper documents using your webcam or phone camera with perspective correction and high-contrast B&W filters.",
        href: "/tools/scan",
        badge: "Edge AI / Canvas",
        icon: ScanLine,
      },
    ],
  },
  {
    category: "Organize",
    description: "Reorder, combine, slice, and structure PDF documents on demand.",
    tools: [
      {
        title: "Merge PDF",
        description:
          "Combine multiple PDF files into a single unified document with custom drag-and-drop order.",
        href: "/tools/merge-pdf",
        badge: "Lossless",
        icon: Combine,
      },
      {
        title: "Split PDF",
        description:
          "Extract specific page ranges, separate even/odd pages, or burst a PDF into individual files.",
        href: "/tools/split-pdf",
        badge: "Instant",
        icon: Scissors,
      },
      {
        title: "Rotate PDF",
        description:
          "Permanently rotate orientation for individual pages or entire documents with real-time visual preview.",
        href: "/tools/rotate-pdf",
        badge: "Visual Preview",
        icon: RotateCw,
      },
    ],
  },
  {
    category: "Convert",
    description: "High-DPI rasterization and pixel-perfect document transformations.",
    tools: [
      {
        title: "Images to PDF",
        description:
          "Convert JPG, PNG, and WebP collections into a clean, compact PDF with customizable margins and layouts.",
        href: "/tools/images-to-pdf",
        badge: "Batch",
        icon: Images,
      },
      {
        title: "PDF to Images",
        description:
          "Render PDF pages into crystal-clear, high-resolution PNG or JPG image files inside your browser.",
        href: "/tools/pdf-to-images",
        badge: "Up to 300 DPI",
        icon: FileType,
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl opacity-70" />
      </div>

      {/* Modern Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 group-hover:border-zinc-500 transition-colors">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              DocForge
            </span>
          </Link>

          {/* Privacy Indicator Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-400 shadow-[0_0_12px_-3px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <Lock className="h-3 w-3" />
            <span>100% Client-Side Privacy — Zero Cloud Uploads</span>
          </div>

          {/* GitHub Link */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-400 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Built on WebAssembly & Canvas Pipelines</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Free, Fast & 100% Private{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              PDF Tools
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto">
            Your files <span className="font-semibold text-zinc-200">never leave your device</span>.
            Process, scan, organize, and convert documents locally with raw client-side speed.
            No file size limits. No server queues. No tracking.
          </p>

          {/* Quick Metrics */}
          <div className="mt-10 grid grid-cols-3 gap-3 border-y border-zinc-800/80 py-5 text-center text-xs sm:text-sm">
            <div>
              <div className="font-mono font-bold text-white text-base sm:text-lg">0 KB</div>
              <div className="text-zinc-500">Sent to Cloud</div>
            </div>
            <div className="border-x border-zinc-800/80">
              <div className="font-mono font-bold text-emerald-400 text-base sm:text-lg">Instant</div>
              <div className="text-zinc-500">Processing Latency</div>
            </div>
            <div>
              <div className="font-mono font-bold text-white text-base sm:text-lg">Unlimited</div>
              <div className="text-zinc-500">Document Size</div>
            </div>
          </div>
        </div>

        {/* Categorized Tools Grid */}
        <div className="mt-20 space-y-14">
          {TOOL_CATEGORIES.map((cat) => (
            <section key={cat.category} className="space-y-5">
              <div className="border-b border-zinc-800/60 pb-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {cat.category}
                  </h2>
                  <span className="text-xs text-zinc-500">
                    {cat.tools.length} {cat.tools.length === 1 ? "Tool" : "Tools"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  {cat.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900/90 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 group-hover:border-zinc-600 group-hover:bg-zinc-800 text-zinc-300 group-hover:text-emerald-400 transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>

                          {tool.badge && (
                            <span className="rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase text-zinc-400 group-hover:text-zinc-300 transition-colors">
                              {tool.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
                          {tool.description}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-emerald-400 transition-colors">
                        <span>Launch Tool</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Technical Privacy Architecture Callout */}
        <section className="mt-24 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-8 sm:p-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-900/60 bg-emerald-950/40 text-emerald-400">
              <HardDriveDownload className="h-5 w-5" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-white">
              Why DocForge is strictly private
            </h3>

            <p className="text-sm leading-relaxed text-zinc-400">
              Traditional online converters transmit your confidential tax returns, contracts,
              and IDs to remote cloud servers to process. DocForge compiles document utilities directly
              to native WebAssembly and HTML5 Canvas API calls inside your browser tab:
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-950 px-4 py-2 text-xs font-mono text-zinc-300">
              <span className="text-zinc-400">Local File</span>
              <span className="text-zinc-600">→</span>
              <span className="text-emerald-400">Browser ArrayBuffer</span>
              <span className="text-zinc-600">→</span>
              <span className="text-cyan-400">pdf-lib / Web Worker</span>
              <span className="text-zinc-600">→</span>
              <span className="text-white">Instant Download</span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>No telemetry or uploads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Works offline once loaded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero server queue wait times</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <p>DocForge &copy; 2025. Pure client-side document engineering.</p>
      </footer>
    </div>
  );
}