import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cluster1Articles } from "./articles-cluster1.mjs";
import { cluster2Articles } from "./articles-cluster2.mjs";
import { cluster3Articles } from "./articles-cluster3.mjs";
import { cluster4Articles } from "./articles-cluster4.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, "..", "src", "content", "blog", "articles.json");

const AUTHORS = [
  {
    id: "alex-vance",
    name: "Alex Vance",
    role: "Lead Document Security Engineer",
    avatar: "/favicon.ico",
    bio: "Specialist in WebAssembly document processing, cryptographic privacy, and client-side browser architectures. Former browser security researcher with 12+ years optimizing high-throughput ISO 32000 document engines.",
    credentials: "M.Sc. in Computer Science, ISO 32000 & WebAssembly Security Specialist"
  },
  {
    id: "yassine-k",
    name: "Yassine K.",
    role: "Founder & Principal Systems Architect",
    avatar: "/favicon.ico",
    bio: "Systems architect and open-web advocate dedicated to building uncompromising, zero-upload client-side tools that preserve user privacy across the globe.",
    credentials: "B.Sc. in Software Engineering, Full-Stack WASM & Web Performance Engineer"
  }
];

const allArticles = [
  ...cluster1Articles,
  ...cluster2Articles,
  ...cluster3Articles,
  ...cluster4Articles,
];

const database = {
  authors: AUTHORS,
  articles: allArticles
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(database, null, 2), "utf-8");
console.log(`Successfully generated ${allArticles.length} authoritative guides in ${OUTPUT_PATH}`);
