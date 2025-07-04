"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSellerDialog } from "@/components/message-seller-dialog";
import { MessageSentDialog } from "@/components/message-sent-dialog";

// Icon SVGs
function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s8-7.58 8-12A8 8 0 1 0 4 9c0 4.42 8 12 8 12z" />
      <circle cx="12" cy="9" r="3" />
    </svg>
  );
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="4" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id?: number | string;
    sellerId?: string;
    title: string;
    price: string;
    image: string;
    location: string;
    time: string;
    description: string;
    email: string;
    buyerId?: string;
  } | null;
}

export function ProductDetailsModal({ open, onOpenChange, product }: ProductDetailsModalProps) {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageSentOpen, setMessageSentOpen] = useState(false);
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl w-full p-0 rounded-3xl shadow-2xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl animate-fade-in animate-scale-in"
        showCloseButton={true}
      >
        {/* DialogTitle for accessibility */}
        <DialogHeader>
          <DialogTitle className="sr-only">{product.title}</DialogTitle>
        </DialogHeader>
        {/* Large image below header, with space for close button */}
        <div className="w-full h-64 md:h-96 rounded-t-3xl overflow-hidden bg-white-200 shadow-inner flex items-center justify-center relative mt-6">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover rounded-b-3xl"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div className="flex flex-col gap-4 p-8">
          {/* Title and price */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{product.title}</h2>
            <div className="text-xl font-semibold text-blue-700 dark:text-blue-300 bg-white/60 dark:bg-zinc-800/60 px-4 py-2 rounded-xl shadow-sm glassmorphism">{product.price}</div>
          </div>
          {/* Description */}
          <div className="text-zinc-800 dark:text-zinc-100 text-base whitespace-pre-line mb-2">
            {product.description}
          </div>
          {/* Info row: location, date, seller */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <LocationIcon className="w-5 h-5 text-blue-500" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <CalendarIcon className="w-5 h-5 text-fuchsia-500" />
              <span>{product.time}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <MailIcon className="w-5 h-5 text-green-500" />
              <span className="font-semibold break-all">{product.email}</span>
            </div>
          </div>
          {/* Message Seller button */}
          <div className="flex justify-end mt-2">
            <Button
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
              type="button"
              onClick={() => setMessageDialogOpen(true)}
            >
              Message Seller
            </Button>
          </div>
          {/* Message Seller Dialog */}
          <MessageSellerDialog
            open={messageDialogOpen}
            onOpenChange={setMessageDialogOpen}
            sellerEmail={product.email}
            subject={"Regarding: " + product.title}
            body={"Hi, I'm interested in your listing for '" + product.title + "'."}
            sellerId={product.sellerId ?? ""}
            itemId={
              product.id !== undefined && product.id !== null
                ? typeof product.id === 'string'
                  ? product.id.match(/^\d+$/)
                    ? product.id
                    : ''
                  : typeof product.id === 'number'
                    ? String(product.id)
                    : ''
                : ''
            }
            buyerId={product.buyerId ?? ""}
            onMessageSent={() => {
              setMessageDialogOpen(false);
              setTimeout(() => setMessageSentOpen(true), 200);
            }}
          />
          <MessageSentDialog open={messageSentOpen} onOpenChange={setMessageSentOpen} />
        </div>
        {/* Glassmorphism helper class */}
        <style jsx global>{`
          .glassmorphism {
            backdrop-filter: blur(8px);
            background: rgba(255,255,255,0.5);
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scale-in {
            from { transform: scale(0.96); }
            to { transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.25s cubic-bezier(.4,0,.2,1);
          }
          .animate-scale-in {
            animation: scale-in 0.25s cubic-bezier(.4,0,.2,1);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
