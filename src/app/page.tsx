"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, Send, Zap, Play, ArrowRight, Sparkles } from 'lucide-react';
import { DemoWalkthrough } from '@/components/DemoWalkthrough';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { connected } = useWallet();
  const router = useRouter();
  const [prevConnected, setPrevConnected] = useState(connected);

  useEffect(() => {
    // Only redirect if the wallet transitions from false -> true
    if (connected && !prevConnected) {
      router.push('/create');
    }
    setPrevConnected(connected);
  }, [connected, prevConnected, router]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-ash-950 min-h-screen relative selection:bg-gold/30">
      <DemoWalkthrough isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-150" />
      </div>

      {/* Demo Mode Banner - Refined */}
      <div className="relative z-50 bg-gold/5 border-b border-gold/10 backdrop-blur-sm py-2">
        <p className="text-[10px] font-bold text-gold/80 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          <span className="w-1 h-1 bg-gold rounded-full animate-ping" />
          Hackathon Demo Mode • Stateless Engine Active
          <span className="w-1 h-1 bg-gold rounded-full animate-ping" />
        </p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-40">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto lg:mx-0 text-center lg:text-left"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-10">
            <Sparkles className="w-3 h-3" />
            <span>Redefining Privacy on Solana</span>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl sm:text-7xl md:text-8xl font-heading font-medium tracking-tight leading-[0.95] md:leading-[0.9] mb-8 text-white">
            Gifting, <br />
            <span className="italic text-gold italic pr-4">Unobserved.</span>
          </motion.h1>

          <motion.p variants={item} className="text-base md:text-xl text-white/50 font-body max-w-xl leading-relaxed mb-14 mx-auto lg:mx-0">
            Confidential on-chain payments rendered as spendable virtual cards.
            Zero-knowledge proofs ensure that your generosity remains yours alone.
            <span className="block mt-4 text-gold/60 font-medium italic">Demo: Instant stateless issuance. No collateral required.</span>
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/create"
              className="group relative w-full sm:w-auto px-10 py-5 bg-white text-ash-950 font-bold rounded-none hover:bg-gold transition-all duration-500 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs">
                Initiate Transfer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <button
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/10 text-white font-bold rounded-none hover:bg-white/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Walkthrough</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Dynamic Feature Grid */}
        <div id="features" className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-1 px-4 sm:px-0">
          {[
            {
              icon: Shield,
              title: "Vaulted Identity",
              desc: "Mock ZK-proofs mask sender origin and gift value during transmission.",
              delay: 0.1
            },
            {
              icon: CreditCard,
              title: "Ephemeral Issuance",
              desc: "Stateless cards generated on-demand without backend persistence.",
              delay: 0.2
            },
            {
              icon: Zap,
              title: "Global Settlement",
              desc: "Spend anywhere Visa/Mastercard are accepted via instant virtual card conversion.",
              delay: 0.3
            },
            {
              icon: Lock,
              title: "Absolute Zero",
              desc: "No database. No logs. No trace. Only the recipient holds the key.",
              delay: 0.4
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.8 }}
              viewport={{ once: true }}
              className={`p-10 bg-ash-900/50 border border-white/5 hover:border-gold/30 transition-all duration-700 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <feature.icon className="w-24 h-24 text-white" />
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-none bg-gold/10 border border-gold/20 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500">
                  <feature.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-2xl font-heading text-white mb-4 italic">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="mt-40 pb-20 px-6 border-t border-white/5 max-w-7xl mx-auto pt-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-heading italic text-2xl text-white/20">NexusGift</div>
          <div className="flex gap-10 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-gold transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
 
 
