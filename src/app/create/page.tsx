"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftCardPreview } from '@/components/GiftCardPreview';
import { generatePrivatePayment } from '@/lib/privacy';
import { createGiftAction } from '@/app/actions';
import { 
  CreditCard, 
  Mail, 
  DollarSign, 
  ShieldCheck, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

export default function CreateGiftPage() {
  const { connected } = useWallet();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimToken, setClaimToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
      recipientEmail: '',
      amount: 50,
      message: '',
      design: 'celebration'
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
        // 1. Generate Private Payment (ShadowWire simulation)
        const proof = await generatePrivatePayment(formData.amount);
        
        // 2. Create Gift (Backend simulation)
        const result = await createGiftAction({
          ...formData,
          proof
        });

        if (result.success) {
          setClaimToken(result.claimToken!);
          setStep(4);
        } else {
          alert("Error: " + result.error);
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Create Private Gift</h1>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-8 h-1 rounded-full transition-colors ${step >= i ? 'bg-indigo-500' : 'bg-white/10'}`} 
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Form */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Recipient Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="email" 
                      placeholder="friend@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 transition-colors outline-none"
                      value={formData.recipientEmail}
                      onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Gift Amount (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="number" 
                      placeholder="50"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500 transition-colors outline-none"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!formData.recipientEmail || !formData.amount}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>Next: Choose Design</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Personal Message (Optional)</label>
                  <textarea 
                    placeholder="Enjoy your gift!"
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 transition-colors outline-none resize-none"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Card Design</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['birthday', 'celebration', 'minimal'].map(design => (
                      <button
                        key={design}
                        onClick={() => setFormData({ ...formData, design })}
                        className={`py-3 rounded-xl border capitalize transition-all text-sm font-bold ${formData.design === design ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
                      >
                        {design}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleBack}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center space-x-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-[2] py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center space-x-2"
                  >
                    <span>Next: Payment</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-6">
                  <div className="flex items-center space-x-3 text-indigo-400">
                    <ShieldCheck className="w-6 h-6" />
                    <h3 className="font-bold text-lg">🔐 Privacy Proof</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="font-bold text-white">Sender identity</span> is never revealed or stored on-chain.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="font-bold text-white">Gift amount</span> is hidden via cryptographic range proofs.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="font-bold text-white">Our backend</span> only sees validity proofs, never your payment details.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="font-bold text-white">Recipient</span> never sees the source wallet address.
                      </p>
                    </div>
                  </div>
                </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total to pay:</span>
                      <span className="font-bold text-xl">${formData.amount}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                  </div>

                    {!connected ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3">
                          <Wallet className="w-5 h-5 text-amber-500 mt-0.5" />
                          <p className="text-sm text-amber-200/80">
                            Please connect your Solana wallet to proceed with the private payment.
                          </p>
                        </div>
                        <div className="wallet-adapter-wrapper w-full">
                          {mounted && (
                            <WalletMultiButton className="!w-full !py-8 !bg-white !text-black !rounded-2xl !font-bold !flex !items-center !justify-center !space-x-3 hover:!bg-gray-200 !transition-colors" />
                          )}
                        </div>
                      </div>
                    ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-indigo-500 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing Private Payment...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>Confirm & Send Gift</span>
                        </>
                      )}
                    </button>
                  )}
                </motion.div>

            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold">Gift Sent Successfully!</h2>
                
                <div className="flex justify-center space-x-2">
                  {['CREATED', 'FUNDED', 'CARD_ISSUED', 'DELIVERED'].map((s, i) => (
                    <div key={s} className="flex flex-col items-center space-y-1">
                      <div className={`w-3 h-3 rounded-full ${i === 3 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-green-500/50'}`} />
                      <span className="text-[8px] text-gray-500 font-bold">{s}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-400 text-sm">
                  The gift lifecycle is complete. Your confidential payment was verified and the virtual card has been issued.
                </p>
                
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                    <div className="text-[10px] uppercase font-bold text-gray-500">Demo Claim Link</div>
                    <div className="text-xs font-mono break-all text-indigo-400">
                      {mounted ? window.location.origin : ''}/claim/{claimToken}
                    </div>
                  </div>

                <Link 
                  href="/"
                  className="block w-full py-4 bg-white text-black rounded-2xl font-bold"
                >
                  Back to Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Preview */}
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">Card Preview</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <GiftCardPreview 
            amount={formData.amount}
            recipient={formData.recipientEmail}
            theme={formData.design}
          />
          <div className="p-6 rounded-2xl border border-dashed border-white/10">
            <h4 className="text-sm font-bold mb-2">Private Metadata</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Commitment:</span>
                <span className="font-mono text-indigo-300/50">8f2...e4a</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Proof Type:</span>
                <span className="text-gray-300">ShadowWire ZK-Range</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
