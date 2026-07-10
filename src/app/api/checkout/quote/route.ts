import {
  calculateAmounts,
  signCheckoutToken,
  validateAddress,
  validateCart,
  validateCustomer,
} from "@/lib/checkout-server";
import { createDeliveryQuote } from "@/lib/uber-direct";
import { rateLimit } from "@/lib/rate-limit";
import { checkoutMode } from "@/lib/checkout-mode";

export async function POST(request: Request) {
  if (rateLimit(request, "checkout-quote", 10)) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "300" } });
  }
  try {
    const body = await request.json();
    const lines = validateCart(body?.lines);
    const address = validateAddress(body?.address);
    const customer = validateCustomer(body?.customer);
    if (!lines || !address || !customer) {
      return Response.json({ error: "invalid_checkout" }, { status: 400 });
    }

    const mode = checkoutMode();
    const quote = mode.demo
      ? {
          id: `demo_quote_${crypto.randomUUID()}`,
          feeCents: Math.max(0, Number(process.env.CHECKOUT_DEMO_DELIVERY_FEE_CENTS) || 699),
          expiresAt: Date.now() + 15 * 60_000,
        }
      : await createDeliveryQuote(address);
    const expiresAt = Math.min(quote.expiresAt, Date.now() + 15 * 60_000);
    if (expiresAt <= Date.now() + 30_000) {
      return Response.json({ error: "quote_expired" }, { status: 409 });
    }
    const amounts = calculateAmounts(lines, quote.feeCents);
    const checkoutToken = signCheckoutToken({
      ...amounts,
      quoteId: quote.id,
      expiresAt,
      address,
      customer,
      lines: lines.map(({ itemId, quantity }) => ({ itemId, quantity })),
    });

    return Response.json({
      ...amounts,
      checkoutToken,
      quoteId: quote.id,
      expiresAt: new Date(expiresAt).toISOString(),
      confirmedAddress: address,
    });
  } catch (error) {
    console.error("Checkout quote failed", error);
    return Response.json({ error: "delivery_unavailable" }, { status: 502 });
  }
}
