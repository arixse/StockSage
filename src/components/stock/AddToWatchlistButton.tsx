"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Star, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  ticker: string;
}

export function AddToWatchlistButton({ ticker }: Props) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [toggling, setToggling] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id });
        // Check if this ticker is already in user's watchlist
        checkWatchlist(data.user.id);
      } else {
        setLoading(false);
      }
    });
  }, [ticker]);

  const checkWatchlist = async (userId: string) => {
    try {
      const { data: watchlists } = await supabase
        .from("watchlists")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      if (watchlists?.[0]) {
        const { data: items } = await supabase
          .from("watchlist_items")
          .select("ticker")
          .eq("watchlist_id", watchlists[0].id)
          .eq("ticker", ticker.toUpperCase());

        setInWatchlist(!!items?.length);
      }
    } catch {
      // silent
    }
    setLoading(false);
  };

  const handleToggle = useCallback(async () => {
    if (!user) return;
    setToggling(true);

    try {
      if (inWatchlist) {
        // Remove from watchlist
        const { data: watchlists } = await supabase
          .from("watchlists")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (watchlists?.[0]) {
          const res = await fetch(`/api/watchlists/${watchlists[0].id}/stocks/${ticker.toUpperCase()}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setInWatchlist(false);
            toast.success(`${ticker} removed from watchlist`);
            router.refresh();
          }
        }
      } else {
        // Add to watchlist — find or create watchlist
        const { data: watchlists } = await supabase
          .from("watchlists")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        let watchlistId = watchlists?.[0]?.id;

        if (!watchlistId) {
          const createRes = await fetch("/api/watchlists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "My Watchlist" }),
          });
          const createJson = await createRes.json();
          watchlistId = createJson.data?.id;
        }

        if (watchlistId) {
          const res = await fetch(`/api/watchlists/${watchlistId}/stocks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticker: ticker.toUpperCase() }),
          });

          if (res.ok) {
            setInWatchlist(true);
            toast.success(`${ticker} added to watchlist`);
            router.refresh();
          } else if (res.status === 402) {
            const body = await res.json();
            toast.error(body.error || "Tier limit reached", {
              action: { label: "Upgrade", onClick: () => router.push("/pricing") },
            });
          } else {
            toast.error(`Failed to add ${ticker}`);
          }
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
    setToggling(false);
  }, [user, inWatchlist, ticker, router, supabase]);

  // Not logged in — don't show the button
  if (!loading && !user) return null;

  // Loading auth state
  if (loading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={inWatchlist ? "default" : "outline"}
      size="icon"
      onClick={handleToggle}
      disabled={toggling}
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {toggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : inWatchlist ? (
        <Check className="h-4 w-4" />
      ) : (
        <Star className="h-4 w-4" />
      )}
    </Button>
  );
}
