"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Zap, Wallet, Menu, X, PlusCircle } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMode } from '@/contexts/ModeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { connected, publicKey } = useWallet();
    const { mode, setMode, canUseProduction } = useMode();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || isMenuOpen ? 'py-4 bg-ash-950/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
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
                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center gap-8">
                                <div className="flex items-center gap-3">
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

                                <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                                    <Link href="/create" className="hover:text-gold transition-colors flex items-center gap-2">
                                        <PlusCircle className="w-3 h-3" />
                                        Create
                                    </Link>
                                    <a href="#features" className="hover:text-gold transition-colors">Technology</a>
                                </div>
                            </div>

                            {/* Wallet Adapter - Hidden on very small screens, shown in menu */}
                            <div className="hidden sm:block wallet-adapter-wrapper">
                                {mounted && (
                                    <WalletMultiButton className="!bg-white !text-ash-950 !rounded-none !text-[10px] !font-bold !uppercase !tracking-widest hover:!bg-gold !transition-all !h-10 !px-6 !border-none" />
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 lg:hidden bg-ash-950 pt-24 px-6"
                    >
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Protocol Navigation</label>
                                <div className="flex flex-col gap-8">
                                    <Link
                                        href="/create"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-3xl font-heading italic text-white flex items-center gap-4 group"
                                    >
                                        <PlusCircle className="w-6 h-6 text-gold group-hover:rotate-90 transition-transform" />
                                        Create Gift
                                    </Link>
                                    <a
                                        href="#features"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-3xl font-heading italic text-white/60 hover:text-white"
                                    >
                                        Technology
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">System Configuration</label>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">Mode Selection</span>
                                        <button
                                            onClick={() => setMode(mode === 'DEMO' ? 'PRODUCTION' : 'DEMO')}
                                            disabled={mode === 'PRODUCTION' && !canUseProduction}
                                            className={`relative flex items-center gap-3 px-6 py-3 border transition-all ${mode === 'PRODUCTION'
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                : 'bg-gold/10 border-gold/30 text-gold'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${mode === 'PRODUCTION' ? 'bg-green-500 animate-pulse' : 'bg-gold'}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                                                {mode === 'PRODUCTION' ? 'Production (Live)' : 'Simulation (Demo)'}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="sm:hidden space-y-4">
                                        <span className="text-white/60 text-sm block">Wallet Identity</span>
                                        <div className="wallet-adapter-wrapper flex justify-center">
                                            {mounted && <WalletMultiButton className="!w-full !justify-center !bg-white !text-ash-950 !rounded-none !text-[10px] !font-bold !uppercase !tracking-widest" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
 
 
