import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as quote } from "@/app/api/checkout/quote/route";
import { POST as pay } from "@/app/api/checkout/pay/route";

const checkout = {
  lines: [{ itemId: "cholado-sencillo", quantity: 1 }],
  address: {
    street1: "123 Market St",
    street2: "",
    city: "San Jose",
    state: "CA",
    postalCode: "95113",
    country: "US",
  },
  customer: {
    firstName: "Ana",
    lastName: "Gomez",
    phone: "+14085550123",
    email: "ana@example.com",
  },
};

beforeEach(() => {
  vi.stubEnv("CHECKOUT_DEMO_MODE", "true");
  vi.stubEnv("CHECKOUT_DEMO_DELIVERY_FEE_CENTS", "699");
  vi.stubEnv("CHECKOUT_TAX_RATE_BPS", "0");
});

describe("keyless development checkout", () => {
  it("confirms an address, locks totals, and completes without provider calls", async () => {
    const quoteResponse = await quote(
      new Request("http://localhost/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.1.0.1" },
        body: JSON.stringify(checkout),
      })
    );
    expect(quoteResponse.status).toBe(200);
    const quoted = await quoteResponse.json();
    expect(quoted).toEqual(expect.objectContaining({
      subtotalCents: 1600,
      deliveryFeeCents: 699,
      totalCents: 2299,
      confirmedAddress: checkout.address,
    }));

    const paymentResponse = await pay(
      new Request("http://localhost/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.1.0.1" },
        body: JSON.stringify({
          sourceId: "demo-payment-source",
          checkoutToken: quoted.checkoutToken,
          idempotencyKey: "demoidempotencykey1234567890",
        }),
      })
    );
    expect(paymentResponse.status).toBe(200);
    await expect(paymentResponse.json()).resolves.toEqual(expect.objectContaining({
      demo: true,
      orderId: expect.stringContaining("demo_"),
      paymentId: expect.stringContaining("demo_payment_"),
      deliveryId: expect.stringContaining("demo_delivery_"),
    }));
  });
});
