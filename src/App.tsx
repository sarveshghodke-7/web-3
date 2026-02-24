/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Search, 
  Star, 
  Trash2, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  LayoutDashboard,
  Activity,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const queryClient = new QueryClient();

// --- Types ---
interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  sparkline_in_7d?: { price: number[] };
}

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
}

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-[#151619] border border-[#141414] rounded-xl overflow-hidden", className)}>
    {children}
  </div>
);

const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[#141414] rounded-lg border border-white/5">
        <Icon size={20} className="text-emerald-400" />
      </div>
      <div className={cn(
        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
        change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
      )}>
        {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(change).toFixed(2)}%
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">{title}</p>
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
    </div>
  </Card>
);

const MarketTable = ({ coins, onAddToWatchlist, watchlistIds }: { coins: Coin[], onAddToWatchlist: (coin: Coin) => void, watchlistIds: string[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-[#141414]">
          <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
          <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Price</th>
          <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">24h Change</th>
          <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Market Cap</th>
          <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#141414]">
        {coins.map((coin) => (
          <motion.tr 
            key={coin.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hover:bg-white/[0.02] transition-colors group"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                  {coin.symbol.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white">{coin.name}</div>
                  <div className="text-xs text-zinc-500 uppercase">{coin.symbol}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 font-mono text-sm text-white">
              ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-4">
              <div className={cn(
                "flex items-center text-sm font-medium",
                coin.price_change_percentage_24h >= 0 ? "text-emerald-400" : "text-red-400"
              )}>
                {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </td>
            <td className="px-6 py-4 font-mono text-sm text-zinc-400">
              ${(coin.market_cap / 1e9).toFixed(2)}B
            </td>
            <td className="px-6 py-4 text-right">
              <button 
                onClick={() => onAddToWatchlist(coin)}
                disabled={watchlistIds.includes(coin.id)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  watchlistIds.includes(coin.id) 
                    ? "text-emerald-400 bg-emerald-400/10" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {watchlistIds.includes(coin.id) ? <ShieldCheck size={18} /> : <Plus size={18} />}
              </button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

const WatchlistSidebar = ({ items, onRemove }: { items: WatchlistItem[], onRemove: (id: string) => void }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-2">
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
        <Star size={14} className="text-emerald-400" />
        Watchlist
      </h3>
      <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
        {items.length}
      </span>
    </div>
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="group flex items-center justify-between p-3 bg-[#151619] border border-[#141414] rounded-lg hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                {item.symbol.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white">{item.name}</span>
            </div>
            <button 
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-600">No assets tracked</p>
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

function Dashboard() {
  const queryClient = useQueryClient();
  const [walletConnected, setWalletConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Market Data
  const { data: coins = [], isLoading: coinsLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: true
        }
      });
      return res.data as Coin[];
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  // Fetch Watchlist from JSON Backend
  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      // GLITCH 2: Misspelled endpoint
      const res = await axios.get('/api/watch-list');
      return res.data as WatchlistItem[];
    }
  });

  // Mutations
  const addToWatchlist = useMutation({
    mutationFn: (coin: Coin) => axios.post('/api/watchlist', { 
      item: { id: coin.id, symbol: coin.symbol, name: coin.name } 
    }),
    // GLITCH 3: Removed onSuccess invalidation, UI won't update automatically
  });

  const removeFromWatchlist = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/watchlist/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] })
  });

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchlistIds = watchlist.map(i => i.id);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#151619] border-r border-[#141414] flex flex-col items-center py-8 gap-8 z-50">
        {/* GLITCH 4: Sidebar width increased to 64 but main content margin left remains 20, causing overlap */}
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
          N
        </div>
        <nav className="flex flex-col gap-4">
          {[LayoutDashboard, Activity, TrendingUp, Settings].map((Icon, i) => (
            <button key={i} className={cn(
              "p-3 rounded-xl transition-all",
              i === 0 ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-600 hover:text-white hover:bg-white/5"
            )}>
              <Icon size={20} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pl-20">
        {/* Header */}
        <header className="h-20 border-b border-[#141414] flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white tracking-tight">Nexus Terminal</h1>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Mainnet Connected
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#151619] border border-[#141414] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-64"
              />
            </div>
            <button 
              onClick={() => setWalletConnected(!walletConnected)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                walletConnected 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-white text-black hover:bg-zinc-200"
              )}
            >
              <Wallet size={16} />
              {walletConnected ? "0x71C...3E2" : "Connect Wallet"}
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
          {/* Stats Row */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Global Market Cap" 
              value="$2.48T" 
              change={2.4} 
              icon={TrendingUp} 
            />
            <StatCard 
              title="24h Volume" 
              value="$84.2B" 
              change={-1.2} 
              icon={Activity} 
            />
            <StatCard 
              title="BTC Dominance" 
              value="52.4%" 
              change={0.8} 
              icon={ShieldCheck} 
            />
          </div>

          {/* Market Overview */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card>
              <div className="p-6 border-b border-[#141414] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Market Overview</h2>
                <div className="flex gap-2">
                  {['1H', '1D', '1W', '1M'].map((t) => (
                    <button key={t} className={cn(
                      "px-3 py-1 rounded text-[10px] font-bold transition-all",
                      t === '1D' ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500 hover:text-white"
                    )}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[300px] p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={coins[0]?.sparkline_in_7d?.price.map((p, i) => ({ time: i, price: p })) || []}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#141414" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151619', border: '1px solid #141414', borderRadius: '8px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6 border-b border-[#141414]">
                <h2 className="text-lg font-bold text-white">Top Assets</h2>
              </div>
              <MarketTable 
                coins={filteredCoins} 
                onAddToWatchlist={(c) => addToWatchlist.mutate(c)}
                watchlistIds={watchlistIds}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <WatchlistSidebar 
              items={watchlist} 
              onRemove={(id) => removeFromWatchlist.mutate(id)} 
            />
            
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <h3 className="text-white font-bold mb-2">Security Score</h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                Your wallet security score is based on active permissions and contract interactions.
              </p>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-white">92</span>
                <span className="text-emerald-400 text-sm font-bold mb-1">/ 100</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  className="bg-emerald-500 h-full"
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
