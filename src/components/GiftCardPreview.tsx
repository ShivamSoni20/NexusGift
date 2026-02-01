"use client";

import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Cake, PartyPopper, Zap } from 'lucide-react';

interface GiftCardProps {
  amount: number;
  recipient: string;
  theme: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  showDetails?: boolean;
}

export function GiftCardPreview({ amount, recipient, theme, cardNumber, expiry, cvv, showDetails }: GiftCardProps) {
  const themes: Record<string, { bg: string, icon: any, accent: string }> = {
    minimal: {
      bg: "from-zinc-800 to-black",
      icon: Zap,
      accent: "text-zinc-400"
    },
    birthday: {
      bg: "from-pink-500 via-purple-500 to-indigo-600",
      icon: Cake,
      accent: "text-pink-200"
    },
    celebration: {
      bg: "from-amber-400 via-orange-500 to-red-600",
      icon: PartyPopper,
      accent: "text-amber-200"
    },
    indigo: {
      bg: "from-indigo-600 to-purple-700",
      icon: CreditCard,
      accent: "text-indigo-200"
    },
  };

  const selectedTheme = themes[theme] || themes.celebration;
  const Icon = selectedTheme.icon;

  return (
    <div className={`relative w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-br ${selectedTheme.bg} p-6 text-white shadow-2xl overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Icon className="w-32 h-32" />
      </div>

      <div className="h-full flex flex-col justify-between relative z-10 font-sans">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit">
              Virtual Gift Card
            </div>
            {(cardNumber || showDetails) && (
              <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest pl-1">
                Mock Card • Demo Mode
              </div>
            )}
          </div>
          <div className="text-2xl font-bold italic tracking-tighter">NexusGift</div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-4xl font-bold mb-1 tracking-tight">${amount || "0"}</div>
            <div className="text-sm opacity-70 font-medium">For: {recipient || "Recipient"}</div>
          </div>
          {expiry && (
            <div className="text-right">
              <div className="text-[8px] uppercase opacity-50 font-bold tracking-widest">Expiry</div>
              <div className="text-xs font-mono">{expiry}</div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-[10px] uppercase opacity-50 font-bold tracking-widest">
              {showDetails ? "Card Number" : "Secure Card"}
            </div>
            <div className="font-mono tracking-[0.2em] text-sm sm:text-base">
              {showDetails && cardNumber ? cardNumber : "•••• •••• •••• ••••"}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {cvv && showDetails && (
              <div className="text-right">
                <div className="text-[8px] uppercase opacity-50 font-bold tracking-widest">CVV</div>
                <div className="text-xs font-mono">{cvv}</div>
              </div>
            )}
            <div className="bg-black/20 backdrop-blur-sm p-2 rounded-lg">
              <ShieldCheck className={`w-5 h-5 ${selectedTheme.accent}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
 
 
