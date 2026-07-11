import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getItemById } from "@/data/menu";
import type { CartLine, CheckoutAmounts, CheckoutCustomer } from "@/lib/checkout-types";
import { checkoutMode } from "@/lib/checkout-mode";

const MAX_LINES = 40;
const MAX_QUANTITY = 20;

export interface ValidatedLine extends CartLine {
  name: string;
  priceCents: number;
}

export interface CheckoutTokenPayload extends CheckoutAmounts {
  expiresAt: number;
  customer: CheckoutCustomer;
  lines: CartLine[];
}

function cleanString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateCart(value: unknown): ValidatedLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_LINES) return null;
  const combined = new Map<string, number>();
  for (const raw of value) {
    if (typeof raw !== "object" || raw === null) return null;
    const line = raw as Record<string, unknown>;
    const itemId = cleanString(line.itemId, 100);
    const quantity = Number(line.quantity);
    if (!itemId || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null;
    const next = (combined.get(itemId) ?? 0) + quantity;
    if (next > MAX_QUANTITY) return null;
    combined.set(itemId, next);
  }
  const lines: ValidatedLine[] = [];
  for (const [itemId, quantity] of combined) {
    const item = getItemById(itemId);
    if (!item?.isAvailable) return null;
    lines.push({ itemId, quantity, name: item.nameEn, priceCents: item.priceCents });
  }
  return lines;
}

export function validateCustomer(value: unknown): CheckoutCustomer | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;
  const customer: CheckoutCustomer = {
    firstName: cleanString(raw.firstName, 50),
    lastName: cleanString(raw.lastName, 50),
    phone: cleanString(raw.phone, 30),
    email: cleanString(raw.email, 100).toLowerCase(),
  };
  if (
    !customer.firstName ||
    !customer.lastName ||
    !/^\+?[0-9 ()-]{10,20}$/.test(customer.phone) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
  ) return null;
  return customer;
}

export function calculateAmounts(lines: ValidatedLine[]): CheckoutAmounts {
  const subtotalCents = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);
  const taxRateBps = Math.max(0, Math.min(10_000, Number(process.env.CHECKOUT_TAX_RATE_BPS) || 0));
  const taxCents = Math.round((subtotalCents * taxRateBps) / 10_000);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}

function signingSecret(): string {
  const secret = process.env.CHECKOUT_SIGNING_SECRET;
  if (!secret && checkoutMode().demo) return "rancholados-local-demo-signing-secret-only";
  if (!secret || secret.length < 32) throw new Error("Checkout signing secret is not configured");
  return secret;
}

export function signCheckoutToken(payload: CheckoutTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", signingSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyCheckoutToken(token: unknown): CheckoutTokenPayload | null {
  if (typeof token !== "string" || token.length > 8_000) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra) return null;
  const expected = createHmac("sha256", signingSecret()).update(body).digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof parsed?.expiresAt !== "number" || parsed.expiresAt <= Date.now()) return null;
    const lines = validateCart(parsed.lines);
    const customer = validateCustomer(parsed.customer);
    if (!lines || !customer) return null;
    const amounts = calculateAmounts(lines);
    if (
      amounts.subtotalCents !== parsed.subtotalCents ||
      amounts.taxCents !== parsed.taxCents ||
      amounts.totalCents !== parsed.totalCents
    ) return null;
    return { ...parsed, customer, lines: lines.map(({ itemId, quantity }) => ({ itemId, quantity })) };
  } catch {
    return null;
  }
}
