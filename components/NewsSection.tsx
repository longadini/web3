'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Conceptual implementation: Replace with real API call
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Placeholder: Replace with actual API call (e.g., Google Search API)
        // const response = await fetch('/api/search?q=web3+news');
        // const data = await response.json();
        
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNews([
          { title: 'Web3 Adoption Reaches New Highs', source: 'CryptoDaily' },
          { title: 'New ZK-Rollup Protocol Launches', source: 'TechCrunch' },
          { title: 'DAO Governance Trends in 2026', source: 'Web3Weekly' },
        ]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news.');
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/50">
      <h2 className="text-2xl font-bold mb-4">Real-Time Web3 News</h2>
      {loading && <p className="text-zinc-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <AnimatePresence>
        {!loading && !error && (
          <motion.ul className="space-y-4">
            {news.map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 bg-zinc-800 rounded-xl"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.source}</p>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
