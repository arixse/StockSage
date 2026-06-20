import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");
    const price = searchParams.get("price");
    const change = searchParams.get("change");

    // Load Geist font from Google Fonts CDN for OG image
    const interRegular = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
    ).then((res) => res.arrayBuffer()).catch(() => null);

    const interBold = await fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2"
    ).then((res) => res.arrayBuffer()).catch(() => null);

    const isStockPage = !!ticker;
    const changeNum = change ? parseFloat(change) : null;
    const changeColor = changeNum == null ? "#6b7280" : changeNum >= 0 ? "#22c55e" : "#ef4444";

    const imageOptions: { width: number; height: number; fonts?: { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 700 }[] } = {
      width: 1200,
      height: 630,
    };
    if (interRegular && interBold) {
      imageOptions.fonts = [
        { name: "Inter", data: interRegular, style: "normal", weight: 400 },
        { name: "Inter", data: interBold, style: "normal", weight: 700 },
      ];
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0b",
            fontFamily: imageOptions.fonts ? "Inter" : "sans-serif",
            position: "relative",
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 60%)",
            }}
          />

          {/* Logo area */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isStockPage ? 48 : 32 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              📈
            </div>
            <span style={{ fontSize: 32, fontWeight: 700, color: "#fafafa" }}>StockSage</span>
          </div>

          {isStockPage ? (
            <>
              <div style={{ fontSize: 64, fontWeight: 800, color: "#fafafa", marginBottom: 16 }}>
                {ticker!.toUpperCase()}
              </div>
              {price && (
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, color: "#fafafa" }}>
                    ${parseFloat(price).toFixed(2)}
                  </span>
                  {change && (
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 600,
                        color: changeColor,
                        padding: "4px 16px",
                        borderRadius: 8,
                        backgroundColor: changeNum != null && changeNum >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      }}
                    >
                      {changeNum != null && changeNum >= 0 ? "+" : ""}
                      {change}
                    </span>
                  )}
                </div>
              )}
              <div style={{ fontSize: 20, color: "#6b7280", marginTop: 16 }}>
                AI-Powered Stock Analysis &amp; Scoring
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 48, fontWeight: 800, color: "#fafafa", marginBottom: 16 }}>
                Stock Analysis &amp; Radar
              </div>
              <div style={{ fontSize: 24, color: "#6b7280" }}>
                AI-powered insights. Clear buy, hold, and sell calls.
              </div>
            </>
          )}
        </div>
      ),
      imageOptions
    );
  } catch (e) {
    console.error("OG image generation error:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
