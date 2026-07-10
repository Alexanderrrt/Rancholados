import type { CheckoutConfig } from "@/lib/checkout-types";
import { checkoutMode } from "@/lib/checkout-mode";

export const dynamic = "force-dynamic";

export async function GET() {
  const production = process.env.SQUARE_ENVIRONMENT === "production";
  const mode = checkoutMode();
  const config: CheckoutConfig = {
    demoMode: mode.demo,
    squareEnabled: mode.squareReady,
    deliveryEnabled: mode.uberReady,
    squareApplicationId: process.env.SQUARE_APPLICATION_ID || "",
    squareLocationId: process.env.SQUARE_LOCATION_ID || "",
    squareScriptUrl: production
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js",
  };
  return Response.json(config, {
    headers: { "Cache-Control": "no-store" },
  });
}
