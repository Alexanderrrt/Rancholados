import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculateAmounts, signCheckoutToken, validateCart } from "@/lib/checkout-server";

const squareMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/square", () => ({ takeSquarePayment: squareMock }));

const customer = {
  firstName: "Ana",
  lastName: "Gomez",
  phone: "+14085550123",
  email: "ana@example.com",
};

function checkoutToken() {
  const cart = [{ itemId: "cholado-sencillo", quantity: 1 }];
  return signCheckoutToken({
    ...calculateAmounts(validateCart(cart)!),
    expiresAt: Date.now() + 60_000,
    customer,
    lines: cart,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("CHECKOUT_SIGNING_SECRET", "test-signing-secret-with-at-least-32-chars");
  vi.stubEnv("CHECKOUT_TAX_RATE_BPS", "0");
  vi.stubEnv("SQUARE_APPLICATION_ID", "square-app");
  vi.stubEnv("SQUARE_LOCATION_ID", "square-location");
  vi.stubEnv("SQUARE_ACCESS_TOKEN", "square-token");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("pickup payment route", () => {
  it("passes only signed server totals to Square", async () => {
    squareMock.mockResolvedValue({ id: "pay_1", receiptUrl: "https://square.test/receipt" });
    const { POST } = await import("@/app/api/checkout/pay/route");
    const response = await POST(
      new Request("http://localhost/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.2.0.1" },
        body: JSON.stringify({
          sourceId: "cnon:test",
          checkoutToken: checkoutToken(),
          idempotencyKey: "pickupcheckoutkey123456789",
          amountCents: 1,
        }),
      })
    );
    expect(response.status).toBe(200);
    expect(squareMock).toHaveBeenCalledWith(
      expect.objectContaining({ amountCents: 1600, note: "1x Cholado" })
    );
  });

  it("fails closed when Square rejects payment", async () => {
    squareMock.mockRejectedValue(new Error("declined"));
    const { POST } = await import("@/app/api/checkout/pay/route");
    const response = await POST(
      new Request("http://localhost/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.2.0.2" },
        body: JSON.stringify({
          sourceId: "cnon:test",
          checkoutToken: checkoutToken(),
          idempotencyKey: "pickupcheckoutkey987654321",
        }),
      })
    );
    expect(response.status).toBe(502);
  });
});
