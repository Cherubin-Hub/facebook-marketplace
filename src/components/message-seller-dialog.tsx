"use client";
import { useState } from "react";
import { sendMarketplaceMessage } from "@/lib/messages";
import { MessageSentDialog } from "@/components/message-sent-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

interface MessageSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerEmail: string;
  itemId?: string;
  subject?: string;
  body?: string;
  onMessageSent?: () => void;
}

export function MessageSellerDialog({ open, onOpenChange, sellerEmail, itemId = "", subject = "", body = "", onMessageSent }: MessageSellerDialogProps) {
  const [form, setForm] = useState({ email: "", subject, body });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSentDialog, setShowSentDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    // Only send if itemId is a valid number (for BIGINT FK)
    if (!itemId || isNaN(Number(itemId))) {
      setError("Invalid listing. Please try again.");
      setSending(false);
      return;
    }
    // Simulate sending for UI micro-interaction
    setTimeout(async () => {
      const { error } = await sendMarketplaceMessage({
        listingId: Number(itemId),
        buyerEmail: form.email,
        sellerEmail: sellerEmail,
        message: form.body,
      });
      setSending(false);
      if (error) {
        setError(error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onOpenChange(false); // Close compose dialog
          if (onMessageSent) {
            onMessageSent();
          } else {
            setShowSentDialog(true);
          }
        }, 1200);
      }
    }, 400);
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setError(null);
      setForm({ email: "", subject, body });
    }
    onOpenChange(open);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-sm w-full p-0 rounded-2xl shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl animate-fade-in animate-scale-in">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight text-center mt-4">Message Seller</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-5 p-6 pt-2" onSubmit={handleSend}>
            <FloatingLabelInput
              label="Your Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="you@email.com"
              autoFocus
            />
            <FloatingLabelInput
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={100}
            />
            <div className="relative">
              <label htmlFor="body" className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1 block">Message</label>
              <textarea
                id="body"
                name="body"
                className="w-full min-h-[100px] max-h-60 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 p-3 text-base text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:shadow-lg duration-200 resize-vertical"
                value={form.body}
                onChange={handleChange}
                required
                maxLength={1000}
                placeholder="Type your message..."
                style={{ transition: 'box-shadow 0.2s, border-color 0.2s' }}
              />
              {/* Micro-interaction: animated border on error */}
              {error && <span className="absolute right-2 top-2 text-xs text-red-500 animate-pulse">!</span>}
            </div>
            <div className="flex justify-end gap-2 mt-4 w-full">
              <Button
                type="submit"
                disabled={sending || success}
                className={`rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${success ? 'bg-green-500 hover:bg-green-600 focus:bg-green-600' : ''}`}
              >
                {success ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white animate-bounceIn" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Sent!
                  </span>
                ) : sending ? "Sending..." : "Send"}
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2 transition-all duration-200 animate-shake">{error}</div>}
          </form>
          <style jsx global>{`
            @keyframes bounceIn {
              0% { transform: scale(0.8); opacity: 0.5; }
              60% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-bounceIn {
              animation: bounceIn 0.4s cubic-bezier(.4,0,.2,1);
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-4px); }
              40%, 80% { transform: translateX(4px); }
            }
            .animate-shake {
              animation: shake 0.4s cubic-bezier(.4,0,.2,1);
            }
          `}</style>
        </DialogContent>
      </Dialog>
      <MessageSentDialog open={showSentDialog} onOpenChange={setShowSentDialog} />
    </>
  );
}
