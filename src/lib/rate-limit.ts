import "server-only";

const windows = new Map<string, { count: number; startedAt: number }>();

export function rateLimit(request: Request, bucket: string, limit: number, windowMs = 5 * 60_000) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const current = windows.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    windows.set(key, { count: 1, startedAt: now });
    return false;
  }
  current.count += 1;
  if (windows.size > 2_000) {
    for (const [storedKey, value] of windows) {
      if (now - value.startedAt >= windowMs) windows.delete(storedKey);
    }
  }
  return current.count > limit;
}
