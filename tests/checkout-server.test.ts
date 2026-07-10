import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateAmounts,
  signCheckoutToken,
  validateAddress,
  validateCart,
  validateCustomer,
  verifyCheckoutToken,
} from "@/lib/checkout-server";

const address = {
  street1: "123 Market St",
  street2: "Apt 4",
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

beforeEach(() => {
  vi.stubEnv("CHECKOUT_SIGNING_SECRET", "test-signing-secret-with-at-least-32-chars");
  vi.stubEnv("CHECKOUT_TAX_RATE_BPS", "900");
});

describe("checkout validation and signing", () => {
  it("uses authoritative menu prices and rejects invalid quantities", () => {
    const lines = validateCart([{ itemId: "cholado-sencillo", quantity: 2 }]);
    expect(lines).toEqual([
      expect.objectContaining({ itemId: "cholado-sencillo", quantity: 2, priceCents: 1600 }),
    ]);
    expect(validateCart([{ itemId: "cholado-sencillo", quantity: 0 }])).toBeNull();
    expect(validateCart([{ itemId: "not-on-menu", quantity: 1 }])).toBeNull();
  });

  it("requires a complete US address and valid contact", () => {
    expect(validateAddress(address)).toEqual(address);
    expect(validateAddress({ ...address, postalCode: "bad" })).toBeNull();
    expect(validateCustomer(customer)).toEqual(customer);
    expect(validateCustomer({ ...customer, email: "bad" })).toBeNull();
  });

  it("signs quote totals and rejects tampering", () => {
    const lines = validateCart([{ itemId: "cholado-sencillo", quantity: 2 }])!;
    const amounts = calculateAmounts(lines, 799);
    expect(amounts).toEqual({
      subtotalCents: 3200,
      taxCents: 288,
      deliveryFeeCents: 799,
      totalCents: 4287,
    });
    const token = signCheckoutToken({
      ...amounts,
      quoteId: "dqt_test",
      expiresAt: Date.now() + 60_000,
      address,
      customer,
      lines: [{ itemId: "cholado-sencillo", quantity: 2 }],
    });
    expect(verifyCheckoutToken(token)).toEqual(expect.objectContaining(amounts));
    expect(verifyCheckoutToken(`${token.slice(0, -1)}x`)).toBeNull();
  });
});
