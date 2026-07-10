import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/webhooks/uber/route";

const signingKey = "uber-webhook-test-signing-key";

function webhookRequest(body: string, signature?: string) {
  return new Request("http://localhost/api/webhooks/uber", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(signature ? { "x-uber-signature": signature } : {}),
    },
    body,
  });
}

beforeEach(() => {
  vi.stubEnv("UBER_WEBHOOK_SIGNING_KEY", signingKey);
  vi.spyOn(console, "info").mockImplementation(() => undefined);
});

describe("Uber webhook authentication", () => {
  it("accepts an authentic signature over the untouched raw body", async () => {
    const body = JSON.stringify({ id: "evt_authentic", kind: "event.delivery_status", status: "pickup" });
    const signature = createHmac("sha256", signingKey).update(body).digest("hex");
    const response = await POST(webhookRequest(body, signature));
    expect(response.status).toBe(204);
  });

  it("rejects a modified payload", async () => {
    const original = JSON.stringify({ id: "evt_modified", status: "pickup" });
    const signature = createHmac("sha256", signingKey).update(original).digest("hex");
    const response = await POST(webhookRequest(original.replace("pickup", "delivered"), signature));
    expect(response.status).toBe(401);
  });

  it("fails closed when the signing key is missing", async () => {
    vi.stubEnv("UBER_WEBHOOK_SIGNING_KEY", "");
    const response = await POST(webhookRequest("{}"));
    expect(response.status).toBe(503);
  });
});
