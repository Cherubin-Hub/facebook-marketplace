import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  location: string;
  time: string;
  onClick?: () => void;
}

export function ProductCard({ title, price, image, location, time, onClick }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-4 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl cursor-pointer flex flex-col gap-2",
        "hover:bg-white/90 dark:hover:bg-zinc-900/90"
      )}
      onClick={onClick}
      style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
    >
      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{price}</div>
        <div className="text-base font-medium text-zinc-700 dark:text-zinc-200 truncate">{title}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{time} • {location}</div>
      </div>
      <Button variant="secondary" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">View Details</Button>
    </div>
  );
}
