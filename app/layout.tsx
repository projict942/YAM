import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YAM | Smart Quotation Wizard',
  description: 'YAM smart home quotation wizard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
