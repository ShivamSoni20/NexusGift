import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { WalletContextProvider } from "@/components/WalletContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusGift - Private Solana Gift Cards",
  description: "Secure and private card issuance on Solana powered by ShadowWire and StarPay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen selection:bg-indigo-500/30`}>
        <WalletContextProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </WalletContextProvider>
      </body>
    </html>
  );
}
