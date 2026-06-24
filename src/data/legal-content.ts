export interface LegalPage {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export interface LegalSection {
  heading: string;
  content: string;
  items?: string[];
}

export const termsContent: LegalPage = {
  title: "Terms of Service",
  lastUpdated: "2026-06-01",
  sections: [
    {
      heading: "1. Acceptance of Terms",
      content: "By accessing or using StockSage (the 'Service'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.",
    },
    {
      heading: "2. Description of Service",
      content: "StockSage provides AI-powered stock market analysis, news aggregation, technical indicators, and portfolio tracking tools. The Service is intended for informational and educational purposes only and does not constitute financial advice, investment recommendations, or solicitation to buy or sell securities.",
    },
    {
      heading: "3. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration. You must be at least 18 years old to create an account.",
    },
    {
      heading: "4. No Financial Advice",
      content: "StockSage is a data aggregation and analysis tool, not a registered investment advisor, broker-dealer, or financial planner. All information provided through the Service is for informational purposes only. You should consult with a qualified financial professional before making any investment decisions. Past performance does not guarantee future results.",
      items: [
        "We do not provide personalized investment advice",
        "AI-generated analysis may contain errors or inaccuracies",
        "You are solely responsible for your investment decisions",
        "Never invest money you cannot afford to lose",
      ],
    },
    {
      heading: "5. Subscription and Payments",
      content: "Free tier users have access to limited features. Paid subscriptions (Basic and Pro tiers) are billed monthly via Stripe. You may cancel at any time, and cancellation takes effect at the end of the current billing period. Refunds are not provided for partial months. We reserve the right to change pricing with 30 days notice.",
    },
    {
      heading: "6. Data Accuracy and Availability",
      content: "We source market data from third-party providers including Yahoo Finance, Finnhub, Alpha Vantage, and Twelve Data. We do not guarantee the accuracy, completeness, or timeliness of any data displayed. Market data may be delayed. The Service may be unavailable during maintenance or due to technical issues.",
    },
    {
      heading: "7. Intellectual Property",
      content: "The StockSage name, logo, website design, and original content are our intellectual property. Market data and news content belong to their respective providers. You may not reproduce, distribute, or create derivative works from our content without permission.",
    },
    {
      heading: "8. Limitation of Liability",
      content: "To the fullest extent permitted by law, StockSage shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or inability to use the Service, including but not limited to investment losses, data loss, or business interruption.",
    },
    {
      heading: "9. Termination",
      content: "We reserve the right to suspend or terminate your account at any time for violation of these terms, illegal activity, or any other reason at our sole discretion. You may terminate your account at any time by contacting us.",
    },
    {
      heading: "10. Governing Law",
      content: "These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or the Service shall be resolved through binding arbitration.",
    },
    {
      heading: "11. Contact",
      content: "For questions about these Terms of Service, please contact us at newsletter@stocksage.xyz.",
    },
  ],
};

export const privacyContent: LegalPage = {
  title: "Privacy Policy",
  lastUpdated: "2026-06-01",
  sections: [
    {
      heading: "1. Information We Collect",
      content: "We collect information you provide directly, including your email address, name, and account preferences when you register. We also collect usage data including pages visited, features used, and interaction patterns to improve our Service.",
      items: [
        "Account information: email, name, authentication provider",
        "Usage data: pages viewed, features used, time spent",
        "Watchlist and portfolio data: stocks you track (but not your actual holdings or brokerage data)",
        "Payment information: processed securely by Stripe (we do not store credit card numbers)",
      ],
    },
    {
      heading: "2. How We Use Your Information",
      content: "We use your information to provide, maintain, and improve the Service. This includes personalizing your experience, sending email digests you've subscribed to, processing payments, and analyzing usage patterns to guide product development.",
    },
    {
      heading: "3. Data Storage and Security",
      content: "Your data is stored on Supabase (PostgreSQL) with encryption at rest and in transit. We implement industry-standard security measures including HTTPS, encrypted databases, and secure authentication via Supabase Auth. However, no electronic storage method is 100% secure.",
    },
    {
      heading: "4. Cookies and Tracking",
      content: "We use essential cookies for authentication and session management. We use Google Analytics to understand how users interact with the Service. You can disable cookies in your browser settings, though this may affect functionality. See our Cookie Policy for more details.",
    },
    {
      heading: "5. Third-Party Services",
      content: "We integrate with several third-party services to provide the Service: Supabase (database and authentication), Stripe (payment processing), Resend (email delivery), Finnhub and Alpha Vantage (market data), and OpenRouter/DeepSeek (AI analysis). Each service has its own privacy policy.",
    },
    {
      heading: "6. Data Sharing",
      content: "We do not sell your personal data. We do not share your data with third parties except as necessary to provide the Service (e.g., Stripe for payments, Resend for emails). We may disclose information if required by law or to protect our rights.",
    },
    {
      heading: "7. Data Retention",
      content: "We retain your account information as long as your account is active. You can request deletion of your account and associated data at any time by contacting us. Some data may be retained for legal or legitimate business purposes.",
    },
    {
      heading: "8. Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You can export your data or request account deletion. To exercise these rights, contact us at newsletter@stocksage.xyz.",
    },
    {
      heading: "9. Children's Privacy",
      content: "The Service is not intended for users under 18 years of age. We do not knowingly collect information from children. If we become aware that a child has provided us with personal information, we will delete it.",
    },
    {
      heading: "10. Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify users of material changes via email or through the Service. Continued use after changes constitutes acceptance.",
    },
    {
      heading: "11. Contact",
      content: "For privacy-related inquiries, contact us at newsletter@stocksage.xyz.",
    },
  ],
};

export const cookiesContent: LegalPage = {
  title: "Cookie Policy",
  lastUpdated: "2026-06-01",
  sections: [
    {
      heading: "1. What Are Cookies?",
      content: "Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site. Cookies can be 'session' (deleted when you close your browser) or 'persistent' (remain until they expire).",
    },
    {
      heading: "2. How We Use Cookies",
      content: "StockSage uses cookies for essential functionality and analytics purposes. We do not use cookies for advertising or tracking across other websites.",
      items: [
        "Authentication Cookies: Required to keep you logged in (managed by Supabase Auth)",
        "Preference Cookies: Remember your theme preference (light/dark mode)",
        "Analytics Cookies: Google Analytics helps us understand usage patterns",
        "No advertising or third-party tracking cookies are used",
      ],
    },
    {
      heading: "3. Third-Party Cookies",
      content: "Google Analytics sets cookies (_ga, _gid, _gat) to collect anonymous usage statistics. Supabase sets authentication-related cookies for session management. These are essential for the Service to function.",
    },
    {
      heading: "4. Managing Cookies",
      content: "You can control and delete cookies through your browser settings. You can also opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on. Note that disabling essential cookies may prevent you from logging in or using certain features.",
    },
    {
      heading: "5. Updates to This Policy",
      content: "We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated date.",
    },
  ],
};

export const disclaimerContent: LegalPage = {
  title: "Financial Disclaimer",
  lastUpdated: "2026-06-01",
  sections: [
    {
      heading: "Important Disclaimer",
      content: "The information provided by StockSage is for general informational and educational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.",
    },
    {
      heading: "Not Financial Advice",
      content: "StockSage is NOT a registered investment advisor, broker-dealer, financial analyst, financial planner, or securities broker. The information provided does not constitute financial advice, investment recommendations, or an offer to buy or sell any security. You should consult with qualified professionals before making any investment decisions.",
    },
    {
      heading: "AI-Generated Content",
      content: "Some content on StockSage is generated by artificial intelligence (AI) models. AI-generated analysis may contain errors, hallucinations, or outdated information. AI models are not financial advisors and their outputs should not be treated as such. Always verify AI-generated content against primary sources and consult a human financial advisor.",
    },
    {
      heading: "Investment Risk",
      content: "Investing in stocks, ETFs, and other securities involves substantial risk of loss. Past performance is not indicative of future results. You may lose some or all of your invested capital. Never invest more than you can afford to lose. Consider your risk tolerance, investment objectives, and financial situation before investing.",
    },
    {
      heading: "Market Data",
      content: "Market data displayed on StockSage may be delayed by 15 minutes or more depending on your subscription tier and data source availability. Data is sourced from third-party providers and is provided 'as is' without warranty. We are not responsible for trading decisions made based on delayed or inaccurate data.",
    },
    {
      heading: "No Guarantees",
      content: "StockSage's AI scores, technical indicators, sentiment analysis, and any other analytical tools are provided as-is with no guarantee of accuracy or profitability. These tools are designed to assist your research, not replace it. All trading and investment decisions are your sole responsibility.",
    },
    {
      heading: "Affiliate Disclosure",
      content: "StockSage may receive compensation through affiliate links or partnerships. This does not affect our analysis or recommendations, which are algorithmically generated and not influenced by commercial relationships.",
    },
    {
      heading: "Regulatory Compliance",
      content: "StockSage is not registered with the SEC, FINRA, or any other regulatory body. We do not provide regulated financial services. Users are responsible for complying with all applicable laws and regulations in their jurisdiction.",
    },
    {
      heading: "Contact",
      content: "If you have questions about this disclaimer, contact us at newsletter@stocksage.xyz.",
    },
  ],
};

export function getLegalPage(page: "terms" | "privacy" | "cookies" | "disclaimer"): LegalPage {
  const pages = { terms: termsContent, privacy: privacyContent, cookies: cookiesContent, disclaimer: disclaimerContent };
  return pages[page];
}
