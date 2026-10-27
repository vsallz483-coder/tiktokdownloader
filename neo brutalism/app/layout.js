import './globals.css';
import { Bowlby_One, Space_Grotesk } from 'next/font/google';

const display = Bowlby_One({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Space_Grotesk({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: 'TikGrap',
  description: 'TikTok video (no watermark), audio and photo downloader',
};

export const viewport = {
  themeColor: '#FFE14D',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
