# Rancholados

Bilingual Rancholados storefront with an on-site cart and pickup-only checkout. Customers who need delivery are directed to DoorDash.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without Square credentials, development automatically uses a clearly labeled demo checkout that cannot charge money. Demo mode is never available when `NODE_ENV=production`.

## Square pickup checkout

Copy `.env.example` to `.env.local` and add Square Sandbox credentials. The production flow is:

1. The customer adds available menu items to the local cart.
2. Previously saved contact details are prefilled and the customer confirms pickup at Rancholados, 1075 Tully Rd, Suite 24.
3. The server validates current menu prices, calculates tax, and returns a short-lived signed checkout token.
4. Square Web Payments SDK tokenizes Apple Pay or card details in the browser.
5. The server independently validates the signed total and completes a Square payment marked as a pickup order.

Before production launch:

- Set production Square credentials and `SQUARE_ENVIRONMENT=production`.
- Serve the site over HTTPS and register/verify the production domain for Apple Pay in the Square Developer Dashboard.
- Confirm the applicable sales-tax rate and set `CHECKOUT_TAX_RATE_BPS`; the default is deliberately zero.
- Run real Sandbox and production-readiness tests for card declines, Apple Pay, duplicate submissions, and receipts.

Run `npm test` for signed-price, Square payload, idempotency, API, and demo-checkout coverage.
