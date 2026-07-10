import { createHmac, timingSafeEqual } from "node:crypto";

const processedEvents = new Map<string, number>();
const MAX_BODY_BYTES = 256_000;

function signatureMatches(rawBody: string, supplied: string, signingKey: string) {
  if (!/^[a-f0-9]{64}$/i.test(supplied)) return false;
  const expected = createHmac("sha256", signingKey).update(rawBody, "utf8").digest();
  const received = Buffer.from(supplied, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

function eventIdentity(payload: Record<string, unknown>) {
  const id = payload.id ?? payload.event_id;
  return typeof id === "string" ? id.slice(0, 200) : null;
}

export async function POST(request: Request) {
  const signingKey = process.env.UBER_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    return Response.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return Response.json({ error: "payload_too_large" }, { status: 413 });
  }
  const suppliedSignature =
    request.headers.get("x-uber-signature") ||
    request.headers.get("x-postmates-signature") ||
    "";
  if (!signatureMatches(rawBody, suppliedSignature, signingKey)) {
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const eventId = eventIdentity(payload);
  if (eventId && processedEvents.has(eventId)) return new Response(null, { status: 204 });
  if (eventId) processedEvents.set(eventId, Date.now());
  if (processedEvents.size > 2_000) {
    const cutoff = Date.now() - 24 * 60 * 60_000;
    for (const [id, receivedAt] of processedEvents) {
      if (receivedAt < cutoff) processedEvents.delete(id);
    }
  }

  const data =
    typeof payload.data === "object" && payload.data !== null
      ? (payload.data as Record<string, unknown>)
      : null;
  console.info("Uber Direct webhook", {
    eventId,
    kind: payload.kind ?? payload.event_type ?? null,
    deliveryId: payload.delivery_id ?? data?.id ?? null,
    status: payload.status ?? data?.status ?? null,
    liveMode: payload.live_mode ?? null,
  });
  return new Response(null, { status: 204 });
}
