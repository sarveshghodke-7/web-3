import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "./Card";

export const StatCard = ({ title, value, change, icon: Icon }: any) => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-[#141414] rounded-lg border border-white/5">
        <Icon size={20} className="text-emerald-400" />
      </div>
      <div
        className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
          change >= 0
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {change >= 0 ? (
          <ArrowUpRight size={14} />
        ) : (
          <ArrowDownRight size={14} />
        )}
        {Math.abs(change).toFixed(2)}%
      </div>
    </div>

    <div className="space-y-1">
      <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-white tracking-tight">
        {value}
      </h3>
    </div>
  </Card>
);