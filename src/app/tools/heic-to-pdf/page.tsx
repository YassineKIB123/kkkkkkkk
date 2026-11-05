"use client";

import React from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { HeicConverter } from "@/components/tools/image/HeicConverter";

const FAQS = [
  {
    question: "How do I convert HEIC photos to a PDF?",
    answer:
      "Drop your .heic files above and click 'Convert to PDF'. Each photo becomes one page, in the order you added them, and you get a single PDF file. Choose A4 pages for printing and form uploads, or pages the same size as each photo.",
  },
  {
    question: "Does it work on Windows and Android?",
    answer:
      "Yes. Browsers other than Safari can't open HEIC files, so the page loads an open-source HEIC decoder (libheif) that runs inside your browser. Nothing is installed and nothing is uploaded.",
  },
  {
    question: "How do I make the PDF smaller?",
    answer:
      "Pick 'Smaller file' and 'Max 2048 px' before converting. If the PDF still has to fit a strict limit, run it through the PDF compressor afterwards.",
  },
  {
    question: "Are my photos private?",
    answer:
      "Yes. Everything happens on your device, and the output leaves out hidden EXIF data such as the photo's GPS location.",
  },
];

export default function HeicToPdfPage() {
  return (
    <ToolLayout
      title="HEIC to PDF Converter"
      description="Turn iPhone HEIC photos into one PDF on Windows, Android or Mac. A4 or photo-size pages. Free, and nothing is uploaded."
      faqs={FAQS}
    >
      <HeicConverter initialTarget="pdf" />
    </ToolLayout>
  );
}
