/**
 * Data contract for "requirement" landing pages: real-world upload limits
 * (exam portals, government forms, visa photos, email providers) with a
 * pre-configured tool. Every spec MUST be backed by a cited source.
 */
export type RequirementTool = "compress-image" | "compress-pdf" | "jpg-to-pdf";

export interface RequirementSpec {
  /** e.g. "Photograph", "Signature", "Category certificate (PDF)" */
  item: string;
  /** e.g. "JPG / JPEG", "PDF" */
  format: string;
  minKb?: number;
  maxKb: number;
  /** e.g. "3.5 cm × 4.5 cm" or "600 × 600 px (min) to 1200 × 1200 px (max)" */
  dimensions?: string;
  notes?: string;
  tool: RequirementTool;
  /** Preset passed to the tool; a safe margin under maxKb (and above minKb). */
  targetKb: number;
}

export interface RequirementPage {
  /** Root-level URL slug, e.g. "ssc-photo-signature-size" */
  slug: string;
  /** <= 60 characters, phrased like the search query */
  title: string;
  h1: string;
  /** <= 155 characters */
  metaDescription: string;
  /** e.g. "Staff Selection Commission (SSC)" or "Gmail" */
  portal: string;
  /** e.g. "India", "United States", "Global" */
  country: string;
  category: "exam" | "government" | "visa" | "email" | "other";
  /** 2–3 unique sentences; answer-first */
  intro: string;
  specs: RequirementSpec[];
  /** Which tool is embedded at the top of the page */
  primaryTool: RequirementTool;
  primaryTargetKb: number;
  steps: string[];
  tips: string[];
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  /** ISO date the specs were checked against sources, e.g. "2026-11-04" */
  verifiedOn: string;
}
