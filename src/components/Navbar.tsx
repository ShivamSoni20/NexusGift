"use client";

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-ash-950/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="bg-gold p-2 transition-transform duration-500 group-hover:rotate-45">
                <Shield className="w-5 h-5 text-ash-950" />
              </div>
              <div className="absolute inset-0 border border-gold translate-x-1 translate-y-1 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            </div>
            <span className="text-lg font-heading italic font-medium tracking-tight text-white group-hover:text-gold transition-colors">
              NexusGift
            </span>
          </Link>

          <div className="flex items-center gap-8 lg:gap-12">
            <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              <Link href="/create" className="hover:text-gold transition-colors">Create</Link>
              <Link href="#features" className="hover:text-gold transition-colors">Architecture</Link>
            </div>

            <div className="wallet-adapter-wrapper flex justify-end">
              {mounted && (
                <WalletMultiButton className="!bg-white !text-ash-950 !rounded-none !text-[10px] !font-bold !uppercase !tracking-widest hover:!bg-gold !transition-all !h-12 !px-8 !border-none" />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
