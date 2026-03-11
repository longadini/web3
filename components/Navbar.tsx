'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'motion/react';
import { LayoutDashboard, User, ShoppingBag } from 'lucide-react';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">WEB3 STORE</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <LayoutDashboard size={16} />
            Marketplace
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <User size={16} />
            My Assets
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </motion.nav>
  );
}

