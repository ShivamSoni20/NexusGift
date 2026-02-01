'use client';

import { CreditCard } from 'lucide-react';
import { CardItem } from './CardItem';

export function CardList({ cards }: { cards: any[] }) {
  return (
    <section className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-6 h-full backdrop-blur-sm">
      <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
        My Virtual Cards
        <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{cards.length} Total</span>
      </h2>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <CreditCard size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-sm italic">No cards issued yet</p>
          </div>
        ) : (
          cards.map((card, i) => (
            <CardItem key={card.id} card={card} index={i} />
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </section>
  );
}
 
 
