// src/lib/recommendations.ts

export interface Product {
  id?: string;
  sellerId?: string;
  title: string;
  price: string;
  image: string;
  location: string;
  time: string;
  category: string;
  inStock: boolean;
  discontinued?: boolean;
  rating: number;
  trending?: boolean;
  description?: string;
  email?: string;
}

export interface UserActivity {
  purchaseHistory: string[]; // product titles
  browsingCategories: string[];
  wishlist: string[]; // product titles
  categoryAffinity: Record<string, number>; // category -> score
}

export function getTopPicks(
  products: Product[],
  user: UserActivity,
  max = 6
): Product[] {
  // 1. Filter out out-of-stock, discontinued, or low-rated products
  const filtered = products.filter(
    (p) => p.inStock && !p.discontinued && p.rating >= 3.5
  );

  // 2. Score products based on user activity
  const scored = filtered.map((p) => {
    let score = 0;
    if (user.purchaseHistory.includes(p.title)) score += 10;
    if (user.wishlist.includes(p.title)) score += 8;
    if (user.browsingCategories.includes(p.category)) score += 5;
    score += (user.categoryAffinity[p.category] || 0) * 2;
    score += p.rating; // favor higher rated
    if (p.trending) score += 2;
    return { ...p, _score: score };
  });

  // 3. Sort by score, then by rating
  scored.sort((a, b) => b._score - a._score || b.rating - a.rating);

  // 4. Ensure diverse categories
  const picks: Product[] = [];
  const usedCategories = new Set<string>();
  for (const p of scored) {
    if (p.category && !usedCategories.has(p.category)) {
      picks.push(p);
      usedCategories.add(p.category);
      if (picks.length === max) break;
    }
  }

  // 5. Fallback: fill remaining slots with unique products (no duplicates)
  if (picks.length < max) {
    const fallback = filtered
      .filter((p) => !picks.some(pk => pk.title === p.title && pk.category === p.category))
      .sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.rating - a.rating)
      .slice(0, max - picks.length);
    picks.push(...fallback);
  }

  // Ensure no duplicates in the final picks
  const unique = picks.filter((p, idx, arr) =>
    arr.findIndex(x => x.title === p.title && x.category === p.category) === idx
  );
  return unique.slice(0, max);
}
