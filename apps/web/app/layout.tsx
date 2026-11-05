import type { Metadata } from 'next';
import './globals.css';
import { Web3Providers } from '@/lib/web3/providers';

export const metadata: Metadata = {
  title: 'TradeGuard — Smart Contract Escrow & Import Intelligence',
  description:
    'Institutional cross-border trade protection connecting Nigerian importers and international suppliers on Base Sepolia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-parchment text-obsidian min-h-screen selection:bg-amberGold selection:text-obsidian">
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
