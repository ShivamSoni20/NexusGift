import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { ModeProvider } from "@/contexts/ModeContext";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

const bodyFont = Outfit({
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NexusGift | Private Gifting Refined",
  description: "Stateless, zero-knowledge gift issuance on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body bg-[#050505] text-[#e0e0e0] min-h-screen selection:bg-amber-500/30 overflow-x-hidden">
        <WalletContextProvider>
          <ModeProvider>
            <Navbar />
            <main className="">
              {children}
            </main>
          </ModeProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
 
 
