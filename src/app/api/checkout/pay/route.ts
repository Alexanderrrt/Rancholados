import { randomUUID } from "node:crypto";
import { getItemById } from "@/data/menu";
import { verifyCheckoutToken } from "@/lib/checkout-server";
import { checkoutMode } from "@/lib/checkout-mode";
import { rateLimit } from "@/lib/rate-limit";
import { takeSquarePayment } from "@/lib/square";

export async function POST(request: Request) {
  if (rateLimit(request, "checkout-pay", 5)) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "300" } });
  }
  try {
    const body = await request.json();
    const checkout = verifyCheckoutToken(body?.checkoutToken);
    const sourceId = typeof body?.sourceId === "string" ? body.sourceId.trim().slice(0, 512) : "";
    const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
    if (!checkout || !sourceId || !/^[a-zA-Z0-9_-]{20,45}$/.test(idempotencyKey)) {
      return Response.json({ error: "invalid_payment" }, { status: 400 });
    }
    const orderReference = idempotencyKey.slice(0, 40);
    if (checkoutMode().demo) {
      if (sourceId !== "demo-payment-source") {
        return Response.json({ error: "invalid_demo_payment" }, { status: 400 });
      }
      return Response.json({
        orderId: `demo_${orderReference}`,
        paymentId: `demo_payment_${orderReference}`,
        receiptUrl: null,
        demo: true,
      });
    }
    const note = checkout.lines
      .map((line) => `${line.quantity}x ${getItemById(line.itemId)!.nameEn}`)
      .join(", ");
    const payment = await takeSquarePayment({
      sourceId,
      idempotencyKey,
      amountCents: checkout.totalCents,
      referenceId: orderReference,
      email: checkout.customer.email,
      note,
    });
    return Response.json({
      orderId: orderReference,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl || null,
    });
  } catch (error) {
    console.error("Pickup checkout payment failed", { error, incidentId: randomUUID() });
    return Response.json({ error: "checkout_failed" }, { status: 502 });
  }
}
