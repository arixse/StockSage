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
  Img,
  Hr,
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

function scoreBadge(score: number) {
  if (score >= 65) return { bg: "#dcfce7", color: "#16a34a", border: "#bbf7d0" };
  if (score >= 45) return { bg: "#fef9c3", color: "#ca8a04", border: "#fef08a" };
  return { bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
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
  const losers = stocks.filter((s) => s.change < 0).length;
  const scored = stocks.filter((s) => s.score != null);
  const avgScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + (s.score as number), 0) / scored.length)
      : null;

  const dateFormatted = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>
        {`${dateFormatted} · ${gainers}↑ ${losers}↓ · ${stocks.length} stocks`}
        {avgScore != null ? ` · AI Score ${avgScore}/100` : ""}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ── Header ── */}
          <Section style={header}>
            <Text style={logo}>📈 StockSage</Text>
            <Text style={dateText}>{dateFormatted}</Text>
          </Section>

          <Text style={greeting}>Hi {userName},</Text>
          <Text style={intro}>
            Here&apos;s your daily portfolio briefing with AI-powered insights for{" "}
            {stocks.length} stocks in your watchlist.
          </Text>

          {/* ── Stats Bar ── */}
          <Section style={statsBar}>
            <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
              <tr>
                <td style={statCell} width="33%">
                  <Text style={statValue}>{stocks.length}</Text>
                  <Text style={statLabel}>Stocks</Text>
                </td>
                <td style={statCell} width="33%">
                  <Text style={{ ...statValue, color: "#16a34a" }}>{gainers}↑</Text>
                  <Text style={{ ...statValue, color: "#dc2626" }}>{losers}↓</Text>
                  <Text style={statLabel}>Movers</Text>
                </td>
                <td style={statCell} width="33%">
                  <Text style={statValue}>
                    {avgScore != null ? avgScore : "—"}
                  </Text>
                  <Text style={statLabel}>Avg AI Score</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* ── Portfolio Brief ── */}
          {portfolioBrief && (
            <>
              <Text style={briefHeading}>AI Portfolio Analysis</Text>

              <table width="100%" cellPadding={0} cellSpacing={0} border={0} style={briefTable}>
                <tr>
                  <td style={briefSummaryCell}>
                    <Text style={briefSummaryText}>{portfolioBrief.summary}</Text>
                  </td>
                </tr>
                {portfolioBrief.highlights.length > 0 && (
                  <tr>
                    <td style={briefSectionCell}>
                      <Text style={briefLabel}>Highlights</Text>
                      {portfolioBrief.highlights.map((h, i) => (
                        <Text key={i} style={briefBullet}>{h}</Text>
                      ))}
                    </td>
                  </tr>
                )}
                {portfolioBrief.risks.length > 0 && (
                  <tr>
                    <td style={briefSectionCell}>
                      <Text style={briefLabel}>Risks</Text>
                      {portfolioBrief.risks.map((r, i) => (
                        <Text key={i} style={briefBullet}>{r}</Text>
                      ))}
                    </td>
                  </tr>
                )}
                {portfolioBrief.actionItems.length > 0 && (
                  <tr>
                    <td style={briefSectionCell}>
                      <Text style={briefLabel}>Action Items</Text>
                      {portfolioBrief.actionItems.map((a, i) => (
                        <Text key={i} style={briefBullet}>{a}</Text>
                      ))}
                    </td>
                  </tr>
                )}
              </table>
            </>
          )}

          {/* ── Watchlist Table ── */}
          <Section style={tableWrapper}>
            <Text style={tableTitle}>Watchlist</Text>
            <table
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={tableHeadRow}>
                  <th style={th}>Ticker</th>
                  <th style={{ ...th, textAlign: "right" }}>Price</th>
                  <th style={{ ...th, textAlign: "right" }}>Chg%</th>
                  <th style={{ ...th, textAlign: "right" }}>AI Score</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, i) => {
                  const badge = stock.score != null ? scoreBadge(stock.score) : null;
                  return (
                    <tr
                      key={stock.ticker}
                      style={{
                        borderBottom: i < stocks.length - 1 ? "1px solid #f1f5f9" : "none",
                      }}
                    >
                      <td style={td}>
                        <Text style={tickerName}>{stock.ticker}</Text>
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <Text style={priceText}>
                          ${stock.price > 0 ? stock.price.toFixed(2) : "—"}
                        </Text>
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <Text
                          style={{
                            ...changeText,
                            color: stock.change >= 0 ? "#16a34a" : "#dc2626",
                          }}
                        >
                          {stock.price > 0
                            ? `${stock.change >= 0 ? "+" : ""}${stock.changePercent.toFixed(2)}%`
                            : "—"}
                        </Text>
                      </td>
                      <td style={{ ...td, textAlign: "right" }}>
                        {badge ? (
                          <span
                            style={{
                              display: "inline-block",
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              borderRadius: "6px",
                              padding: "2px 8px",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            {stock.score}
                            {stock.recommendation
                              ? ` · ${recLabel(stock.recommendation)}`
                              : ""}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Section>

          <Hr style={hr} />

          {/* ── CTA ── */}
          <Section style={cta}>
            <table width="100%" cellPadding={0} cellSpacing={0} border={0}>
              <tr>
                <td align="center">
                  <Link href="{{appUrl}}/dashboard" style={ctaButton}>
                    View Full Analysis →
                  </Link>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              You received this email because daily digest is enabled in your{" "}
              <Link href="{{appUrl}}/newsletter" style={footerLink}>notification preferences</Link>.
            </Text>
            <Text style={footerMuted}>
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
  backgroundColor: "#f1f5f9",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "32px 0",
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  background: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
};

// Header
const header = {
  background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  padding: "28px 32px",
  textAlign: "center" as const,
};

const logo = {
  fontSize: "22px",
  fontWeight: "800",
  color: "#ffffff",
  margin: "0 0 4px 0",
};

const dateText = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "0",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  padding: "24px 32px 0 32px",
  margin: "0",
};

const intro = {
  fontSize: "15px",
  color: "#64748b",
  lineHeight: "22px",
  padding: "8px 32px 0 32px",
  margin: "0",
};

// Stats Bar
const statsBar = {
  padding: "16px 32px",
};

const statCell: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 8px",
  background: "#f8fafc",
  borderRadius: "8px",
};

const statValue = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0",
};

const statLabel = {
  fontSize: "11px",
  fontWeight: "500",
  color: "#94a3b8",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "2px 0 0 0",
};

// Portfolio Brief
const briefHeading = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#4338ca",
  margin: "0 0 8px 0",
};

const briefTable = {
  background: "#eef2ff",
  borderRadius: "8px",
  border: "1px solid #e0e7ff",
  marginBottom: "20px",
};

const briefSummaryCell: React.CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid #e0e7ff",
};

