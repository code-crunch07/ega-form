"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck } from "lucide-react";

export function MarkAllReadButton() {
  const [marked, setMarked] = useState(false);

  const handleMarkAll = () => {
    setMarked(true);
    // Find all unread elements or notifications on the page and visual mark
    const notificationBadges = document.querySelectorAll(".notification-unread-indicator");
    notificationBadges.forEach(el => el.classList.add("hidden"));
    
    // Trigger storage event so layout badge clears if needed
    window.dispatchEvent(new Event("notifications_cleared"));
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleMarkAll}
      disabled={marked}
      className={`text-xs rounded-xl h-9 border-slate-200 gap-1.5 font-bold transition-all ${
        marked 
          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
          : "text-slate-700 hover:text-[#252D65] hover:bg-slate-50"
      }`}
    >
      {marked ? (
        <>
          <CheckCheck size={15} className="text-emerald-600" />
          <span>All Caught Up</span>
        </>
      ) : (
        <>
          <Check size={14} className="text-slate-400" />
          <span>Mark all as read</span>
        </>
      )}
    </Button>
  );
}
