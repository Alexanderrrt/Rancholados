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
    baseUrl: environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com",
  };
}

async function squareRequest(path: string, body?: unknown, method = "POST") {
  const { accessToken, baseUrl } = config();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data?.errors?.[0]?.detail || data?.errors?.[0]?.code || `Square API ${response.status}`;
    throw new Error(String(detail));
  }
  return data;
}

export async function authorizeSquarePayment(input: {
  sourceId: string;
  idempotencyKey: string;
  amountCents: number;
  referenceId: string;
  email: string;
  note: string;
  shippingAddress: {
    address_line_1: string;
    address_line_2?: string;
    locality: string;
    administrative_district_level_1: string;
    postal_code: string;
    country: "US";
  };
}) {
  const { locationId } = config();
  const data = await squareRequest("/v2/payments", {
    source_id: input.sourceId,
    idempotency_key: input.idempotencyKey,
    amount_money: { amount: input.amountCents, currency: "USD" },
    autocomplete: false,
    location_id: locationId,
    reference_id: input.referenceId.slice(0, 40),
    buyer_email_address: input.email,
    shipping_address: input.shippingAddress,
    note: input.note.slice(0, 500),
  });
  if (typeof data?.payment?.id !== "string" || data.payment.status !== "APPROVED") {
    throw new Error("Square did not approve the payment");
  }
  return { id: data.payment.id as string };
}

export async function completeSquarePayment(paymentId: string) {
  const data = await squareRequest(`/v2/payments/${encodeURIComponent(paymentId)}/complete`, {});
  if (data?.payment?.status !== "COMPLETED") throw new Error("Square did not complete the payment");
  return {
    id: data.payment.id as string,
    receiptUrl: data.payment.receipt_url as string | undefined,
  };
}

export async function cancelSquarePayment(paymentId: string) {
  await squareRequest(`/v2/payments/${encodeURIComponent(paymentId)}/cancel`, {});
}
