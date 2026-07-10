import "server-only";

import type { CheckoutAddress, CheckoutCustomer } from "@/lib/checkout-types";
import type { ValidatedLine } from "@/lib/checkout-server";
import { addressToUber } from "@/lib/checkout-server";

const API_BASE = "https://api.uber.com/v1/customers";
let cachedToken: { value: string; expiresAt: number } | null = null;

function credentials() {
  const clientId = process.env.UBER_DIRECT_CLIENT_ID;
  const clientSecret = process.env.UBER_DIRECT_CLIENT_SECRET;
  const customerId = process.env.UBER_DIRECT_CUSTOMER_ID;
  if (!clientId || !clientSecret || !customerId) throw new Error("Uber Direct is not configured");
  return { clientId, clientSecret, customerId };
}

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const { clientId, clientSecret } = credentials();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "eats.deliveries",
  });
  const response = await fetch("https://auth.uber.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error(`Uber authentication failed (${response.status})`);
  }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in) || 3600) * 1000,
  };
  return cachedToken.value;
}

async function uberRequest(path: string, body: unknown, method = "POST") {
  const { customerId } = credentials();
  const response = await fetch(`${API_BASE}/${encodeURIComponent(customerId)}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || data?.code || `Uber API ${response.status}`;
    throw new Error(String(message));
  }
  return data;
}

function pickupAddress(): CheckoutAddress {
  return {
    street1: process.env.UBER_PICKUP_STREET_1 || "1075 Tully Rd",
    street2: process.env.UBER_PICKUP_STREET_2 || "Suite 24",
    city: process.env.UBER_PICKUP_CITY || "San Jose",
    state: process.env.UBER_PICKUP_STATE || "CA",
    postalCode: process.env.UBER_PICKUP_POSTAL_CODE || "95122",
    country: "US",
  };
}

export async function createDeliveryQuote(dropoff: CheckoutAddress) {
  const data = await uberRequest("/delivery_quotes", {
    pickup_address: addressToUber(pickupAddress()),
    dropoff_address: addressToUber(dropoff),
  });
  const fee = Number(data.fee);
  if (typeof data.id !== "string" || !Number.isSafeInteger(fee) || fee < 0) {
    throw new Error("Uber returned an invalid quote");
  }
  const expiresAt = Date.parse(data.expires || "");
  return {
    id: data.id as string,
    feeCents: fee,
    expiresAt: Number.isFinite(expiresAt) ? expiresAt : Date.now() + 15 * 60_000,
  };
}

export async function createUberDelivery(input: {
  quoteId: string;
  address: CheckoutAddress;
  customer: CheckoutCustomer;
  lines: ValidatedLine[];
  externalId: string;
}) {
  const pickup = pickupAddress();
  const data = await uberRequest("/deliveries", {
    quote_id: input.quoteId,
    pickup_name: "Rancholados",
    pickup_address: addressToUber(pickup),
    pickup_phone_number: process.env.UBER_PICKUP_PHONE || "+14087975538",
    pickup_notes: process.env.UBER_PICKUP_NOTES || "Pickup at Rancholados counter.",
    dropoff_name: `${input.customer.firstName} ${input.customer.lastName}`,
    dropoff_address: addressToUber(input.address),
    dropoff_phone_number: input.customer.phone,
    dropoff_notes: "Deliver to the confirmed address. Contact recipient if needed.",
    idempotency_key: input.externalId,
    external_id: input.externalId,
    manifest_reference: input.externalId.slice(0, 64),
    manifest_total_value: input.lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0),
    manifest_items: input.lines.map((line) => ({
      name: line.name.slice(0, 100),
      quantity: line.quantity,
      price: line.priceCents,
    })),
  });
  if (typeof data.id !== "string") throw new Error("Uber did not return a delivery ID");
  return { id: data.id as string, trackingUrl: data.tracking_url as string | undefined };
}

export async function cancelUberDelivery(deliveryId: string) {
  await uberRequest(`/deliveries/${encodeURIComponent(deliveryId)}/cancel`, {}, "POST");
}
