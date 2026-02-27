import React, { useState } from "react";
import { GainersLosersGrid, GainerLoser } from "../ui/GainersLosersGrid";
import { SectorHeatmap, Sector } from "../ui/SectorHeatmap";
import { TrendingTable, TrendingToken } from "../ui/TrendingTable";
import { Card } from "../ui/Card";
import { Filter } from "lucide-react";

// --- Mock Data ---

const MOCK_GAINERS: GainerLoser[] = [
    { id: "g1", symbol: "PEPE", name: "Pepe", price: 0.0000084, change: 24.5 },
    { id: "g2", symbol: "WIF", name: "dogwifhat", price: 2.84, change: 18.2 },
    { id: "g3", symbol: "RNDR", name: "Render", price: 10.45, change: 14.8 },
    { id: "g4", symbol: "FET", name: "Fetch.ai", price: 2.14, change: 12.1 },
    { id: "g5", symbol: "ONDO", name: "Ondo", price: 0.84, change: 10.5 },
];

const MOCK_LOSERS: GainerLoser[] = [
    { id: "l1", symbol: "TIA", name: "Celestia", price: 11.24, change: -8.4 },
    { id: "l2", symbol: "STRK", name: "Starknet", price: 1.45, change: -6.2 },
    { id: "l3", symbol: "DYM", name: "Dymension", price: 3.84, change: -5.1 },
    { id: "l4", symbol: "JUP", name: "Jupiter", price: 1.12, change: -4.8 },
    { id: "l5", symbol: "SEI", name: "Sei", price: 0.64, change: -4.2 },
];

const MOCK_SECTORS: Sector[] = [
    { id: "s1", name: "Layer 1s", marketCap: 1540000000000, change: 1.2 },
    { id: "s2", name: "DeFi", marketCap: 84000000000, change: 4.5 },
    { id: "s3", name: "AI", marketCap: 32000000000, change: 8.4 },
    { id: "s4", name: "Gaming", marketCap: 18000000000, change: -2.1 },
    { id: "s5", name: "Memes", marketCap: 54000000000, change: 12.4 },
    { id: "s6", name: "Layer 2s", marketCap: 42000000000, change: -1.4 },
];

const generateSparkline = (trend: "up" | "down" | "flat"): number[] => {
    let current = 100;
    return Array.from({ length: 20 }).map(() => {
        const change = (Math.random() - 0.5) * 10;
        const direction = trend === "up" ? 2 : trend === "down" ? -2 : 0;
        current = current + change + direction;
        return Math.max(0, current); // prevent negative prices
    });
};

const MOCK_TRENDING_TOKENS: TrendingToken[] = [
    { id: "t1", symbol: "SOL", name: "Solana", price: 145.20, volChange: 45.2, sentiment: 88, sparkline: generateSparkline("up") },
    { id: "t2", symbol: "DOGE", name: "Dogecoin", price: 0.154, volChange: 124.5, sentiment: 92, sparkline: generateSparkline("up") },
    { id: "t3", symbol: "LINK", name: "Chainlink", price: 18.40, volChange: 12.4, sentiment: 65, sparkline: generateSparkline("flat") },
    { id: "t4", symbol: "ARB", name: "Arbitrum", price: 1.15, volChange: -15.4, sentiment: 45, sparkline: generateSparkline("down") },
    { id: "t5", symbol: "AVAX", name: "Avalanche", price: 38.50, volChange: 5.2, sentiment: 58, sparkline: generateSparkline("up") },
    { id: "t6", symbol: "TON", name: "Toncoin", price: 6.80, volChange: 84.1, sentiment: 75, sparkline: generateSparkline("up") },
];

export const TrendingView = () => {
    const [sortField, setSortField] = useState<"volChange" | "sentiment">("volChange");

    const sortedTokens = [...MOCK_TRENDING_TOKENS].sort((a, b) => {
        return b[sortField] - a[sortField];
    });

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
            {/* Top Section: Gainers/Losers & Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[400px]">
                {/* Left: Gainers & Losers Grid */}
                <GainersLosersGrid gainers={MOCK_GAINERS} losers={MOCK_LOSERS} />

                {/* Right: Sector Heatmap */}
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white tracking-tight">Sector Heatmap</h2>
                    </div>
                    <div className="flex-1">
                        <SectorHeatmap sectors={MOCK_SECTORS} />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Trending Table */}
            <div className="flex flex-col gap-4 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Trending Assets</h2>
                        <p className="text-sm text-zinc-500 mt-1">Based on volume momentum and social sentiment</p>
                    </div>

                    <div className="flex bg-[#151619] p-1 rounded-lg border border-[#1A1B1E]">
                        <button
                            onClick={() => setSortField("volChange")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${sortField === "volChange"
                                    ? "bg-[#1A1B1E] text-white shadow-sm border border-[#2A2B2E]"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <Filter size={14} /> By Volume
                        </button>
                        <button
                            onClick={() => setSortField("sentiment")}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${sortField === "sentiment"
                                    ? "bg-[#1A1B1E] text-white shadow-sm border border-[#2A2B2E]"
                                    : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <Filter size={14} /> By Sentiment
                        </button>
                    </div>
                </div>

                <Card>
                    <TrendingTable tokens={sortedTokens} />
                </Card>
            </div>
        </div>
    );
};
