"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGiftByToken, claimGiftAction } from '@/app/actions';
import { GiftCardPreview } from '@/components/GiftCardPreview';
import {
  CreditCard,
  Copy,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Zap,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ClaimGiftPage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gift, setGift] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    async function loadGift() {
      const result = await getGiftByToken(params.token);
      if (result.success) {
        setGift(result.gift);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadGift();
  }, [params.token]);

  const handleClaim = async () => {
    setIsClaiming(true);
    const result = await claimGiftAction(params.token);
    if (result.success) {
      setGift(result.gift);
      setShowDetails(true);
    } else {
      alert("Error claiming: " + result.error);
    }
    setIsClaiming(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleArchivePDF = async () => {
    setIsArchiving(true);
    try {
      const element = document.getElementById('gift-card-capture');
      if (!element) throw new Error("Card element not found");

      const canvas = await html2canvas(element, {
        backgroundColor: '#050505',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`nexusgift-card-${gift.token_symbol}.pdf`);

      setCopied('PDF Archived Successfully');
      setTimeout(() => setCopied(null), 3000);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  };

  const handleWalletIntegration = () => {
    setIsProvisioning(true);
    // Simulate API call to Apple/Google Pay provisioning service
    setTimeout(() => {
      setIsProvisioning(false);
      setCopied('Card Added to Digital Wallet');
      setTimeout(() => setCopied(null), 3000);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ash-950 flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-2 border-gold/20 border-t-gold animate-spin rounded-full" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-bold">Synchronizing Vault Session</p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-ash-950 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-heading italic text-white">Invalid Token</h1>
          <p className="text-white/40 text-sm font-body">This claim link has expired or the cryptographic signature is invalid.</p>
        </div>
        <a href="/" className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-[0.3em] transition-colors">Return to Terminal</a>
      </div>
    );
  }

  const card = gift.cards?.[0];
  const cardDetails = card ? JSON.parse(card.encrypted_full_details) : null;
  const metadata = gift.encrypted_metadata;

  return (
    <div className="bg-ash-950 min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: Card Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 space-y-10"
          >
            <div className="relative group" id="gift-card-capture">
              <GiftCardPreview
                amount={gift.usd_equivalent}
                recipient={metadata.recipientEmail}
                theme={gift.design || 'celebration'}
                cardNumber={cardDetails?.number}
                expiry={card?.expiry}
                cvv={cardDetails?.cvv}
                showDetails={showDetails}
              />
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-all pointer-events-none -m-4" />
            </div>

            <div className="flex justify-center gap-4">
              <div className="px-5 py-2 bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                <Zap className="w-3 h-3" />
                Value: {gift.token_amount} {gift.token_symbol}
              </div>
            </div>

            <div className="p-10 bg-ash-900 border border-white/5 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gold/20" />
              <p className="italic text-white/50 text-sm leading-relaxed font-body">"{metadata.message || "A confidential gift has been secured for you. No trace remains of the origin."}"</p>
            </div>
          </motion.div>

          {/* Right: Claim Actions */}
          <div className="lg:col-span-6 space-y-8 md:space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                Incoming Private Asset
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-white leading-tight">Secure <br /> Transmission.</h1>
              <p className="text-white/40 text-sm font-body leading-relaxed max-w-sm mx-auto md:mx-0">
                A <span className="text-gold italic">simulated</span> confidential transfer was successfully verified on Solana. Decrypt your virtual credentials below.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {gift.status !== 'CLAIMED' && !showDetails ? (
                <motion.div
                  key="unclaimed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="p-8 bg-gold/5 border border-gold/10 space-y-6">
                    <div className="flex items-center gap-4 text-gold">
                      <Lock className="w-5 h-5" />
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Encrypted Payload</h3>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed font-body uppercase tracking-widest">
                      CREDENTIALS ARE HEX-ENCODED UNTIL AUTHORIZED CLAIM ACTION IS INITIATED. STALENESS TIMEOUT ACTIVE.
                    </p>
                  </div>

                  <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="group relative w-full py-8 bg-white text-ash-950 font-bold uppercase tracking-[0.4em] text-xs hover:bg-gold transition-all duration-500 overflow-hidden disabled:opacity-30"
                  >
                    <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isClaiming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Unlocking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Claim Virtual Card
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="claimed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-10"
                >
                  <div className="bg-ash-900 border border-white/5 p-10 space-y-10">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <h3 className="text-[10px] font-bold text-gold uppercase tracking-[0.4em] flex items-center gap-3">
                        <CreditCard className="w-4 h-4" />
                        Card Decrypted
                      </h3>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-white/30 hover:text-white transition-colors"
                      >
                        {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="space-y-8 font-mono">
                      <div className="space-y-2">
                        <label className="text-[8px] uppercase font-bold text-white/20 tracking-[0.3em]">Card Identifier</label>
                        <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 text-sm tracking-[0.2em] text-white">
                          <span>{showDetails ? cardDetails.number : `•••• •••• •••• ${card.last_four}`}</span>
                          <button onClick={() => copyToClipboard(cardDetails.number, 'number')} className="text-white/20 hover:text-gold transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase font-bold text-white/20 tracking-[0.3em]">Temporal Expiry</label>
                          <div className="p-4 bg-black/40 border border-white/5 text-sm tracking-[0.2em] text-white">
                            {card.expiry}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase font-bold text-white/20 tracking-[0.3em]">Security Key</label>
                          <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 text-sm tracking-[0.2em] text-white">
                            <span>{showDetails ? cardDetails.cvv : '•••'}</span>
                            <button onClick={() => copyToClipboard(cardDetails.cvv, 'cvv')} className="text-white/20 hover:text-gold transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[9px] text-center text-gold font-bold tracking-widest uppercase"
                      >
                        {copied} Copied to clipboard
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleArchivePDF}
                      disabled={isArchiving}
                      className="py-5 border border-white/10 text-white/40 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 w-full"
                    >
                      {isArchiving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                      {isArchiving ? 'Generating...' : 'Archive to PDF'}
                    </button>

                    <div className="wallet-adapter-wrapper w-full">
                      <WalletMultiButton
                        className="!w-full !justify-center !py-6 !bg-gold !text-ash-950 !text-[10px] !font-bold !uppercase !tracking-[0.3em] !rounded-none !h-auto hover:!scale-[1.02] !transition-all !shadow-[0_10px_30px_-10px_rgba(212,175,55,0.3)]"
                      >
                        {connected ? (
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Wallet Connected
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Connect Wallet for Enhanced UX
                          </span>
                        )}
                      </WalletMultiButton>
                      <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] mt-3 text-center">
                        Wallet connection is optional and not required to claim.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

