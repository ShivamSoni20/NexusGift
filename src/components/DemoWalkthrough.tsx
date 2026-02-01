"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Play,
    Zap,
    Shield,
    CreditCard,
    Send,
    DollarSign,
    Wallet,
    CheckCircle2,
    Loader2,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import { GiftCardPreview } from './GiftCardPreview';

const DEMO_STEPS = [
    {
        title: "01. ASSET SELECTION",
        description: "Allocator chooses the primary crypto asset from the secure vault.",
        duration: 3500,
    },
    {
        title: "02. QUANTUM VALUATION",
        description: "System identifies real-time USD equivalent for the chosen amount.",
        duration: 3500,
    },
    {
        title: "03. AESTHETIC ENCODING",
        description: "The digital artifact is personalized with a distinct visual theme.",
        duration: 3000,
    },
    {
        title: "04. ZK-PROOF GENERATION",
        description: "ShadowWire calculates shielded range proofs for complete anonymity.",
        duration: 4500,
    },
    {
        title: "05. MOCK ISSUANCE",
        description: "Stateless virtual credentials are generated via the Starpay gateway.",
        duration: 4000,
    },
    {
        title: "06. DISPATCH SEQUENCE",
        description: "Encoded claim link is transmitted to the target recipient.",
        duration: 3500,
    },
    {
        title: "07. ARTIFACT READY",
        description: "The recipient decrypts and claims their spendable virtual asset.",
        duration: 5000,
    }
];

export function DemoWalkthrough({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!isOpen || isPaused) return;

        const timer = setTimeout(() => {
            if (currentStep < DEMO_STEPS.length - 1) {
                setCurrentStep(s => s + 1);
            }
        }, DEMO_STEPS[currentStep].duration);

        return () => clearTimeout(timer);
    }, [isOpen, currentStep, isPaused]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ash-950/95 backdrop-blur-3xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl bg-ash-950 border border-white/5 rounded-none overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gold p-2">
                            <Zap className="w-5 h-5 text-ash-950" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-heading italic text-xl text-white">Simulation Walkthrough</h3>
                            <p className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-bold">Protocol Lifecycle Analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 text-white/20 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-10 min-h-[400px] md:min-h-[450px] flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-full flex flex-col items-center gap-8 md:gap-10"
                        >
                            {/* Step Visualization Area */}
                            <div className="w-full max-w-md bg-ash-900/50 border border-white/5 p-6 md:p-10 relative overflow-hidden h-56 md:h-64 flex items-center justify-center">
                                {currentStep === 0 && (
                                    <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 w-full">
                                        {[DollarSign, Wallet].map((Icon, i) => (
                                            <div key={i} className={`p-8 flex justify-center transition-all ${i === 1 ? 'bg-gold text-ash-950' : 'bg-black/20 text-white/20'}`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-4 text-center">
                                        <div className="text-5xl font-heading italic text-gold">12.50 SOL</div>
                                        <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">$1,250.00 USD EQUIVALENCE</div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                                        {['minimal', 'celebration', 'birthday'].map((d, i) => (
                                            <div key={i} className={`py-4 border text-[8px] flex items-center justify-center font-bold tracking-widest uppercase ${i === 1 ? 'bg-gold border-gold text-ash-950' : 'bg-white/5 border-white/5 text-white/20'}`}>
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-20 h-20 bg-gold/5 border border-gold/20 flex items-center justify-center relative">
                                            <Shield className="w-10 h-10 text-gold" />
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                className="absolute -inset-4 border border-dashed border-gold/10"
                                            />
                                        </div>
                                        <div className="text-[9px] font-bold text-gold uppercase tracking-[0.4em] flex items-center gap-3">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Generating zk-proof...
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <CreditCard className="w-16 h-16 text-white/80" />
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                className="absolute top-1/2 left-0 right-0 h-0.5 bg-gold origin-left"
                                            />
                                        </div>
                                        <div className="text-[9px] font-bold text-white uppercase tracking-[0.4em]">Mock Gateway: Response OK</div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 bg-gold flex items-center justify-center">
                                            <Send className="w-8 h-8 text-ash-950" />
                                        </div>
                                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.4em]">Claim Link Encoded & Dispatched</div>
                                    </div>
                                )}

                                {currentStep === 6 && (
                                    <motion.div
                                        initial={{ scale: 0.9, rotate: -2 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="w-full h-full p-4 flex items-center justify-center"
                                    >
                                        <GiftCardPreview
                                            amount={1250}
                                            recipient="LUCKY@DEMO.COM"
                                            theme="celebration"
                                            cardNumber="4532 8821 3491 1234"
                                            expiry="12/28"
                                            cvv="992"
                                            showDetails={true}
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {/* Step Annotation */}
                            <div className="text-center space-y-4 max-w-sm">
                                <h4 className="text-2xl font-heading italic text-white leading-none">{DEMO_STEPS[currentStep].title}</h4>
                                <p className="text-white/40 text-xs font-body leading-relaxed tracking-wide uppercase px-4">{DEMO_STEPS[currentStep].description}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="p-6 md:p-8 bg-ash-900 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex gap-2">
                        {DEMO_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-0.5 transition-all duration-700 ${i === currentStep ? 'w-8 md:w-10 bg-gold' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-6 md:gap-8">
                        <button
                            onClick={() => setCurrentStep(0)}
                            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all underline underline-offset-8 decoration-white/10"
                        >
                            Restart
                        </button>
                        <button
                            onClick={onClose}
                            className="group relative px-6 md:px-8 py-3 bg-white text-ash-950 text-[10px] font-bold uppercase tracking-[0.3em] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10">TERMINATE</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
