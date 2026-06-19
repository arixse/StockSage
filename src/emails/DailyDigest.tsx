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
    summary: string;
    keyPoints: string[];
  }[];
}

export const DailyDigest = ({
  userName = "Investor",
  date,
  stocks,
}: DailyDigestProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your daily stock briefing for {date}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📈 StockSage Daily Briefing</Heading>
          <Text style={text}>Good morning, {userName}!</Text>
          <Text style={text}>
            Here&apos;s your AI-powered stock summary for {date}.
          </Text>

          {stocks.map((stock) => (
            <Section key={stock.ticker} style={stockCard}>
              <Row>
                <Column>
                  <Text style={ticker}>{stock.ticker}</Text>
                  <Text style={companyName}>{stock.companyName}</Text>
                </Column>
                <Column align="right">
                  <Text style={price}>${stock.price.toFixed(2)}</Text>
                  <Text
                    style={{
                      ...change,
                      color: stock.change >= 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </Text>
                </Column>
              </Row>
              {stock.score != null && (
                <Text style={score}>
                  AI Score: {stock.score}/100
                </Text>
              )}
              <Text style={summary}>{stock.summary}</Text>
              {stock.keyPoints.length > 0 && (
                <Section style={keyPointsSection}>
                  {stock.keyPoints.map((point, i) => (
                    <Text key={i} style={keyPoint}>
                      • {point}
                    </Text>
                  ))}
                </Section>
              )}
            </Section>
          ))}

          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you subscribed to StockSage.
            </Text>
            <Link href="{{appUrl}}/newsletter" style={footerLink}>
              Manage preferences
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
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

const stockCard = {
  background: "#ffffff",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #e2e8f0",
};

const ticker = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
};

const companyName = {
  fontSize: "14px",
  color: "#94a3b8",
};

const price = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1e293b",
};

const change = {
  fontSize: "14px",
  fontWeight: "600",
};

const score = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6366f1",
  marginTop: "8px",
};

const summary = {
  fontSize: "14px",
  color: "#334155",
  lineHeight: "20px",
  marginTop: "8px",
};

const keyPointsSection = {
  marginTop: "8px",
};

const keyPoint = {
  fontSize: "13px",
  color: "#475569",
  margin: "2px 0",
};

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
