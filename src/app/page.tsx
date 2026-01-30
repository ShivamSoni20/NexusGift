"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Lock, CreditCard, Send, Zap } from 'lucide-react';

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div variants={item} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-400 mb-8">
            <Zap className="w-3 h-3" />
            <span>Powered by ShadowWire & StarPay</span>
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
            Private Gifting on <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Solana</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Send gifts anonymously with zero-knowledge proofs. Deliver spendable virtual Visa/Mastercards directly to anyone's inbox. No KYC, no trace.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/create"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <span>Create Private Gift</span>
              <Send className="w-5 h-5" />
            </Link>
            <Link 
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              How it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Privacy First",
              description: "ZK-proofs ensure your identity and gift amount remain confidential on-chain."
            },
            {
              icon: CreditCard,
              title: "Instant Issuance",
              description: "Real-time virtual card creation via StarPay. Spendable anywhere Visa/MC is accepted."
            },
            {
              icon: Lock,
              title: "No KYC Required",
              description: "True permissionless gifting. No IDs, no verification, just pure crypto freedom."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
