import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as prepare } from "@/app/api/checkout/prepare/route";
import { POST as pay } from "@/app/api/checkout/pay/route";

const checkout = {
  lines: [{ itemId: "cholado-sencillo", quantity: 1 }],
  customer: {
    firstName: "Ana",
    lastName: "Gomez",
    phone: "+14085550123",
    email: "ana@example.com",
  },
};

beforeEach(() => {
  vi.stubEnv("CHECKOUT_DEMO_MODE", "true");
  vi.stubEnv("CHECKOUT_TAX_RATE_BPS", "0");
});

describe("keyless pickup checkout", () => {
  it("locks server totals and completes without charging Square", async () => {
    const preparationResponse = await prepare(
      new Request("http://localhost/api/checkout/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.3.0.1" },
        body: JSON.stringify(checkout),
      })
    );
    expect(preparationResponse.status).toBe(200);
    const prepared = await preparationResponse.json();
    expect(prepared).toEqual(expect.objectContaining({
      subtotalCents: 1600,
      taxCents: 0,
      totalCents: 1600,
    }));
    const paymentResponse = await pay(
      new Request("http://localhost/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.3.0.1" },
        body: JSON.stringify({
          sourceId: "demo-payment-source",
          checkoutToken: prepared.checkoutToken,
          idempotencyKey: "demopickupcheckoutkey123456",
        }),
      })
    );
    expect(paymentResponse.status).toBe(200);
    await expect(paymentResponse.json()).resolves.toEqual(expect.objectContaining({
      demo: true,
      orderId: expect.stringContaining("demo_"),
      paymentId: expect.stringContaining("demo_payment_"),
    }));
  });
});
