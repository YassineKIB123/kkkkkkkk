// Generates the default Open Graph / Twitter card image (1200x630 PNG) using
// the @vercel/og renderer bundled with Next.js. Run: node scripts/generate-og-image.mjs
// Output: src/app/opengraph-image.png and src/app/twitter-image.png (Next.js
// file-based metadata, inherited by every route).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import React from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const h = React.createElement;

const el = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "72px 88px",
      background: "linear-gradient(135deg, #ffffff 0%, #fff1f2 60%, #ffe4e6 100%)",
      color: "#0f172a",
    },
  },
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 20, marginBottom: 40 } },
    h("div", {
      style: { width: 72, height: 72, borderRadius: 18, background: "#e11d48", display: "flex" },
    }),
    h(
      "div",
      { style: { display: "flex", fontSize: 52, fontWeight: 800 } },
      h("span", null, "iKnowA"),
      h("span", { style: { color: "#e11d48" } }, "PDF")
    )
  ),
  h("div", { style: { display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 } }, "Free, private PDF tools."),
  h("div", { style: { display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.1, color: "#e11d48" } }, "No upload."),
  h(
    "div",
    { style: { display: "flex", marginTop: 36, fontSize: 30, color: "#475569" } },
    "Compress, merge, split, sign, convert — files never leave your device."
  )
);

const res = new ImageResponse(el, { width: 1200, height: 630 });
const buf = Buffer.from(await res.arrayBuffer());
for (const name of ["opengraph-image.png", "twitter-image.png"]) {
  fs.writeFileSync(path.join(__dirname, "..", "src", "app", name), buf);
}
console.log(`OG image written (${buf.length} bytes)`);
