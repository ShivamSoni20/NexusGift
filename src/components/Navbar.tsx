"use client";

import Link from 'next/link';
import { Shield, Gift, CreditCard } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              NexusGift
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/create" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Create Gift
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              How it Works
            </Link>
            <div className="wallet-adapter-wrapper min-w-[150px] flex justify-end">
              {mounted && (
                <WalletMultiButton className="!bg-white !text-black !rounded-full !text-sm !font-semibold hover:!bg-gray-200 !transition-colors !h-10 !px-6" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
