"use client";

import { useState } from "react";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { duplicateTemplate } from "@/app/actions/admin";

export function DuplicateTemplateButton({ templateId }: { templateId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async () => {
    setLoading(true);
    const res = await duplicateTemplate(templateId);
    setLoading(false);
    if (res?.error) {
      alert("Error: " + res.error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      disabled={loading}
      onClick={handleDuplicate}
      className="h-8 w-8 text-slate-500 hover:text-[#252D65] hover:bg-slate-100 rounded-lg transition-colors"
      title="Duplicate Template"
    >
      {loading ? <Loader2 size={16} className="animate-spin text-slate-400" /> : <Copy size={16} />}
    </Button>
  );
}
