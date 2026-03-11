'use client';

import { Navbar } from "@/components/Navbar";
import { Store } from "@/components/Store";
import { MarketTicker } from "@/components/MarketTicker";
import { NewsSection } from "@/components/NewsSection";
import { motion } from "motion/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar />
      <MarketTicker />
      
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-16 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              WEB3 STORE
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-400 text-xl md:text-2xl max-w-2xl leading-relaxed"
          >
            A decentralized marketplace for digital assets. 
            Experience the future of commerce on the blockchain.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                Featured Products
              </h2>
              <div className="h-px flex-1 bg-white/10 ml-8 hidden md:block"></div>
            </div>
            <Store />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <NewsSection />
          </motion.aside>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>
    </main>
  );
}

