import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  suggestions: string[];
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onSuggestionClick: (s: string) => void;
}

export function SearchBar({ suggestions, value, onChange, onSearch, onSuggestionClick }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative w-full max-w-xl">
      <div className={cn(
        "flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow border border-zinc-200 dark:border-zinc-800 px-4 py-2",
        focused && "ring-2 ring-blue-400"
      )}>
        <Input
          placeholder="Search listings, categories, or locations..."
          className="flex-1 bg-transparent border-none outline-none shadow-none text-base"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
        />
        <Button onClick={onSearch} className="rounded-xl px-5 py-2 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-fuchsia-600">Search</Button>
      </div>
      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 z-10 overflow-hidden animate-fade-in">
          {suggestions.map((s, idx) => (
            <div
              key={s + '-' + idx}
              className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer text-zinc-700 dark:text-zinc-200 text-sm"
              onMouseDown={() => onSuggestionClick(s)}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
