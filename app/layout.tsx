import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

export const metadata: Metadata = {
  title: 'YAM | Smart Quotation Wizard',
  description: 'YAM smart home quotation wizard',
  icons: {
    icon: 'https://res.cloudinary.com/dyvadd9tt/image/upload/v1788811016/YAM_gpd2k1.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
