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
  Lock
} from 'lucide-react';

export default function ClaimGiftPage({ params }: { params: { token: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gift, setGift] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-gray-400">Securing claim session...</p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold">Gift Not Found</h1>
        <p className="text-gray-400">This claim link may be invalid or expired.</p>
      </div>
    );
  }

  const card = gift.cards?.[0];
  const cardDetails = card ? JSON.parse(card.encrypted_full_details) : null;
  const metadata = gift.encrypted_metadata;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Card Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <GiftCardPreview 
              amount={0} 
              recipient={metadata.recipientEmail}
              theme={gift.design || 'celebration'}
            />
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="italic text-gray-300">"{metadata.message || "Enjoy your private gift!"}"</p>
            </div>
          </motion.div>

        {/* Right: Claim Actions */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">You received a private gift!</h1>
            <p className="text-gray-400">
              A confidential transfer was initiated on Solana. You can now claim your virtual Visa card.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {gift.status !== 'claimed' && !showDetails ? (
              <motion.div
                key="unclaimed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-4">
                  <div className="flex items-center space-x-3 text-indigo-400">
                    <Lock className="w-6 h-6" />
                    <h3 className="font-bold">Encrypted Card Details</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Details are locked until you claim. No wallet or KYC required.
                  </p>
                </div>

                <button 
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Unlocking Card...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Claim Virtual Card</span>
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="claimed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      Virtual Card Details
                    </h3>
                    <button 
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500">Card Number</label>
                      <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl font-mono">
                        <span>{showDetails ? cardDetails.number : `•••• •••• •••• ${card.last_four}`}</span>
                        <button onClick={() => copyToClipboard(cardDetails.number, 'number')} className="text-gray-500 hover:text-white">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">Expiry</label>
                        <div className="p-3 bg-black/40 rounded-xl font-mono">
                          {card.expiry}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500">CVV</label>
                        <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl font-mono">
                          <span>{showDetails ? cardDetails.cvv : '•••'}</span>
                          <button onClick={() => copyToClipboard(cardDetails.cvv, 'cvv')} className="text-gray-500 hover:text-white">
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
                      className="text-xs text-center text-green-500"
                    >
                      Copied {copied} to clipboard!
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                    <Download className="w-4 h-4" />
                    Save PDF
                  </button>
                  <button className="py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors">
                    <CreditCard className="w-4 h-4" />
                    Use with Apple Pay
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
