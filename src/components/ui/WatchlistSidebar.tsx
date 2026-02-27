import { motion, AnimatePresence } from "motion/react";
import { Trash2 } from "lucide-react";
import { WatchlistItem } from "../../types/market";

export const WatchlistSidebar = ({
  items,
  onRemove,
}: {
  items: WatchlistItem[];
  onRemove: (id: string) => void;
}) => (
  <div className="space-y-4">
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-between p-3 bg-[#151619] rounded-lg"
        >
          <span>{item.name}</span>
          <button onClick={() => onRemove(item.id)}>
            <Trash2 size={14} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);