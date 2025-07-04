import { supabase } from "@/lib/supabase";

export async function sendMarketplaceMessage({
  listingId,
  buyerEmail,
  sellerEmail,
  message,
}: {
  listingId: string | number;
  buyerEmail: string;
  sellerEmail: string;
  message: string;
}): Promise<{ error?: string }> {
  // Store message in Supabase
  const { error } = await supabase.from("messages").insert([
    {
      listing_id: listingId,
      buyer_email: buyerEmail,
      seller_email: sellerEmail,
      message,
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) return { error: error.message };

  // Optionally, call edge/email function here if needed
  return {};
}
