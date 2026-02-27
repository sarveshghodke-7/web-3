import { LayoutDashboard, Activity, TrendingUp, Settings } from "lucide-react";

export type TabType = "dashboard" | "activity" | "trending" | "settings";

interface SidebarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

const TABS: { icon: any; id: TabType }[] = [
  { icon: LayoutDashboard, id: "dashboard" },
  { icon: Activity, id: "activity" },
  { icon: TrendingUp, id: "trending" },
  { icon: Settings, id: "settings" },
];

export default function Sidebar({ activeTab, onChangeTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#151619] border-r border-[#141414] flex flex-col items-center py-8 gap-8 z-50">
      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-emerald-500/20">
        N
      </div>

      <nav className="flex flex-col gap-4">
        {TABS.map(({ icon: Icon, id }) => (
          <button
            key={id}
            onClick={() => onChangeTab(id)}
            className={`p-3 rounded-xl transition-all ${
              activeTab === id
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-zinc-600 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={20} />
          </button>
        ))}
      </nav>
    </aside>
  );
}