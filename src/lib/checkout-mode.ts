import "server-only";

export function checkoutMode() {
  const squareReady = Boolean(
    process.env.SQUARE_APPLICATION_ID &&
      process.env.SQUARE_LOCATION_ID &&
      process.env.SQUARE_ACCESS_TOKEN &&
      process.env.CHECKOUT_SIGNING_SECRET
  );
  const demo =
    process.env.NODE_ENV !== "production" &&
    (process.env.CHECKOUT_DEMO_MODE === "true" || !squareReady);
  return { demo, squareReady };
}
