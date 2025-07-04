"use client";
import { useState } from "react";
import Image from "next/image"; // Added import for next/image

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories: string[] = [
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

export function CreateListingPopup({ children, onCreated }: { children: React.ReactNode; onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB");
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    let photoUrl = "";
    try {
      if (photo) {
        const { data, error: uploadError } = await supabase.storage
          .from("listings")
          .upload(`photos/${Date.now()}-${photo.name}`, photo);
        if (uploadError) throw uploadError;
        photoUrl = supabase.storage.from("listings").getPublicUrl(data.path).data.publicUrl;
      }
      const { error: insertError } = await supabase.from("listings").insert([
        {
          title,
          category,
          price: parseFloat(price),
          location,
          email,
          description,
          photo: photoUrl,
        },
      ]);
      if (insertError) throw insertError;
      setSuccess(true);
      setTitle("");
      setCategory("");
      setPrice("");
      setLocation("");
      setEmail("");
      setDescription("");
      setPhoto(null);
      setPreview("");
      if (onCreated) onCreated();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create listing";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90vw] w-full p-0 min-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">Create New Listing</DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-8 w-full p-6 pt-2">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 max-w-md">
            <div>
              <label className="block font-semibold mb-1">Photos</label>
              <div className="border-2 border-dashed border-zinc-300 rounded-lg h-36 flex items-center justify-center bg-zinc-50 mb-2 relative">
                {preview ? (
                  <Image src={preview} alt="Preview" className="object-contain" fill style={{ objectFit: "contain" }} />
                ) : (
                  <>
                    <span className="text-3xl text-zinc-400 mb-2">&#8682;</span>
                    <span className="text-zinc-500">Add photos</span>
                    <span className="text-xs text-zinc-400">JPEG, PNG, or WebP (max 5MB)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                  onChange={handlePhotoChange}
                  required
                />
              </div>
            </div>
            <Input placeholder="What are you selling?" value={title} onChange={e => setTitle(e.target.value)} required />
            <select
              className="border rounded px-3 py-2 text-sm"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Input type="number" min="0" step="0.01" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
            <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <textarea
              className="border rounded px-3 py-2 text-sm min-h-[80px]"
              placeholder="Describe your item..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Creating..." : "Create Listing"}
            </Button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mt-2">Listing created!</div>}
          </form>

          {/* Preview Panel */}
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col gap-4 min-w-[320px]">
            <h2 className="font-bold text-lg mb-2">Preview</h2>
            <div className="border rounded-lg h-36 bg-[repeating-linear-gradient(135deg,#e5e7eb_0_8px,#fff_8px_16px)] flex items-center justify-center mb-4 relative">
              {preview && (
                <Image src={preview} alt="Preview" fill style={{ objectFit: "contain" }} />
              )}
            </div>
            <div className="font-bold text-lg">Title: {title}</div>
            <div className="font-bold text-lg">Category: {category}</div>
            <div className="font-bold text-lg">Price: {price ? `$${price}` : ""}</div>
            <div className="font-bold text-lg">Location: {location}</div>
            <div className="font-bold text-lg">Email: {email}</div>
            <div className="font-bold text-lg mt-2 whitespace-pre-line">Description: {description}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}