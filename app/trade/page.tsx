'use client';

import { Navbar } from '@/components/Navbar';
import { Store } from '@/components/Store';
import { motion } from 'framer-motion';

export default function TradePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Real-Time Market</h1>
          <p className="text-zinc-400">Inventory is synchronized globally. Purchases are broadcasted instantly.</p>
        </motion.div>
        <Store />
      </main>
    </div>
  );
}
