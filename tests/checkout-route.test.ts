import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculateAmounts, signCheckoutToken, validateCart } from "@/lib/checkout-server";

const providerMocks = vi.hoisted(() => ({
  authorize: vi.fn(),
  complete: vi.fn(),
  cancelPayment: vi.fn(),
  createDelivery: vi.fn(),
  cancelDelivery: vi.fn(),
}));

vi.mock("@/lib/square", () => ({
  authorizeSquarePayment: providerMocks.authorize,
  completeSquarePayment: providerMocks.complete,
  cancelSquarePayment: providerMocks.cancelPayment,
}));

vi.mock("@/lib/uber-direct", () => ({
  createUberDelivery: providerMocks.createDelivery,
  cancelUberDelivery: providerMocks.cancelDelivery,
}));

const address = {
  street1: "123 Market St",
  street2: "",
  city: "San Jose",
  state: "CA",
  postalCode: "95113",
  country: "US" as const,
};
const customer = {
  firstName: "Ana",
  lastName: "Gomez",
  phone: "+14085550123",
  email: "ana@example.com",
};

function checkoutToken() {
  const cart = [{ itemId: "cholado-sencillo", quantity: 1 }];
  const amounts = calculateAmounts(validateCart(cart)!, 799);
  return signCheckoutToken({
    ...amounts,
    quoteId: "dqt_1",
    expiresAt: Date.now() + 60_000,
    address,
    customer,
    lines: cart,
  });
}

function paymentRequest(token: string, suffix: string) {
  return new Request("http://localhost/api/checkout/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${suffix}` },
    body: JSON.stringify({
      sourceId: "cnon:test-token",
      checkoutToken: token,
      idempotencyKey: `checkoutidempotencykey${suffix.padStart(3, "0")}`,
    }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CHECKOUT_SIGNING_SECRET", "test-signing-secret-with-at-least-32-chars");
  vi.stubEnv("CHECKOUT_TAX_RATE_BPS", "0");
  vi.stubEnv("SQUARE_APPLICATION_ID", "square-app");
  vi.stubEnv("SQUARE_LOCATION_ID", "square-location");
  vi.stubEnv("SQUARE_ACCESS_TOKEN", "square-token");
  vi.stubEnv("UBER_DIRECT_CLIENT_ID", "uber-client");
  vi.stubEnv("UBER_DIRECT_CLIENT_SECRET", "uber-secret");
  vi.stubEnv("UBER_DIRECT_CUSTOMER_ID", "uber-customer");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("checkout payment orchestration", () => {
  it("authorizes, creates delivery, then captures in that order", async () => {
    const sequence: string[] = [];
    providerMocks.authorize.mockImplementation(async () => {
      sequence.push("authorize");
      return { id: "pay_1" };
    });
    providerMocks.createDelivery.mockImplementation(async () => {
      sequence.push("delivery");
      return { id: "del_1", trackingUrl: "https://uber.test/track" };
    });
    providerMocks.complete.mockImplementation(async () => {
      sequence.push("capture");
      return { id: "pay_1", receiptUrl: "https://square.test/receipt" };
    });
    const { POST } = await import("@/app/api/checkout/pay/route");
    const response = await POST(paymentRequest(checkoutToken(), "1"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(expect.objectContaining({
      paymentId: "pay_1",
      deliveryId: "del_1",
    }));
    expect(sequence).toEqual(["authorize", "delivery", "capture"]);
  });

  it("voids the Square authorization when Uber rejects delivery creation", async () => {
    providerMocks.authorize.mockResolvedValue({ id: "pay_2" });
    providerMocks.createDelivery.mockRejectedValue(new Error("address undeliverable"));
    providerMocks.cancelPayment.mockResolvedValue(undefined);
    const { POST } = await import("@/app/api/checkout/pay/route");
    const response = await POST(paymentRequest(checkoutToken(), "2"));
    expect(response.status).toBe(502);
    expect(providerMocks.cancelPayment).toHaveBeenCalledWith("pay_2");
    expect(providerMocks.complete).not.toHaveBeenCalled();
    expect(providerMocks.cancelDelivery).not.toHaveBeenCalled();
  });

  it("cancels both sides when capture is definitively rejected", async () => {
    providerMocks.authorize.mockResolvedValue({ id: "pay_3" });
    providerMocks.createDelivery.mockResolvedValue({ id: "del_3" });
    providerMocks.complete.mockRejectedValue(new Error("capture rejected"));
    providerMocks.cancelDelivery.mockResolvedValue(undefined);
    providerMocks.cancelPayment.mockResolvedValue(undefined);
    const { POST } = await import("@/app/api/checkout/pay/route");
    const response = await POST(paymentRequest(checkoutToken(), "3"));
    expect(response.status).toBe(502);
    expect(providerMocks.cancelDelivery).toHaveBeenCalledWith("del_3");
    expect(providerMocks.cancelPayment).toHaveBeenCalledWith("pay_3");
  });
});
