import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Preview,
  Row,
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

export const DailyDigest = ({
  userName = "Investor",
  date,
  stocks,
  portfolioBrief,
}: DailyDigestProps) => {
  const gainers = stocks.filter((s) => s.change > 0).length;
  const avgScore =
    stocks.filter((s) => s.score != null).length > 0
      ? Math.round(
          stocks
            .filter((s) => s.score != null)
            .reduce((sum, s) => sum + (s.score as number), 0) /
            stocks.filter((s) => s.score != null).length
        )
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
            Watchlist — {stocks.length} stocks · {gainers} gainers
            {avgScore != null ? ` · Avg AI Score ${avgScore}/100` : ""}
          </Text>

          {/* ── Compact Table ── */}
          <Section style={tableCard}>
            {/* Header */}
            <Row style={tableHeaderRow}>
              <Column style={colTicker}>Ticker</Column>
              <Column style={colPrice}>Price</Column>
              <Column style={colChange}>Chg%</Column>
              <Column style={colScore}>AI Score</Column>
            </Row>
            {/* Rows */}
            {stocks.map((stock, i) => (
              <Row
                key={stock.ticker}
                style={{
                  ...tableRow,
                  backgroundColor: i % 2 === 0 ? "#f8fafc" : "#ffffff",
                }}
              >
                <Column style={colTicker}>
                  <Text style={tickerCell}>{stock.ticker}</Text>
                </Column>
                <Column style={colPrice}>
                  <Text style={priceCell}>${stock.price.toFixed(2)}</Text>
                </Column>
                <Column style={colChange}>
                  <Text
                    style={{
                      ...changeCell,
                      color: stock.change >= 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </Text>
                </Column>
                <Column style={colScore}>
                  {stock.score != null ? (
                    <Text
                      style={{
                        ...scoreCell,
                        color:
                          stock.score >= 65
                            ? "#16a34a"
                            : stock.score >= 45
                              ? "#ca8a04"
                              : "#dc2626",
                      }}
                    >
                      {stock.score}
                      {stock.recommendation
                        ? ` · ${stock.recommendation.replace(/_/g, " ")}`
                        : ""}
                    </Text>
                  ) : (
                    <Text style={scoreNa}>—</Text>
                  )}
                </Column>
              </Row>
            ))}
          </Section>

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
const tableCard = {
  background: "#ffffff",
  borderRadius: "8px",
  padding: "4px 0",
  border: "1px solid #e2e8f0",
};

const tableHeaderRow = {
  borderBottom: "2px solid #e2e8f0",
  padding: "8px 16px",
};

const tableRow = {
  padding: "6px 16px",
  borderBottom: "1px solid #f1f5f9",
};

const colTicker: React.CSSProperties = { width: "25%" };
const colPrice: React.CSSProperties = { width: "25%", textAlign: "right" };
const colChange: React.CSSProperties = { width: "25%", textAlign: "right" };
const colScore: React.CSSProperties = { width: "25%", textAlign: "right" };

const tickerCell = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#1e293b",
};

const priceCell = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155",
};

const changeCell = {
  fontSize: "14px",
  fontWeight: "600",
};

const scoreCell = {
  fontSize: "12px",
  fontWeight: "600",
};

const scoreNa = {
  fontSize: "12px",
  color: "#94a3b8",
  fontWeight: "400" as const,
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
