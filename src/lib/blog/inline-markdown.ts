/**
 * Minimal, safe inline-markdown tokenizer for blog article text.
 *
 * Supported syntax (nothing else is interpreted — no HTML is ever produced):
 *   [label](/internal-path)   -> internal link (Next <Link>)
 *   [label](https://host/...) -> external link (<a rel="noopener noreferrer">)
 *   **bold**                  -> <strong>
 *   `code`                    -> <code>
 *
 * Links with any other scheme (javascript:, data:, http:, //host, ...) are
 * rendered as their plain label text.
 */

export type InlineToken =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "code"; value: string }
  | { kind: "link"; label: string; href: string; external: boolean };

const INLINE_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`/g;

const INTERNAL_HREF = /^\/(?!\/)[A-Za-z0-9\-._~/#?=&%]*$/;
const EXTERNAL_HREF = /^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(?:[/?#][^\s"'<>]*)?$/;

export function classifyHref(href: string): "internal" | "external" | null {
  if (INTERNAL_HREF.test(href)) return "internal";
  if (EXTERNAL_HREF.test(href)) return "external";
  return null;
}

export function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      tokens.push({ kind: "text", value: text.slice(lastIndex, start) });
    }

    const [, linkLabel, linkHref, boldText, codeText] = match;
    if (linkLabel !== undefined && linkHref !== undefined) {
      const kind = classifyHref(linkHref);
      if (kind) {
        tokens.push({
          kind: "link",
          label: linkLabel,
          href: linkHref,
          external: kind === "external",
        });
      } else {
        tokens.push({ kind: "text", value: linkLabel });
      }
    } else if (boldText !== undefined) {
      tokens.push({ kind: "bold", value: boldText });
    } else if (codeText !== undefined) {
      tokens.push({ kind: "code", value: codeText });
    }

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

/** Plain-text version of an inline-markdown string (for JSON-LD, meta tags, word counts). */
export function stripInlineMarkdown(text: string): string {
  return tokenizeInline(text)
    .map((t) => (t.kind === "link" ? t.label : t.value))
    .join("");
}

/** Every link href found in an inline-markdown string (used by content checks). */
export function extractInlineHrefs(text: string): string[] {
  const hrefs: string[] = [];
  for (const match of text.matchAll(INLINE_PATTERN)) {
    if (match[2] !== undefined) hrefs.push(match[2]);
  }
  return hrefs;
}
