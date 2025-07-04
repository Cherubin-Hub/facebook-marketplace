import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          className={cn(
            "px-4 py-1.5 rounded-full font-medium text-sm border transition-all duration-150",
            selected === cat
              ? "bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-md border-transparent"
              : "bg-white/60 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 hover:text-blue-700"
          )}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
