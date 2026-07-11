import "server-only";

const SQUARE_VERSION = "2026-05-20";

function config() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const environment = process.env.SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";
  if (!accessToken || !locationId) throw new Error("Square is not configured");
  return {
    accessToken,
    locationId,
    baseUrl: environment === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com",
  };
}

export async function takeSquarePayment(input: {
  sourceId: string;
  idempotencyKey: string;
  amountCents: number;
  referenceId: string;
  email: string;
  note: string;
}) {
  const { accessToken, locationId, baseUrl } = config();
  const response = await fetch(`${baseUrl}/v2/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_id: input.sourceId,
      idempotency_key: input.idempotencyKey,
      amount_money: { amount: input.amountCents, currency: "USD" },
      autocomplete: true,
      location_id: locationId,
      reference_id: input.referenceId.slice(0, 40),
      buyer_email_address: input.email,
      note: `Pickup | ${input.note}`.slice(0, 500),
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.errors?.[0]?.detail || data?.errors?.[0]?.code || `Square API ${response.status}`;
    throw new Error(String(detail));
  }
  if (typeof data?.payment?.id !== "string" || data.payment.status !== "COMPLETED") {
    throw new Error("Square did not complete the payment");
  }
  return {
    id: data.payment.id as string,
    receiptUrl: data.payment.receipt_url as string | undefined,
  };
}
