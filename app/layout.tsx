import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import RevealScript from '@/components/reveal-script';
import Tongbar from '@/components/tongbar';
import MainTheme from '@/components/main-theme';

export const metadata: Metadata = {
  title: "Claire's Parlor · 一个空间，四个房间",
  description:
    'Claire 的会客厅 — 5 年 PM 转型 AI 内容创业者的个人客厅。听播客、翻笔记、报 workshop、找合作，一站搞定。',
  icons: {
    // C-mark + accent dot — same brand mark as the nav <Logo />
    icon:
      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%230A0A0A%22/><path d=%22M22.5 11.4 C 20.6 9.5 18.4 8.6 16 8.6 C 11.6 8.6 8.4 12 8.4 16 C 8.4 20 11.6 23.4 16 23.4 C 18.4 23.4 20.6 22.5 22.5 20.6%22 stroke=%22white%22 stroke-width=%222.7%22 fill=%22none%22 stroke-linecap=%22round%22/><circle cx=%2222.6%22 cy=%2216%22 r=%222.2%22 fill=%22%233DA67A%22/></svg>',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <MainTheme>
          <Nav />
          <main>{children}</main>
          <Footer />
          <Tongbar />
        </MainTheme>
        <RevealScript />
      </body>
    </html>
  );
}
