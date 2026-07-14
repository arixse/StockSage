import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CDN cache headers for static & ISR pages — improves CDN hit rate.
  // ISR pages (/, /stock/[ticker]) already emit proper Cache-Control from
  // their `revalidate` export; these rules act as a safety net for truly
  // static pages that don't set their own revalidate.
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
      {
        source: "/stock/:ticker",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
      {
        source:
          "/:path((?!api|dashboard|watchlist|heat|settings|newsletter|callback|position-size-calculator|login|register).+)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
