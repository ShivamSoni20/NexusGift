"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftCardPreview } from '@/components/GiftCardPreview';
import { generatePrivatePayment } from '@/lib/privacy';
import { executeConfidentialTransfer } from '@/lib/shadowwire';
import { checkBalance } from '@/lib/solana-payment';
import { createGiftAction } from '@/app/actions';
import { useMode } from '@/contexts/ModeContext';
import { useConnection } from '@solana/wallet-adapter-react';
import {
    CreditCard,
    Mail,
    DollarSign,
    ShieldCheck,
    Loader2,
    ChevronLeft,
    CheckCircle2,
    Wallet,
    Zap,
    ArrowRight,
    Lock,
    UserCheck,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';

const TOKENS = [
    { symbol: 'USDC', name: 'USD Coin', price: 1, icon: DollarSign },
    { symbol: 'SOL', name: 'Solana', price: 100, icon: Wallet },
];

export default function CreateGiftPage() {
    const { connected, publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();
    const { mode } = useMode();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [claimToken, setClaimToken] = useState<string | null>(null);
    const [finalStatus, setFinalStatus] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [usingDemoIdentity, setUsingDemoIdentity] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const [formData, setFormData] = useState({
        recipientEmail: '',
        amount: 1,
        tokenSymbol: 'USDC',
        message: '',
        design: 'celebration',
        isScheduled: false,
        scheduledDate: '',
        scheduledTime: ''
    });

    const selectedToken = TOKENS.find(t => t.symbol === formData.tokenSymbol) || TOKENS[0];
    const usdEquivalent = formData.amount * selectedToken.price;

    const handleNext = () => setStep((s: number) => s + 1);
    const handleBack = () => setStep((s: number) => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setPaymentStatus('');

        try {
            let proof;

            // DEMO MODE: Use mock privacy layer
            if (mode === 'DEMO') {
                setPaymentStatus('Generating mock privacy proof...');
                proof = await generatePrivatePayment(formData.amount);
            }
            // PRODUCTION MODE: Use real ShadowWire confidential transfer
            else {
                if (!connected || !publicKey || !signTransaction) {
                    alert('Please connect your wallet to use Production mode');
                    setIsSubmitting(false);
                    return;
                }

                setPaymentStatus('Checking account balance...');
                const balanceCheck = await checkBalance(
                    connection,
                    publicKey,
                    formData.tokenSymbol as 'SOL' | 'USDC'
                );

                if (!balanceCheck.hasEnough || balanceCheck.balance < formData.amount) {
                    throw new Error(`Insufficient ${formData.tokenSymbol}. You have ${balanceCheck.balance.toFixed(4)}, but need ${formData.amount}.`);
                }

                // Create a temporary escrow wallet to receive the gift funds
                const escrowPubkey = new PublicKey('GiftEscrowDevnet11111111111111111111111111111');

                setPaymentStatus('Initiating confidential transfer via ShadowWire...');

                const transferResult = await executeConfidentialTransfer(
                    connection,
                    { connected, publicKey, signTransaction } as any,
                    escrowPubkey,
                    formData.amount,
                    formData.tokenSymbol as 'SOL' | 'USDC'
                );

                if (!transferResult.success) {
                    throw new Error(transferResult.error || 'Confidential transfer failed');
                }

                setPaymentStatus('Transfer confirmed. Verifying proof...');
                proof = transferResult.proof!;
            }

            const scheduledAt = formData.isScheduled
                ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
                : undefined;

            setPaymentStatus(mode === 'PRODUCTION' ? 'Issuing real Starpay card...' : 'Generating gift...');

            const result = await createGiftAction({
                recipientEmail: formData.recipientEmail,
                amount: formData.amount,
                tokenSymbol: formData.tokenSymbol,
                usdEquivalent,
                message: formData.message,
                design: formData.design,
                scheduledAt,
                proof,
                mode
            });

            if (result.success) {
                setClaimToken(result.claimToken!);
                setFinalStatus(result.status!);
                setPaymentStatus('');
                setStep(4);
            } else {
                if (result.fallbackToDemo && mode === 'PRODUCTION') {
                    const shouldFallback = confirm(
                        `Production mode failed: ${result.error}\n\nWould you like to continue in Demo mode instead?`
                    );
                    if (shouldFallback) {
                        window.location.reload(); // Reload to reset to demo
                    }
                } else {
                    alert("Error: " + result.error);
                }
            }
        } catch (err: any) {
            console.error(err);
            setPaymentStatus('');
            alert(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-ash-950 min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-3 py-1 rounded-none bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                            {connected ? (
                                <><UserCheck className="w-3 h-3" /> Identity Verified</>
                            ) : (
                                <><Zap className="w-3 h-3" /> Anonymous Simulation Mode</>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading italic tracking-tighter text-white">Configure Gift</h1>
                        <p className="text-white/40 font-body text-sm tracking-wide">
                            {connected
                                ? `Securing transmission with wallet ${publicKey?.toBase58().slice(0, 6)}...`
                                : "Enter parameters for a stateless confidential delivery."}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-3">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`w-12 h-0.5 transition-all duration-700 ${step >= i ? 'bg-gold' : 'bg-white/10'}`}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Step 0{step} of 03</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    {/* Left: Form */}
                    <div className="lg:col-span-7 space-y-12">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-12"
                                >
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Target Delivery</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
                                            <input
                                                type="email"
                                                placeholder="RECIPIENT@IDENTITY.COM"
                                                className="w-full bg-ash-900 border border-white/5 rounded-none py-6 pl-16 pr-6 focus:border-gold/50 transition-all outline-none font-body text-white uppercase tracking-widest text-xs"
                                                value={formData.recipientEmail}
                                                onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Asset Allocation</label>
                                        <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden">
                                            {TOKENS.map(token => (
                                                <button
                                                    key={token.symbol}
                                                    onClick={() => setFormData({ ...formData, tokenSymbol: token.symbol })}
                                                    className={`p-4 sm:p-8 flex flex-col items-center gap-3 transition-all duration-500 ${formData.tokenSymbol === token.symbol ? 'bg-gold text-ash-950' : 'bg-ash-900 text-white/40 hover:bg-white/5'}`}
                                                >
                                                    <token.icon className="w-5 h-5" />
                                                    <span className="text-[10px] font-bold tracking-widest">{token.symbol}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Quantum Amount</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-white/20 text-[10px]">{formData.tokenSymbol}</div>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                step="0.01"
                                                className="w-full bg-ash-900 border border-white/5 rounded-none py-6 pl-16 pr-6 focus:border-gold/50 transition-all outline-none font-body text-white tracking-widest text-lg"
                                                value={formData.amount}
                                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-gold/60 font-bold">≈ ${usdEquivalent.toFixed(2)} USD</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.recipientEmail || !formData.amount}
                                        className="group relative w-full py-6 bg-white text-ash-950 font-bold uppercase tracking-[0.3em] text-xs hover:bg-gold transition-all duration-500 overflow-hidden disabled:opacity-30"
                                    >
                                        <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            Proceed to Personalization <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-12"
                                >
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Temporal Dispatch</label>
                                        <div className="grid grid-cols-2 gap-0">
                                            <button
                                                onClick={() => setFormData({ ...formData, isScheduled: false })}
                                                className={`p-6 border flex flex-col items-center gap-2 transition-all duration-500 ${!formData.isScheduled ? 'bg-gold border-gold text-ash-950' : 'bg-ash-900 border-white/5 text-white/40 hover:bg-white/5'}`}
                                            >
                                                <Zap className="w-4 h-4" />
                                                <span className="text-[10px] font-bold tracking-widest">IMMEDIATE</span>
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, isScheduled: true })}
                                                className={`p-6 border flex flex-col items-center gap-2 transition-all duration-500 ${formData.isScheduled ? 'bg-gold border-gold text-ash-950' : 'bg-ash-900 border-white/5 text-white/40 hover:bg-white/5'}`}
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                <span className="text-[10px] font-bold tracking-widest">SCHEDULED</span>
                                            </button>
                                        </div>

                                        {formData.isScheduled && (
                                            <div className="grid grid-cols-2 gap-4 p-8 bg-black/30 border border-white/5 animate-in fade-in slide-in-from-top-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] uppercase font-bold text-white/30 tracking-widest">Target Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-gold transition-colors text-xs"
                                                        value={formData.scheduledDate}
                                                        onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] uppercase font-bold text-white/30 tracking-widest">Target Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full bg-transparent border-b border-white/10 py-2 text-white outline-none focus:border-gold transition-colors text-xs"
                                                        value={formData.scheduledTime}
                                                        onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Encoded Message</label>
                                        <textarea
                                            placeholder="YOUR CONFIDENTIAL MESSAGE..."
                                            className="w-full h-32 bg-ash-900 border border-white/5 rounded-none p-6 focus:border-gold/50 transition-all outline-none font-body text-white text-xs uppercase tracking-widest resize-none"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Visual Aesthetic</label>
                                        <div className="grid grid-cols-3 gap-0">
                                            {['minimal', 'celebration', 'birthday'].map(design => (
                                                <button
                                                    key={design}
                                                    onClick={() => setFormData({ ...formData, design })}
                                                    className={`py-4 border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${formData.design === design ? 'bg-gold border-gold text-ash-950' : 'bg-ash-900 border-white/5 text-white/40 hover:bg-white/5'}`}
                                                >
                                                    {design}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleBack}
                                            className="w-20 h-20 bg-ash-900 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/5"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={formData.isScheduled && (!formData.scheduledDate || !formData.scheduledTime)}
                                            className="group relative flex-1 bg-white text-ash-950 font-bold uppercase tracking-[0.3em] text-xs hover:bg-gold transition-all duration-500 overflow-hidden disabled:opacity-30"
                                        >
                                            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                Continue to Authorization <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-12"
                                >
                                    <div className="p-10 bg-ash-900 border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <ShieldCheck className="w-20 h-20 text-gold" />
                                        </div>

                                        <div className="space-y-8 relative z-10">
                                            <div className="flex items-center gap-3 text-gold">
                                                <Lock className="w-5 h-5" />
                                                <h3 className="text-xl font-heading italic">Shielded Verification</h3>
                                            </div>

                                            <div className="space-y-4 font-body">
                                                <div className="flex items-center gap-4 text-xs text-white/50 tracking-wide">
                                                    <div className="w-1.5 h-1.5 bg-gold/40" />
                                                    Identity Source: {connected ? `Wallet (${publicKey?.toBase58().slice(0, 4)}...)` : "Autonomous Mock Identity"}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-white/50 tracking-wide">
                                                    <div className="w-1.5 h-1.5 bg-gold/40" />
                                                    Confidentiality Layer: ShadowWire v1 Simulation
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-white/50 tracking-wide">
                                                    <div className="w-1.5 h-1.5 bg-gold/40" />
                                                    Network: {connected ? "Solana Mainnet/Devnet" : "Simulation Network (No Gas)"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-10 border-t border-white/5">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Authorized Payment</span>
                                                <div className="text-2xl font-body text-white">
                                                    {formData.amount} <span className="text-gold">{formData.tokenSymbol}</span>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Value Equivalence</span>
                                                <div className="text-4xl font-heading italic text-white">${usdEquivalent.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {!connected && !usingDemoIdentity && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="wallet-adapter-wrapper w-full">
                                                    {mounted && (
                                                        <WalletMultiButton className="!w-full !py-8 !bg-white !text-ash-950 !rounded-none !text-[10px] !font-bold !uppercase !tracking-[0.2em] hover:!bg-gold !transition-all !border-none !h-auto">
                                                            Connect Wallet
                                                        </WalletMultiButton>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setUsingDemoIdentity(true)}
                                                    className="w-full py-8 bg-gold/5 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    Continue in Demo Mode
                                                </button>
                                            </div>
                                        )}

                                        {(connected || usingDemoIdentity) && (
                                            <>
                                                {/* Payment Status Indicator */}
                                                {paymentStatus && (
                                                    <div className="mb-6 p-4 bg-gold/10 border border-gold/20 rounded-none">
                                                        <div className="flex items-center gap-3 text-gold">
                                                            <Shield className="w-4 h-4 animate-pulse" />
                                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                                {paymentStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className="group relative w-full py-10 bg-white text-ash-950 font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-gold transition-all duration-500 overflow-hidden disabled:opacity-30"
                                                >
                                                    <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                                        <span className="flex items-center gap-3">
                                                            {isSubmitting ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    {mode === 'PRODUCTION' ? 'Processing Transfer...' : 'Broadcasting Proof...'}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {mode === 'PRODUCTION' ? <Shield className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                                                    {mode === 'PRODUCTION' ? 'Fund via ShadowWire' : 'Authorize & Create Gift'}
                                                                </>
                                                            )}
                                                        </span>
                                                        <span className="text-[8px] opacity-40">
                                                            {mode === 'PRODUCTION' && !isSubmitting
                                                                ? "Confidential transfer • Amount hidden"
                                                                : (connected ? "SECURE TRANSACTION SIGNING" : "SIMULATING CONFIDENTIAL TRANSFER")}
                                                        </span>
                                                    </div>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-12 text-center py-10"
                                >
                                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gold/20 animate-ping rounded-full" />
                                        <div className="relative z-10 w-20 h-20 bg-gold flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10 text-ash-950" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-5xl font-heading italic text-white leading-tight">
                                            Operation <br /> Complete.
                                        </h2>
                                        <p className="text-white/40 text-sm font-body max-w-sm mx-auto leading-relaxed">
                                            The gift has been successfully vaulted and dispatched. The claim link is now stateless and active.
                                        </p>
                                    </div>

                                    <div className="p-10 bg-ash-900 border border-white/5 space-y-8 text-left">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Generated Claim Link</label>
                                            <div className="text-[10px] font-mono break-all text-gold bg-black/40 p-6 border border-white/5">
                                                {mounted ? window.location.origin : ''}/claim/{claimToken}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/claim/${claimToken}`);
                                                alert("Link copied to clipboard");
                                            }}
                                            className="text-[9px] font-bold text-white/40 hover:text-gold uppercase tracking-[0.4em] transition-colors"
                                        >
                                            COPY LINK TO CLIPBOARD
                                        </button>
                                    </div>

                                    <Link
                                        href="/"
                                        className="block w-full py-6 border border-white/10 text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 transition-all mt-10"
                                    >
                                        Return to Terminal
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Preview & Meta */}
                    <div className="lg:col-span-5 sticky top-32 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Live Simulation</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-gold animate-pulse" />
                                    <div className="w-1 h-1 bg-gold animate-pulse delay-75" />
                                    <div className="w-1 h-1 bg-gold animate-pulse delay-150" />
                                </div>
                            </div>
                            <GiftCardPreview
                                amount={usdEquivalent}
                                recipient={formData.recipientEmail || "ANONYMOUS"}
                                theme={formData.design}
                            />
                        </div>

                        <div className="p-10 bg-ash-900/50 border border-white/5 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gold/20" />
                            <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">System Entropy</h4>
                            <div className="space-y-4 font-mono text-[10px] text-white/30">
                                <div className="flex justify-between">
                                    <span>IDENTITY_SRC</span>
                                    <span className="text-white/60">{connected ? "SOL_WALLET" : "DEMO_FALLBACK"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ZK_PROOF_TYPE</span>
                                    <span className="text-white/60">SNARK_RANGE_SIM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>NETWORK_ID</span>
                                    <span className="text-white/60">{connected ? "SOLANA_BETA" : "VIRTUAL_MESH"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>PRIVACY_LEVEL</span>
                                    <span className="text-gold/80">MAXIMAL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
