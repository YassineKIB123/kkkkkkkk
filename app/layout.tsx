import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PDFStudio - Professional All-in-One PDF Tools',
  description: 'Merge, split, compress, convert, edit, sign, and organize PDF documents securely in your browser.',
  openGraph: {
    title: 'PDFStudio - Professional All-in-One PDF Tools',
    description: 'Merge, split, compress, convert, edit, sign, and organize PDF documents securely in your browser.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFStudio - Professional All-in-One PDF Tools',
    description: 'Merge, split, compress, convert, edit, sign, and organize PDF documents securely in your browser.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
