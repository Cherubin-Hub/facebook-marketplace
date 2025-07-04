

"use client";
// import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
// Custom hook to get current user ID from Supabase Auth
function useCurrentUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  return userId;
}
import { supabase } from "@/lib/supabase";
import { CategoryFilter } from "@/components/category-filter";
import { ProductCard } from "@/components/product-card";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { SearchBar } from "@/components/search-bar";
import { getTopPicks, Product as ProductType, UserActivity } from "@/lib/recommendations";
import { CreateListingPopup } from "@/components/create-listing-popup";

const categories = [
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups",
];

// Listings state, fetched from Supabase
const initialProducts: ProductType[] = [];

// Icon SVGs
function EnvelopeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 16v-5a6 6 0 10-12 0v5" />
      <path d="M5 16h14" />
      <path d="M9 20h6" />
    </svg>
  );
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function Home() {
  // State for selected category, search, suggestions, and products
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  // Removed unused loadingProducts state to fix lint error
  const [detailsOpen, setDetailsOpen] = useState(false);
  // Use ProductType | null instead of any
  // Use a type that matches ProductDetailsModalProps
  type ProductDetailsType = {
    id?: string | number;
    sellerId?: string;
    title: string;
    price: string;
    image: string;
    location: string;
    time: string;
    description: string;
    email: string;
    buyerId?: string;
  };
  const [detailsProduct, setDetailsProduct] = useState<ProductDetailsType | null>(null);
  const userId = useCurrentUserId();

  // Simulate user activity (replace with real user data in production)
  const user: UserActivity = {
    purchaseHistory: ["Modern Sofa"],
    browsingCategories: ["Electronics", "Home Goods"],
    wishlist: ["Acoustic Guitar", "Designer Lamp"],
    categoryAffinity: { "Electronics": 3, "Home Goods": 2, "Musical Instruments": 1 },
  };

  // Fetch listings from Supabase
  async function fetchListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setProducts(
        data.map((item: Record<string, unknown>) => ({
          id: String(item.id),
          sellerId: item.seller_id as string,
          title: item.title as string,
          price: item.price ? `$${item.price}` : "",
          image: (item.photo as string) || "https://placehold.co/400x300?text=No+Image",
          location: (item.location as string) || "",
          time: item.created_at ? new Date(item.created_at as string).toLocaleString() : "Just now",
          category: (item.category as string) || "",
          inStock: true,
          discontinued: false,
          rating: 4.5, // Default or fetch from DB if available
          trending: false,
          description: (item.description as string) || "",
          email: (item.email as string) || "",
        }))
      );
    }
  }

  useEffect(() => {
    fetchListings();
  }, []);

  // Top Picks logic
  const topPicks = useMemo(() => {
    let picks = getTopPicks(products, user, 6);
    if (selectedCategory) {
      picks = picks.filter((p) => p.category === selectedCategory);
    }
    if (search) {
      picks = picks.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    return picks;
  }, [products, user, selectedCategory, search]);

  // Simulate real-time search suggestions
  function handleSearchChange(val: string) {
    setSearch(val);
    if (val.length > 0) {
      setSuggestions(
        products
          .map((p) => p.title)
          .filter((t) => t.toLowerCase().includes(val.toLowerCase()))
          .slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  }

  function handleSuggestionClick(s: string) {
    setSearch(s);
    setSuggestions([]);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-fuchsia-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="w-full h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-8 justify-between shadow-sm">
        <button
          className="flex items-center gap-2 group focus:outline-none"
          onClick={() => window.location.reload()}
          aria-label="Refresh page"
        >
          <div className="bg-gradient-to-br from-blue-500 to-fuchsia-500 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">F</div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-500 to-fuchsia-500 bg-clip-text text-transparent group-hover:underline">Marketplace Demo</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-end">
          <button
            type="button"
            className="rounded-full p-2 bg-white shadow-md hover:bg-blue-50 hover:shadow-lg transition-all border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Messages"
          >
            <EnvelopeIcon className="w-6 h-6 text-zinc-500" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 bg-white shadow-md hover:bg-blue-50 hover:shadow-lg transition-all border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6 text-zinc-500" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 bg-white shadow-md hover:bg-blue-50 hover:shadow-lg transition-all border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Profile"
          >
            <UserIcon className="w-6 h-6 text-zinc-500" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 flex-col p-6 gap-8 min-h-full shadow-sm">
          <nav className="flex flex-col gap-2 text-sm">
            <CreateListingPopup onCreated={fetchListings}>
              <button
                className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2 text-left hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition"
                type="button"
              >
                Create new listing
              </button>
            </CreateListingPopup>
            <ul className="flex flex-col gap-1 mb-4">
              <li className="pl-4 py-1 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors">Choose listing type</li>
              <li className="pl-4 py-1 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors">Your listings</li>
              <li className="pl-4 py-1 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors">Seller help</li>
            </ul>
            <span className="font-semibold text-zinc-700 dark:text-zinc-200 mb-2">Categories</span>
            <ul className="flex flex-col gap-1">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`pl-4 py-1 rounded cursor-pointer transition-colors ${cat === selectedCategory ? "bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow" : "text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-800"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-10 gap-4">
          <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Today's Picks</h2>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory ?? ""}
            onSelect={setSelectedCategory}
          />
          <SearchBar
            suggestions={suggestions}
            value={search}
            onChange={handleSearchChange}
            onSearch={() => {}}
            onSuggestionClick={handleSuggestionClick}
          />
          <section className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {topPicks.map((p, i) => (
                <ProductCard
                  key={i}
                  {...p}
                  onClick={() => {
                    // Find the full product info from products[] (which has DB fields)
                    const full = products.find(prod => prod.title === p.title && prod.category === p.category);
                  setDetailsProduct({
                    ...p,
                    // Ensure id is a string
                    id: String(full?.id),
                    sellerId: full?.sellerId,
                    description: (full?.description as string) || "No description available.",
                    email: full?.email || "seller@email.com",
                    buyerId: userId ?? undefined,
                  });
                    setDetailsOpen(true);
                  }}
                />
              ))}
              {topPicks.length === 0 && (
                <div className="col-span-full text-center text-zinc-500 py-12">No products found.</div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        product={detailsProduct}
      />

      {/* Footer */}
      <footer className="w-full h-14 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-400 shadow-inner">
        © {new Date().getFullYear()} Marketplace. All rights reserved.
      </footer>
    </div>
  );
}
