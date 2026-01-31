"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Zap, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMode } from '@/contexts/ModeContext';

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { connected, publicKey } = useWallet();
    const { mode, setMode, canUseProduction } = useMode();

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

                    <div className="flex items-center gap-4 lg:gap-6">
                        {/* Mode Toggle */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => setMode(mode === 'DEMO' ? 'PRODUCTION' : 'DEMO')}
                                disabled={mode === 'PRODUCTION' && !canUseProduction}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-none border transition-all ${mode === 'PRODUCTION'
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : 'bg-gold/10 border-gold/30 text-gold'
                                    } ${!canUseProduction && mode === 'DEMO' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                                title={!canUseProduction ? 'Production mode requires API keys' : 'Toggle mode'}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${mode === 'PRODUCTION' ? 'bg-green-500 animate-pulse' : 'bg-gold'}`} />
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">
                                    {mode === 'PRODUCTION' ? 'Live' : 'Demo'}
                                </span>
                            </button>
                        </div>

                        {/* Wallet Status */}
                        <div className="hidden sm:flex items-center gap-2">
                            {connected ? (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-none bg-green-500/10 border border-green-500/20">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                                        {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                                    </span>
                                </div>
                            ) : mode === 'PRODUCTION' ? (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-none bg-orange-500/10 border border-orange-500/20">
                                    <Wallet className="w-3 h-3 text-orange-400" />
                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Connect Required</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-none bg-gold/5 border border-white/5">
                                    <Zap className="w-3 h-3 text-gold/30" />
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Simulation</span>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                            <Link href="/create" className="hover:text-gold transition-colors">Create</Link>
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
