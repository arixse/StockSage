/**
 * US Stock Market status checker — NYSE/NASDAQ hours in Eastern Time.
 * Works on server (Vercel UTC) and client.
 */

export type MarketStatus = "open" | "pre-market" | "after-hours" | "closed";

export interface MarketStatusInfo {
  status: MarketStatus;
  label: string;
  color: string;
  sublabel: string;
}

/** Get current Eastern Time date components reliably (works server + client) */
function getETParts(): { day: number; hours: number; minutes: number; timeInMinutes: number } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const weekday = get("weekday"); // "Mon", "Tue", etc.
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const day = dayMap[weekday] ?? 1;
  const hours = parseInt(get("hour")) || 0;
  const minutes = parseInt(get("minute")) || 0;
  const timeInMinutes = hours * 60 + minutes;

  return { day, hours, minutes, timeInMinutes };
}

export function getMarketStatus(): MarketStatusInfo {
  const { day, timeInMinutes } = getETParts();

  // Weekend
  if (day === 0 || day === 6) {
    return {
      status: "closed",
      label: "Closed",
      color: "text-muted-foreground",
      sublabel: "Markets reopen Monday",
    };
  }

  // Before pre-market (< 4:00 AM ET)
  if (timeInMinutes < 4 * 60) {
    return {
      status: "closed",
      label: "Closed",
      color: "text-muted-foreground",
      sublabel: "Pre-market at 4:00 AM ET",
    };
  }

  // Pre-market: 4:00 AM – 9:30 AM ET
  if (timeInMinutes < 9 * 60 + 30) {
    return {
      status: "pre-market",
      label: "Pre-Market",
      color: "text-amber-500",
      sublabel: "Opens 9:30 AM ET",
    };
  }

  // Regular hours: 9:30 AM – 4:00 PM ET
  if (timeInMinutes < 16 * 60) {
    return {
      status: "open",
      label: "Open",
      color: "text-green-500",
      sublabel: "Closes 4:00 PM ET",
    };
  }

  // After-hours: 4:00 PM – 8:00 PM ET
  if (timeInMinutes < 20 * 60) {
    return {
      status: "after-hours",
      label: "After Hours",
      color: "text-orange-500",
      sublabel: "Closed for the day",
    };
  }

  // After 8:00 PM ET
  return {
    status: "closed",
    label: "Closed",
    color: "text-muted-foreground",
    sublabel: day === 5 ? "Markets reopen Monday" : "Opens tomorrow 9:30 AM ET",
  };
}
