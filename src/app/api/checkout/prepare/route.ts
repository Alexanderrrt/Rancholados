import {
  calculateAmounts,
  signCheckoutToken,
  validateCart,
  validateCustomer,
} from "@/lib/checkout-server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (rateLimit(request, "checkout-prepare", 10)) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "300" } });
  }
  try {
    const body = await request.json();
    const lines = validateCart(body?.lines);
    const customer = validateCustomer(body?.customer);
    if (!lines || !customer) {
      return Response.json({ error: "invalid_checkout" }, { status: 400 });
    }
    const expiresAt = Date.now() + 15 * 60_000;
    const amounts = calculateAmounts(lines);
    const checkoutToken = signCheckoutToken({
      ...amounts,
      expiresAt,
      customer,
      lines: lines.map(({ itemId, quantity }) => ({ itemId, quantity })),
    });
    return Response.json({
      ...amounts,
      checkoutToken,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (error) {
    console.error("Pickup checkout preparation failed", error);
    return Response.json({ error: "checkout_unavailable" }, { status: 502 });
  }
}
