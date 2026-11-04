import React from "react";
import Link from "next/link";
import { tokenizeInline } from "@/lib/blog/inline-markdown";

const LINK_CLASS =
  "font-semibold text-rose-600 underline decoration-rose-300 underline-offset-2 hover:text-rose-500 dark:text-rose-400 dark:decoration-rose-800";

/**
 * Renders article text with minimal inline markdown (links, **bold**, `code`)
 * as React elements. Never uses dangerouslySetInnerHTML.
 */
export function InlineText({ text }: { text: string }) {
  const tokens = tokenizeInline(text);
  return (
    <>
      {tokens.map((token, i) => {
        switch (token.kind) {
          case "link":
            return token.external ? (
              <a
                key={i}
                href={token.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                {token.label}
              </a>
            ) : (
              <Link key={i} href={token.href} className={LINK_CLASS}>
                {token.label}
              </Link>
            );
          case "bold":
            return (
              <strong key={i} className="font-semibold text-slate-900 dark:text-white">
                {token.value}
              </strong>
            );
          case "code":
            return (
              <code
                key={i}
                className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                {token.value}
              </code>
            );
          default:
            return <React.Fragment key={i}>{token.value}</React.Fragment>;
        }
      })}
    </>
  );
}
