import { randomUUID } from "node:crypto";
import { getItemById } from "@/data/menu";
import { verifyCheckoutToken, type ValidatedLine } from "@/lib/checkout-server";
import { authorizeSquarePayment, cancelSquarePayment, completeSquarePayment } from "@/lib/square";
import { cancelUberDelivery, createUberDelivery } from "@/lib/uber-direct";
import { rateLimit } from "@/lib/rate-limit";
import { checkoutMode } from "@/lib/checkout-mode";

export async function POST(request: Request) {
  if (rateLimit(request, "checkout-pay", 5)) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "300" } });
  }
  let paymentId: string | null = null;
  let deliveryId: string | null = null;
  try {
    const body = await request.json();
    const checkout = verifyCheckoutToken(body?.checkoutToken);
    const sourceId = typeof body?.sourceId === "string" ? body.sourceId.trim().slice(0, 512) : "";
    const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
    if (!checkout || !sourceId || !/^[a-zA-Z0-9_-]{20,45}$/.test(idempotencyKey)) {
      return Response.json({ error: "invalid_payment" }, { status: 400 });
    }

    const orderReference = idempotencyKey.slice(0, 40);
    const lines: ValidatedLine[] = checkout.lines.map((line) => {
      const item = getItemById(line.itemId)!;
      return { ...line, name: item.nameEn, priceCents: item.priceCents };
    });
    const note = lines.map((line) => `${line.quantity}x ${line.name}`).join(", ");
    if (checkoutMode().demo) {
      if (sourceId !== "demo-payment-source") {
        return Response.json({ error: "invalid_demo_payment" }, { status: 400 });
      }
      return Response.json({
        orderId: `demo_${orderReference}`,
        paymentId: `demo_payment_${orderReference}`,
        deliveryId: `demo_delivery_${orderReference}`,
        trackingUrl: null,
        receiptUrl: null,
        demo: true,
      });
    }
    const authorized = await authorizeSquarePayment({
      sourceId,
      idempotencyKey,
      amountCents: checkout.totalCents,
      referenceId: orderReference,
      email: checkout.customer.email,
      note,
      shippingAddress: {
        address_line_1: checkout.address.street1,
        ...(checkout.address.street2 ? { address_line_2: checkout.address.street2 } : {}),
        locality: checkout.address.city,
        administrative_district_level_1: checkout.address.state,
        postal_code: checkout.address.postalCode,
        country: "US",
      },
    });
    paymentId = authorized.id;

    const delivery = await createUberDelivery({
      quoteId: checkout.quoteId,
      address: checkout.address,
      customer: checkout.customer,
      lines,
      externalId: orderReference,
    });
    deliveryId = delivery.id;

    const payment = await completeSquarePayment(paymentId);
    return Response.json({
      orderId: orderReference,
      paymentId: payment.id,
      deliveryId: delivery.id,
      trackingUrl: delivery.trackingUrl || null,
      receiptUrl: payment.receiptUrl || null,
    });
  } catch (error) {
    console.error("Checkout payment failed", { error, paymentId, deliveryId, incidentId: randomUUID() });
    if (deliveryId) {
      try {
        await cancelUberDelivery(deliveryId);
      } catch (cancelError) {
        console.error("Uber compensation failed", cancelError);
      }
    }
    if (paymentId) {
      try {
        await cancelSquarePayment(paymentId);
      } catch (cancelError) {
        console.error("Square compensation failed", cancelError);
      }
    }
    return Response.json({ error: "checkout_failed" }, { status: 502 });
  }
}
