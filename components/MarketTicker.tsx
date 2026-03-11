'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export function MarketTicker() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setCoins(data);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (coins.length > 0 && tickerRef.current) {
      const ticker = tickerRef.current;
      const scrollWidth = ticker.scrollWidth;
      
      // Kill any existing animations
      gsap.killTweensOf(ticker);
      
      gsap.to(ticker, {
        x: -scrollWidth / 2,
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    }
  }, [coins]);

  if (coins.length === 0) return (
    <div className="w-full bg-zinc-900/50 border-y border-white/5 py-2 animate-pulse">
      <div className="flex gap-8 px-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-4 w-32 bg-zinc-800 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Duplicate coins for seamless loop
  const displayCoins = [...coins, ...coins];

  return (
    <div className="w-full bg-zinc-900/50 border-y border-white/5 overflow-hidden py-2 backdrop-blur-sm">
      <div ref={tickerRef} className="flex whitespace-nowrap gap-8 items-center w-max">
        {displayCoins.map((coin, idx) => (
          <div key={`${coin.id}-${idx}`} className="flex items-center gap-3 px-4">
            <span className="text-xs font-mono text-zinc-500 uppercase">{coin.symbol}</span>
            <span className="text-sm font-medium text-white">
              ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center gap-1 text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
