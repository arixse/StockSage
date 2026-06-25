"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  variant?: "default" | "outline";
  className?: string;
}

export function CheckoutButton({ variant = "default", className }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=pricing");
        return;
      }

      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        const msg = json.detail || json.error || "Checkout failed";
        const hint = json.hint || "";
        toast.error(hint ? `${msg}\n${hint}` : msg, { duration: 8000 });
      }
    } catch {
      toast.error("Failed to start checkout. Check your connection.");
    }
    setLoading(false);
  };

  return (
    <Button variant={variant} className={className} onClick={handleCheckout} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      Upgrade to Pro
    </Button>
  );
}
