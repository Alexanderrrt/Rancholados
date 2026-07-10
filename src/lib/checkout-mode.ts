import "server-only";

export function checkoutMode() {
  const squareReady = Boolean(
    process.env.SQUARE_APPLICATION_ID &&
      process.env.SQUARE_LOCATION_ID &&
      process.env.SQUARE_ACCESS_TOKEN
  );
  const uberReady = Boolean(
    process.env.UBER_DIRECT_CLIENT_ID &&
      process.env.UBER_DIRECT_CLIENT_SECRET &&
      process.env.UBER_DIRECT_CUSTOMER_ID &&
      process.env.CHECKOUT_SIGNING_SECRET
  );
  const demo =
    process.env.NODE_ENV !== "production" &&
    (process.env.CHECKOUT_DEMO_MODE === "true" || (!squareReady && !uberReady));
  return { demo, squareReady, uberReady };
}
