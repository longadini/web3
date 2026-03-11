'use client';

import { Navbar } from '@/components/Navbar';
import { Chat } from '@/components/Chat';
import { motion } from 'framer-motion';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Global Trollbox</h1>
          <p className="text-zinc-400">Chat live with other connected users. Your display name is fetched from your profile.</p>
        </motion.div>
        <Chat />
      </main>
    </div>
  );
}
