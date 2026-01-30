'use client';

import { Shield, Wallet } from 'lucide-react';

export function Header({ 
  walletConnected, 
  onConnect 
}: { 
  walletConnected: boolean; 
  onConnect: () => void 
}) {
  return (
    <header className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Shield className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
          NexusGift
        </h1>
      </div>
      <button 
        onClick={onConnect}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          walletConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        <Wallet size={18} />
        {walletConnected ? 'Connected: ...4x92' : 'Connect Wallet'}
      </button>
    </header>
  );
}