const briefSummaryText = {
  fontSize: "14px",
  color: "#334155",
  lineHeight: "21px",
  margin: "0",
};

const briefSectionCell: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid #e0e7ff",
};

const briefLabel = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#475569",
  margin: "0 0 6px 0",
};

const briefBullet = {
  fontSize: "13px",
  color: "#475569",
  lineHeight: "19px",
  margin: "0 0 3px 10px",
};

// Table
const tableWrapper = {
  padding: "0 32px 8px 32px",
};

const tableTitle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
};

const tableHeadRow = {
  background: "#f8fafc",
  borderBottom: "2px solid #e2e8f0",
};

const th: React.CSSProperties = {
  textAlign: "left",
  fontSize: "11px",
  fontWeight: "600",
  color: "#94a3b8",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  padding: "10px 12px",
};

const td: React.CSSProperties = {
  padding: "10px 12px",
};

const tickerName = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#1e293b",
  margin: "0",
};

const priceText = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1e293b",
  margin: "0",
};

const changeText = {
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

// CTA
const cta = {
  padding: "16px 32px",
  textAlign: "center" as const,
};

const ctaButton = {
  display: "inline-block",
  background: "#4f46e5",
  color: "#ffffff",
  borderRadius: "8px",
  padding: "12px 28px",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
};

// Divider
const hr = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "0 32px",
};

// Footer
const footer = {
  padding: "16px 32px 24px 32px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#94a3b8",
  lineHeight: "18px",
  margin: "0 0 4px 0",
};

const footerMuted = {
  fontSize: "11px",
  color: "#cbd5e1",
  margin: "8px 0 0 0",
};

const footerLink = {
  color: "#6366f1",
  textDecoration: "underline",
};

export default DailyDigest;
