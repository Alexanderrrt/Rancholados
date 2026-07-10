import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    const squareHost =
      process.env.SQUARE_ENVIRONMENT === "production"
        ? "https://web.squarecdn.com"
        : "https://sandbox.web.squarecdn.com";
    const squareConnect =
      process.env.SQUARE_ENVIRONMENT === "production"
        ? "https://pci-connect.squareup.com"
        : "https://pci-connect.squareupsandbox.com";
    const developmentEval = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${developmentEval} ${squareHost}`,
      `frame-src 'self' ${squareHost}`,
      `connect-src 'self' ${squareHost} ${squareConnect} https://o160250.ingest.sentry.io`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com https://square-fonts-production-f.squarecdn.com https://d1g145x70srn7h.cloudfront.net",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
