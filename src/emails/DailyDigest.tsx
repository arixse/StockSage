import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

interface DailyDigestProps {
  userName?: string;
  date: string;
  stocks: {
    ticker: string;
    companyName: string;
    price: number;
    change: number;
    changePercent: number;
    score?: number;
    recommendation?: string;
  }[];
  portfolioBrief?: {
    summary: string;
    highlights: string[];
    risks: string[];
    actionItems: string[];
  } | null;
}

function scoreColor(score: number) {
  if (score >= 65) return "#16a34a";
  if (score >= 45) return "#ca8a04";
  return "#dc2626";
}

function recLabel(rec: string) {
  return rec.replace(/_/g, " ");
}

export const DailyDigest = ({
  userName = "Investor",
  date,
  stocks,
  portfolioBrief,
}: DailyDigestProps) => {
  const gainers = stocks.filter((s) => s.change > 0).length;
  const scored = stocks.filter((s) => s.score != null);
  const avgScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + (s.score as number), 0) / scored.length)
      : null;

  return (
    <Html>
      <Head />
      <Preview>
        {`${gainers}/${stocks.length} gainers${avgScore != null ? ` · Avg Score ${avgScore}/100` : ""} — ${date}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>StockSage Daily Briefing</Heading>
          <Text style={text}>Hi {userName},</Text>

          {/* ── Portfolio Brief ── */}
          {portfolioBrief && (
            <Section style={briefCard}>
              <Text style={briefHeading}>Portfolio Overview</Text>
              <Text style={briefSummary}>{portfolioBrief.summary}</Text>
              {portfolioBrief.highlights.length > 0 && (
                <>
                  <Text style={briefSubheading}>Highlights</Text>
                  {portfolioBrief.highlights.map((h, i) => (
                    <Text key={i} style={briefItem}>• {h}</Text>
                  ))}
                </>
              )}
              {portfolioBrief.risks.length > 0 && (
                <>
                  <Text style={briefSubheading}>Risks</Text>
                  {portfolioBrief.risks.map((r, i) => (
                    <Text key={i} style={briefItem}>• {r}</Text>
                  ))}
                </>
              )}
              {portfolioBrief.actionItems.length > 0 && (
                <>
                  <Text style={briefSubheading}>Action Items</Text>
                  {portfolioBrief.actionItems.map((a, i) => (
                    <Text key={i} style={briefItem}>• {a}</Text>
                  ))}
                </>
              )}
            </Section>
          )}

          {/* ── Watchlist Summary ── */}
          <Text style={sectionTitle}>
            {`Watchlist — ${stocks.length} stocks · ${gainers} gainers${avgScore != null ? ` · Avg AI Score ${avgScore}/100` : ""}`}
          </Text>

          {/* ── Compact Table (raw HTML for continuous header + rows) ── */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse" as const,
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={thLeft}>Ticker</th>
                <th style={thRight}>Price</th>
                <th style={thRight}>Chg%</th>
                <th style={thRight}>AI Score</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, i) => (
                <tr
                  key={stock.ticker}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#f8fafc" : "#ffffff",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <td style={tdLeft}>
                    <span style={{ fontWeight: "700" }}>{stock.ticker}</span>
                  </td>
                  <td style={tdRight}>${stock.price.toFixed(2)}</td>
                  <td
                    style={{
                      ...tdRight,
                      color: stock.change >= 0 ? "#16a34a" : "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </td>
                  <td style={tdRight}>
                    {stock.score != null ? (
                      <span
                        style={{
                          fontWeight: "600",
                          fontSize: "12px",
                          color: scoreColor(stock.score),
                          background: `${scoreColor(stock.score)}15`,
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {stock.score}
                        {stock.recommendation
                          ? ` · ${recLabel(stock.recommendation)}`
                          : ""}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── CTA ── */}
          <Section style={ctaCard}>
            <Text style={ctaText}>
              <Link href="{{appUrl}}/dashboard" style={ctaLink}>
                View full analysis on StockSage →
              </Link>
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you subscribed to StockSage daily digest.
            </Text>
            <Text style={footerText}>
              <Link href="{{appUrl}}/newsletter" style={footerLink}>
                Unsubscribe or manage preferences
              </Link>
              {" · "}
              <Link href="{{appUrl}}/legal/privacy" style={footerLink}>
                Privacy
              </Link>
            </Text>
            <Text style={footerText}>
              StockSage · AI-Powered Stock Analysis
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────

const main = {
  backgroundColor: "#f8fafc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: "16px",
};

const text = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "24px",
};

// Portfolio Brief
const briefCard = {
  background: "#eef2ff",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "16px",
  marginBottom: "16px",
  border: "1px solid #c7d2fe",
};

const briefHeading = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#4338ca",
  marginBottom: "8px",
};

const briefSummary = {
  fontSize: "14px",
  color: "#334155",
  lineHeight: "20px",
  marginBottom: "12px",
};

const briefSubheading = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  marginTop: "8px",
  marginBottom: "4px",
};

const briefItem = {
  fontSize: "13px",
  color: "#475569",
  margin: "2px 0 2px 4px",
};

// Section title
const sectionTitle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#334155",
  marginTop: "16px",
  marginBottom: "8px",
};

// Table
const thLeft: React.CSSProperties = {
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  textTransform: "uppercase" as const,
  padding: "8px 16px",
};

const thRight: React.CSSProperties = {
  textAlign: "right",
  fontSize: "12px",
  fontWeight: "600",
  color: "#64748b",
  textTransform: "uppercase" as const,
  padding: "8px 16px",
};

const tdLeft: React.CSSProperties = {
  textAlign: "left",
  fontSize: "14px",
  color: "#1e293b",
  padding: "8px 16px",
};

const tdRight: React.CSSProperties = {
  textAlign: "right",
  fontSize: "14px",
  color: "#334155",
  padding: "8px 16px",
};

// CTA
const ctaCard = {
  textAlign: "center" as const,
  marginTop: "16px",
};

const ctaText = {
  fontSize: "15px",
};

const ctaLink = {
  color: "#4f46e5",
  fontWeight: "600",
};

// Footer
const footer = {
  marginTop: "32px",
  borderTop: "1px solid #e2e8f0",
  paddingTop: "16px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#94a3b8",
};

const footerLink = {
  fontSize: "12px",
  color: "#6366f1",
};

export default DailyDigest;
