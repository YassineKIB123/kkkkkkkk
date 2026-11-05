"use client";

import React from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { HeicConverter } from "@/components/tools/image/HeicConverter";

const HEIC_FAQS = [
  {
    question: "How do I convert HEIC to JPG on Windows or Android?",
    answer:
      "Drop the .heic files above, keep 'JPG' selected and click Convert. Chrome, Edge and Firefox can't open HEIC by themselves, so the page loads an open-source HEIC decoder (libheif) that runs inside your browser. One photo downloads as a JPG; several download together as a ZIP.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. Decoding and re-encoding happen on your device. The converted file also leaves out the hidden EXIF data from the original, such as the GPS location where the photo was taken.",
  },
  {
    question: "Will I lose quality converting HEIC to JPG?",
    answer:
      "With 'High' quality the difference is not visible in normal use. The JPG is usually larger than the HEIC because JPEG compresses less efficiently. Choose 'Smaller file' or 'Max 2048 px' when you need to upload the photo to a form or send it by email.",
  },
  {
    question: "Can I put several iPhone photos into one PDF?",
    answer:
      "Yes. Choose 'PDF (one file)': every photo becomes one page, in the order you added them, on A4 pages or pages the same size as each photo.",
  },
  {
    question: "Why does my iPhone save photos as HEIC?",
    answer:
      "HEIC (High Efficiency Image Container) stores photos at about half the size of JPG. To make your iPhone shoot JPG instead, go to Settings > Camera > Formats and choose 'Most Compatible'.",
  },
];

export default function HeicToJpgPage() {
  return (
    <ToolLayout
      toolId="heicToJpg"
      title="HEIC to JPG Converter"
      description="Convert iPhone HEIC photos to JPG, PNG or PDF on Windows, Android or Mac. Batch convert, download as ZIP. Free, and nothing is uploaded."
      faqs={HEIC_FAQS}
    >
      <HeicConverter initialTarget="jpg" />
    </ToolLayout>
  );
}
