import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("SQUARE_ACCESS_TOKEN", "square-token");
  vi.stubEnv("SQUARE_LOCATION_ID", "location-id");
  vi.stubEnv("SQUARE_ENVIRONMENT", "sandbox");
});

describe("Square pickup payment provider", () => {
  it("completes a server-priced pickup payment", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          payment: {
            id: "pay_1",
            status: "COMPLETED",
            receipt_url: "https://square.test/receipt",
          },
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    const { takeSquarePayment } = await import("@/lib/square");
    await expect(
      takeSquarePayment({
        sourceId: "cnon:test",
        idempotencyKey: "12345678901234567890",
        amountCents: 2500,
        referenceId: "order-1",
        email: "ana@example.com",
        note: "1x Cholado",
      })
    ).resolves.toEqual({ id: "pay_1", receiptUrl: "https://square.test/receipt" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body).toEqual(
      expect.objectContaining({
        autocomplete: true,
        amount_money: { amount: 2500, currency: "USD" },
        location_id: "location-id",
        note: "Pickup | 1x Cholado",
      })
    );
    expect(body).not.toHaveProperty("shipping_address");
  });
});
