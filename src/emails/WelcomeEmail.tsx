import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Link,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName?: string;
}

export const WelcomeEmail = ({ userName = "Investor" }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to StockSage — your AI-powered stock analysis platform</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Welcome to StockSage!</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Thanks for joining StockSage! We&apos;re excited to help you make smarter
            investment decisions with AI-powered stock analysis.
          </Text>

          <Section style={card}>
            <Heading as="h2" style={h2}>
              Get Started in 3 Steps
            </Heading>
            <Text style={step}>1️⃣ Add stocks to your watchlist</Text>
            <Text style={step}>2️⃣ View AI-powered charts and analysis</Text>
            <Text style={step}>3️⃣ Receive your daily briefing email</Text>
          </Section>

          <Section style={ctaSection}>
            <Button
              href="{{appUrl}}/dashboard"
              style={button}
            >
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            Start by searching for your favorite stocks like AAPL, MSFT, or NVDA
            and adding them to your watchlist.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              StockSage — AI-powered US stock market analysis
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

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

const h2 = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
  marginBottom: "12px",
};

const text = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "24px",
  marginBottom: "12px",
};

const step = {
  fontSize: "15px",
  color: "#334155",
  lineHeight: "28px",
  margin: "4px 0",
};

const card = {
  background: "#ffffff",
  borderRadius: "8px",
  padding: "16px 20px",
  marginBottom: "16px",
  border: "1px solid #e2e8f0",
};

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
  display: "inline-block",
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

export default WelcomeEmail;
