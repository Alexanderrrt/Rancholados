# Rancholados

Bilingual Rancholados storefront with an on-site cart and checkout. Payments are tokenized by Square Web Payments SDK (card and Apple Pay), authorized by the server, and completed only after Uber Direct accepts the delivery created from the confirmed address.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Checkout configuration

Copy `.env.example` to `.env.local` and add Square Sandbox and Uber Direct test credentials. The checkout intentionally remains disabled when credentials are missing.

The production flow is:

1. The customer adds menu items to the local cart.
2. Uber Direct creates a quote and confirms the exact delivery address. The address and contact fields are then locked.
3. Square tokenizes Apple Pay or card details in the browser.
4. The server independently validates current menu prices and the signed Uber quote, then authorizes (but does not capture) the Square payment.
5. The server creates an idempotent Uber Direct delivery and completes the Square payment. If either completion step fails, it attempts to cancel the other authorization/delivery.

Before production launch:

- Switch all Square and Uber credentials from Sandbox/Test to Production and set `SQUARE_ENVIRONMENT=production`.
- Serve the site over HTTPS and register/verify the production domain for Apple Pay in the Square Developer Dashboard.
- Confirm the applicable sales-tax rate and set `CHECKOUT_TAX_RATE_BPS`; the default is deliberately zero.
- Configure Uber Direct webhooks in the Uber dashboard for delivery status monitoring and operational alerts.
- Run real end-to-end test orders for card, Apple Pay, delivery rejection, and compensation failures.

Run `npm test` to verify checkout price signing, Square authorization/capture payloads, Uber quote/delivery payloads, idempotency, and compensation behavior without contacting either provider.

For Uber webhooks, set `UBER_WEBHOOK_SIGNING_KEY` and register `https://YOUR_DOMAIN/api/webhooks/uber` in the Uber Direct dashboard. The endpoint verifies the HMAC against the untouched raw request body before accepting an event.

When running `next dev` without provider credentials, checkout automatically uses a development-only demo provider. Demo orders exercise the full interface but never charge Square or dispatch Uber. Demo mode is disabled whenever `NODE_ENV=production`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
