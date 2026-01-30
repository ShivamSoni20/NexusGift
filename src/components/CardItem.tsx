'use client';

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

export function CardItem({ card, index }: { card: any, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${
        card.card_type === 'Visa' ? 'bg-gradient-to-br from-indigo-600 to-blue-800 border-indigo-500/30' : 'bg-gradient-to-br from-slate-800 to-slate-950 border-slate-700/50'
      }`}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2">
          <CreditCard className="text-white/80" size={20} />
        </div>
        <img 
          src={card.card_type === 'Visa' ? 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' : 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'} 
          alt={card.card_type} 
          className={`h-4 opacity-80 ${card.card_type === 'Visa' ? 'brightness-0 invert' : ''}`} 
        />
      </div>
      
      <div className="space-y-1">
        <div className="text-white/60 text-[10px] font-medium uppercase tracking-[0.2em]">Balance</div>
        <div className="text-2xl font-bold text-white">${Number(card.amount).toFixed(2)}</div>
      </div>

      <div className="mt-6 flex justify-between items-end">
        <div className="font-mono text-white/90 tracking-widest text-sm">•••• •••• •••• 1234</div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-white/40 uppercase font-bold">Expires</span>
          <span className="text-xs text-white/80 font-mono">12/28</span>
        </div>
      </div>
      
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
    </motion.div>
  );
}
