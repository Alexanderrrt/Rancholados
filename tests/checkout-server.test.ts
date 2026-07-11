import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateAmounts,
  signCheckoutToken,
  validateCart,
  validateCustomer,
  verifyCheckoutToken,
} from "@/lib/checkout-server";

const customer = {
  firstName: "Ana",
  lastName: "Gomez",
  phone: "+14085550123",
  email: "ana@example.com",
};

beforeEach(() => {
  vi.stubEnv("CHECKOUT_SIGNING_SECRET", "test-signing-secret-with-at-least-32-chars");
  vi.stubEnv("CHECKOUT_TAX_RATE_BPS", "900");
});

describe("pickup checkout validation and signing", () => {
  it("uses authoritative menu prices and rejects invalid quantities", () => {
    const lines = validateCart([{ itemId: "cholado-sencillo", quantity: 2 }]);
    expect(lines).toEqual([
      expect.objectContaining({ itemId: "cholado-sencillo", quantity: 2, priceCents: 1600 }),
    ]);
    expect(validateCart([{ itemId: "cholado-sencillo", quantity: 0 }])).toBeNull();
    expect(validateCart([{ itemId: "not-on-menu", quantity: 1 }])).toBeNull();
  });

  it("requires valid pickup contact details", () => {
    expect(validateCustomer(customer)).toEqual(customer);
    expect(validateCustomer({ ...customer, email: "bad" })).toBeNull();
  });

  it("signs pickup totals and rejects tampering", () => {
    const lines = validateCart([{ itemId: "cholado-sencillo", quantity: 2 }])!;
    const amounts = calculateAmounts(lines);
    expect(amounts).toEqual({ subtotalCents: 3200, taxCents: 288, totalCents: 3488 });
    const token = signCheckoutToken({
      ...amounts,
      expiresAt: Date.now() + 60_000,
      customer,
      lines: [{ itemId: "cholado-sencillo", quantity: 2 }],
    });
    expect(verifyCheckoutToken(token)).toEqual(expect.objectContaining(amounts));
    expect(verifyCheckoutToken(`${token.slice(0, -1)}x`)).toBeNull();
  });
});
