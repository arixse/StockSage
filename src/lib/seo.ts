/**
 * Shared SEO helpers.
 *
 * Next.js does NOT deep-merge the `openGraph` / `twitter` metadata objects — a
 * page that exports its own `openGraph` REPLACES the root layout's entirely.
 * That silently drops `og:type`, `og:url`, `og:site_name`, `og:image`, etc.
 * These builders guarantee every page emits a complete Open Graph / Twitter set.
 */

export const SITE_NAME = "StockSage";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Build an absolute OG image URL. Params are safely URL-encoded. */
export function ogImage(params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return `${APP_URL}/api/og`;
  const qs = new URLSearchParams(params).toString();
  return `${APP_URL}/api/og?${qs}`;
}

interface OpenGraphInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/stock/AAPL". Resolved to an absolute canonical URL. */
  path: string;
  type?: "website" | "article";
  /** Full image URL. Defaults to the branded OG image. */
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/** Complete Open Graph object — always includes url, siteName, locale, type, image. */
export function buildOpenGraph(input: OpenGraphInput) {
  const image = input.image ?? ogImage();
  return {
    title: input.title,
    description: input.description,
    url: `${APP_URL}${input.path}`,
    siteName: SITE_NAME,
    locale: "en_US",
    type: input.type ?? "website",
    ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: input.imageAlt ?? input.title,
      },
    ],
  };
}

/** Complete Twitter card object. */
export function buildTwitter(input: {
  title: string;
  description: string;
  image?: string;
}) {
  return {
    card: "summary_large_image" as const,
    title: input.title,
    description: input.description,
    images: [input.image ?? ogImage()],
  };
}

/** Clamp a description to a SERP-safe length (<=155 chars) on a word boundary. */
export function clampDescription(text: string, max = 155): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}
