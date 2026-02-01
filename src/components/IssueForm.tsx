'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, CheckCircle2, Loader2, Plus } from 'lucide-react';

export function IssueForm({ 
  onIssue, 
  walletConnected 
}: { 
  onIssue: (amount: string, cardType: 'Visa' | 'Mastercard') => Promise<void>;
  walletConnected: boolean;
}) {
  const [step, setStep] = useState(0); // 0: Select, 1: Loading, 2: Success
  const [amount, setAmount] = useState('50');
  const [cardType, setCardType] = useState<'Visa' | 'Mastercard'>('Visa');
  const [loading, setLoading] = useState(false);

  const handleIssue = async () => {
    setLoading(true);
    setStep(1);
    try {
      await onIssue(amount, cardType);
      setStep(2);
    } catch (error) {
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Plus size={20} className="text-indigo-400" />
        Issue Private Gift Card
      </h2>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div 
            key="step0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setCardType('Visa')}
                className={`p-4 rounded-2xl border transition-all ${
                  cardType === 'Visa' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 grayscale opacity-60'
                }`}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 mx-auto mb-2" />
                <span className="text-xs font-medium uppercase tracking-wider">Visa Virtual</span>
              </button>
              <button 
                onClick={() => setCardType('Mastercard')}
                className={`p-4 rounded-2xl border transition-all ${
                  cardType === 'Mastercard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/50 grayscale opacity-60'
                }`}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 mx-auto mb-1" />
                <span className="text-xs font-medium uppercase tracking-wider">Mastercard Virtual</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">Card Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-semibold"
                />
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 flex gap-3 items-start">
              <Shield className="text-indigo-400 shrink-0" size={18} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Your payment will be processed via <span className="text-indigo-300 font-medium">ShadowWire</span>. 
                ZK proofs ensure your transaction amount and wallet balance remain private on-chain.
              </p>
            </div>

            <button 
              onClick={handleIssue}
              disabled={!walletConnected || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              Issue Private Card
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">Generating ZK Proof...</h3>
              <p className="text-sm text-slate-400 mt-1">Shielding your transaction with ShadowWire</p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">Card Issued Successfully!</h3>
              <p className="text-sm text-slate-400 mt-1">Your private {cardType} card is ready to use.</p>
            </div>
            <button 
              onClick={() => setStep(0)}
              className="text-indigo-400 text-sm font-medium hover:underline"
            >
              Issue another card
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
 
 
