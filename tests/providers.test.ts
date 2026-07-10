import { beforeEach, describe, expect, it, vi } from "vitest";

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
  vi.resetModules();
  vi.stubEnv("SQUARE_ACCESS_TOKEN", "square-token");
  vi.stubEnv("SQUARE_LOCATION_ID", "location-id");
  vi.stubEnv("SQUARE_ENVIRONMENT", "sandbox");
  vi.stubEnv("UBER_DIRECT_CLIENT_ID", "uber-client");
  vi.stubEnv("UBER_DIRECT_CLIENT_SECRET", "uber-secret");
  vi.stubEnv("UBER_DIRECT_CUSTOMER_ID", "uber-customer");
});

describe("Square provider", () => {
  it("authorizes without capture and then completes the payment", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ payment: { id: "pay_1", status: "APPROVED" } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ payment: { id: "pay_1", status: "COMPLETED", receipt_url: "https://square.test/receipt" } }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { authorizeSquarePayment, completeSquarePayment } = await import("@/lib/square");
    await expect(authorizeSquarePayment({
      sourceId: "cnon:test",
      idempotencyKey: "12345678901234567890",
      amountCents: 2500,
      referenceId: "order-1",
      email: customer.email,
      note: "1x Cholado",
      shippingAddress: {
        address_line_1: address.street1,
        address_line_2: address.street2,
        locality: address.city,
        administrative_district_level_1: address.state,
        postal_code: address.postalCode,
        country: "US",
      },
    })).resolves.toEqual({ id: "pay_1" });
    const authorizationBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(authorizationBody).toEqual(expect.objectContaining({
      autocomplete: false,
      amount_money: { amount: 2500, currency: "USD" },
      location_id: "location-id",
    }));
    await expect(completeSquarePayment("pay_1")).resolves.toEqual({
      id: "pay_1",
      receiptUrl: "https://square.test/receipt",
    });
  });
});

describe("Uber Direct provider", () => {
  it("authenticates, quotes the confirmed address, and creates an idempotent delivery", async () => {
    const expires = new Date(Date.now() + 10 * 60_000).toISOString();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "uber-access", expires_in: 3600 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "dqt_1", fee: 799, expires }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "del_1", tracking_url: "https://uber.test/track" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { createDeliveryQuote, createUberDelivery } = await import("@/lib/uber-direct");
    await expect(createDeliveryQuote(address)).resolves.toEqual({
      id: "dqt_1",
      feeCents: 799,
      expiresAt: Date.parse(expires),
    });
    await expect(createUberDelivery({
      quoteId: "dqt_1",
      address,
      customer,
      externalId: "order-idempotency-key",
      lines: [{ itemId: "cholado-sencillo", quantity: 1, name: "Cholado", priceCents: 1600 }],
    })).resolves.toEqual({ id: "del_1", trackingUrl: "https://uber.test/track" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const deliveryBody = JSON.parse(fetchMock.mock.calls[2][1].body as string);
    expect(deliveryBody).toEqual(expect.objectContaining({
      quote_id: "dqt_1",
      idempotency_key: "order-idempotency-key",
      external_id: "order-idempotency-key",
      dropoff_address: JSON.stringify({
        street_address: ["123 Market St", "Apt 4"],
        city: "San Jose",
        state: "CA",
        zip_code: "95113",
        country: "US",
      }),
    }));
  });
});
