import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache headers for public pages — improves CDN hit rate and reduces server load
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path((?!api|dashboard|watchlist|heat|settings|newsletter|callback|position-size-calculator|login|register).+)",
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
