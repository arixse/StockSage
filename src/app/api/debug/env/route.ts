import { NextResponse } from "next/server";

export async function GET() {
  const mask = (val: string | undefined) => {
    if (!val) return "NOT SET";
    if (val === "sk-..." || val === "...") return "PLACEHOLDER";
    return `${val.slice(0, 8)}...${val.slice(-4)} (len=${val.length})`;
  };

  return NextResponse.json({
    LLM_API_KEY: mask(process.env.LLM_API_KEY),
    LLM_BASE_URL: process.env.LLM_BASE_URL || "DEFAULT: https://api.openai.com/v1",
    LLM_MODEL: process.env.LLM_MODEL || "DEFAULT: gpt-4o-mini",
    FINNHUB_API_KEY: mask(process.env.FINNHUB_API_KEY),
    RESEND_API_KEY: mask(process.env.RESEND_API_KEY),
    CRON_SECRET: mask(process.env.CRON_SECRET),
    hasLLM: !!process.env.LLM_API_KEY,
    hasResend: !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_..."),
    hasCronSecret: !!(process.env.CRON_SECRET && process.env.CRON_SECRET !== "dev-cron-secret-change-in-production"),
    nodeEnv: process.env.NODE_ENV || "not set",
  });
}
