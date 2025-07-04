"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MessageSentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full p-0 rounded-2xl shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl animate-fade-in animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight text-center mt-4">Message Sent</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-6 pt-2 text-center">
          <div className="text-green-600 text-lg font-semibold mt-2">Message sent successfully!</div>
          <div className="text-zinc-700 dark:text-zinc-200 text-base">The seller will receive an email notification.</div>
          <div className="flex justify-center mt-6">
            <Button className="rounded-2xl font-semibold px-8 py-3 text-base text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2" onClick={() => onOpenChange(false)} autoFocus>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
