"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { formatPrice, getItemById } from "@/data/menu";
import type {
  CheckoutAddress,
  CheckoutConfig,
  CheckoutCustomer,
  CheckoutQuoteResponse,
} from "@/lib/checkout-types";
import { useCart } from "./CartProvider";

type TokenResult = { status: string; token?: string; errors?: Array<{ message?: string }> };
type SquareMethod = { tokenize: (details?: unknown) => Promise<TokenResult>; attach?: (selector: string) => Promise<void>; destroy?: () => Promise<boolean> };
type SquarePayments = {
  card: () => Promise<SquareMethod>;
  applePay: (request: unknown) => Promise<SquareMethod>;
  paymentRequest: (options: unknown) => unknown;
  setLocale: (locale: string) => Promise<unknown>;
};

declare global {
  interface Window {
    Square?: { payments: (applicationId: string, locationId: string) => SquarePayments };
  }
}

const ADDRESS_KEY = "rancholados-checkout-address-v1";
const CUSTOMER_KEY = "rancholados-checkout-customer-v1";
const EMPTY_ADDRESS: CheckoutAddress = {
  street1: "",
  street2: "",
  city: "San Jose",
  state: "CA",
  postalCode: "",
  country: "US",
};
const EMPTY_CUSTOMER: CheckoutCustomer = { firstName: "", lastName: "", phone: "", email: "" };

function readPrefill<T>(key: string, fallback: T): T {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") };
  } catch {
    return fallback;
  }
}

function addressLabel(address: CheckoutAddress) {
  return [address.street1, address.street2, `${address.city}, ${address.state} ${address.postalCode}`]
    .filter(Boolean)
    .join(", ");
}

export default function CheckoutClient() {
  const locale = useLocale();
  const isEs = locale === "es";
  const { lines, hydrated, setQuantity, removeItem, clear } = useCart();
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [address, setAddress] = useState<CheckoutAddress>(EMPTY_ADDRESS);
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY_CUSTOMER);
  const [quote, setQuote] = useState<CheckoutQuoteResponse | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [applePayReady, setApplePayReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [success, setSuccess] = useState<{ orderId: string; trackingUrl?: string; receiptUrl?: string; demo?: boolean } | null>(null);
  const cardRef = useRef<SquareMethod | null>(null);
  const applePayRef = useRef<SquareMethod | null>(null);
  const paymentAttemptRef = useRef<string | null>(null);

  const displayLines = useMemo(
    () => lines.map((line) => ({ ...line, item: getItemById(line.itemId) })).filter((line) => line.item),
    [lines]
  );
  const estimatedSubtotal = displayLines.reduce(
    (sum, line) => sum + line.item!.priceCents * line.quantity,
    0
  );

  useEffect(() => {
    queueMicrotask(() => {
      setAddress(readPrefill(ADDRESS_KEY, EMPTY_ADDRESS));
      setCustomer(readPrefill(CUSTOMER_KEY, EMPTY_CUSTOMER));
    });
    fetch("/api/checkout/config", { cache: "no-store" })
      .then((response) => response.json())
      .then(setConfig)
      .catch(() => setError(isEs ? "No se pudo cargar el pago." : "Payment could not be loaded."));
  }, [isEs]);

  useEffect(() => {
    queueMicrotask(() => {
      setQuote(null);
      setApplePayReady(false);
      setCardReady(false);
    });
    cardRef.current?.destroy?.().catch(() => undefined);
    applePayRef.current?.destroy?.().catch(() => undefined);
    cardRef.current = null;
    applePayRef.current = null;
    const cardHost = document.getElementById("square-card");
    if (cardHost) cardHost.innerHTML = "";
  }, [address, customer, lines]);

  useEffect(() => {
    if (!quote || !scriptReady || !config?.squareEnabled || !window.Square) return;
    let cancelled = false;
    async function initializeSquare() {
      const payments = window.Square!.payments(config!.squareApplicationId, config!.squareLocationId);
      await payments.setLocale(isEs ? "es-US" : "en-US");
      const card = await payments.card();
      if (cancelled) return;
      await card.attach?.("#square-card");
      cardRef.current = card;
      setCardReady(true);
      const request = payments.paymentRequest({
        countryCode: "US",
        currencyCode: "USD",
        total: { amount: (quote!.totalCents / 100).toFixed(2), label: "Rancholados" },
      });
      try {
        const applePay = await payments.applePay(request);
        if (!cancelled) {
          applePayRef.current = applePay;
          setApplePayReady(true);
        }
      } catch {
        setApplePayReady(false);
      }
    }
    initializeSquare().catch(() => setError(isEs ? "No se pudo iniciar Square." : "Square could not be initialized."));
    return () => {
      cancelled = true;
    };
  }, [quote, scriptReady, config, isEs]);

  async function confirmAddress() {
    setQuoting(true);
    setError("");
    try {
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, address, customer }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "quote_failed");
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
      setQuote(data);
      paymentAttemptRef.current = null;
    } catch {
      setError(
        isEs
          ? "Uber no pudo confirmar esa dirección. Revísala e inténtalo otra vez."
          : "Uber could not confirm that address. Check it and try again."
      );
    } finally {
      setQuoting(false);
    }
  }

  async function submitPayment(method: SquareMethod | null, kind: "card" | "apple") {
    if (!method || !quote || paying) return;
    setPaying(true);
    setError("");
    try {
      const tokenResult = await method.tokenize(
        kind === "card"
          ? {
              amount: (quote.totalCents / 100).toFixed(2),
              currencyCode: "USD",
              intent: "CHARGE",
              customerInitiated: true,
              sellerKeyedIn: false,
              billingContact: {
                givenName: customer.firstName,
                familyName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                addressLines: [address.street1, address.street2].filter(Boolean),
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                countryCode: "US",
              },
            }
          : undefined
      );
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(tokenResult.errors?.[0]?.message || "tokenization_failed");
      }
      const idempotencyKey =
        paymentAttemptRef.current || crypto.randomUUID().replace(/-/g, "");
      paymentAttemptRef.current = idempotencyKey;
      const response = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          checkoutToken: quote.checkoutToken,
          idempotencyKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "payment_failed");
      clear();
      setSuccess(data);
    } catch (paymentError) {
      console.error(paymentError);
      setError(
        isEs
          ? "No se pudo completar el pedido. No se finalizó ningún cobro. Inténtalo de nuevo."
          : "The order could not be completed. No charge was finalized. Please try again."
      );
    } finally {
      setPaying(false);
    }
  }

  async function submitDemoPayment() {
    if (!quote || paying) return;
    setPaying(true);
    setError("");
    try {
      const idempotencyKey =
        paymentAttemptRef.current || crypto.randomUUID().replace(/-/g, "");
      paymentAttemptRef.current = idempotencyKey;
      const response = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: "demo-payment-source",
          checkoutToken: quote.checkoutToken,
          idempotencyKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "demo_checkout_failed");
      clear();
      setSuccess(data);
    } catch {
      setError(isEs ? "No se pudo completar el pedido de demostración." : "The demo order could not be completed.");
    } finally {
      setPaying(false);
    }
  }

  function payWithCard() {
    void submitPayment(cardRef.current, "card");
  }

  function payWithApplePay() {
    void submitPayment(applePayRef.current, "apple");
  }

  function unlockAddress() {
    setQuote(null);
    setCardReady(false);
    setApplePayReady(false);
    paymentAttemptRef.current = null;
    cardRef.current?.destroy?.().catch(() => undefined);
    applePayRef.current?.destroy?.().catch(() => undefined);
    cardRef.current = null;
    applePayRef.current = null;
  }

  if (!hydrated) return <div className="min-h-[50vh]" />;

  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-verde-cali/20 bg-blanco p-8 shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-verde-cali text-3xl text-white">✓</div>
          <h1 className="font-heading text-4xl font-extrabold text-chocolate">
            {isEs ? "¡Pedido confirmado!" : "Order confirmed!"}
          </h1>
          <p className="mt-3 font-body text-chocolate/65">
            {success.demo
              ? isEs
                ? "Demostración completada. No se cobró dinero ni se pidió un conductor."
                : "Demo completed. No money was charged and no courier was requested."
              : isEs
                ? "Tu pago fue aprobado y Uber Direct recibió la entrega."
                : "Your payment was approved and Uber Direct received the delivery."}
          </p>
          <p className="mt-2 font-body text-sm font-bold text-chocolate/50">#{success.orderId}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {success.trackingUrl && <a className="rounded-full bg-chocolate px-6 py-3 font-bold text-white" href={success.trackingUrl} target="_blank" rel="noreferrer">{isEs ? "Seguir entrega" : "Track delivery"}</a>}
            {success.receiptUrl && <a className="rounded-full border border-chocolate/15 px-6 py-3 font-bold text-chocolate" href={success.receiptUrl} target="_blank" rel="noreferrer">{isEs ? "Ver recibo" : "View receipt"}</a>}
          </div>
        </div>
      </section>
    );
  }

  if (displayLines.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-chocolate">{isEs ? "Tu carrito está vacío" : "Your cart is empty"}</h1>
        <Link href="/menu" className="mt-6 inline-flex rounded-full bg-rosa-fuerte px-7 py-3 font-bold text-white">{isEs ? "Ver menú" : "View menu"}</Link>
      </section>
    );
  }

  const inputClass = "w-full rounded-xl border border-chocolate/15 bg-crema/50 px-4 py-3 font-body text-sm text-chocolate outline-none focus:border-rosa-fuerte disabled:opacity-65";
  return (
    <>
      {config?.squareEnabled && config.squareScriptUrl && <Script src={config.squareScriptUrl} strategy="afterInteractive" onReady={() => setScriptReady(true)} onError={() => setError(isEs ? "No se pudo cargar Square." : "Square failed to load.")} />}
      <section className="bg-crema py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <p className="sec-eyebrow font-body" data-num="01">{isEs ? "Entrega segura" : "Secure delivery"}</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold text-chocolate md:text-5xl">{isEs ? "Finalizar pedido" : "Checkout"}</h1>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm">
                <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Contacto" : "Contact"}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input disabled={!!quote} className={inputClass} placeholder={isEs ? "Nombre" : "First name"} value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} autoComplete="given-name" />
                  <input disabled={!!quote} className={inputClass} placeholder={isEs ? "Apellido" : "Last name"} value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} autoComplete="family-name" />
                  <input disabled={!!quote} className={inputClass} placeholder={isEs ? "Teléfono" : "Phone"} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} autoComplete="tel" />
                  <input disabled={!!quote} className={inputClass} placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} autoComplete="email" type="email" />
                </div>
              </div>
              <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Dirección de entrega" : "Delivery address"}</h2>
                  {quote && <span className="rounded-full bg-verde-cali/10 px-3 py-1 text-xs font-extrabold text-verde-cali">✓ {isEs ? "Confirmada" : "Confirmed"}</span>}
                </div>
                {quote ? (
                  <div className="mt-4 rounded-xl border border-verde-cali/20 bg-verde-cali/5 p-4">
                    <p className="font-body font-bold text-chocolate">{addressLabel(quote.confirmedAddress)}</p>
                    <button type="button" className="mt-2 text-sm font-bold text-rosa-fuerte" onClick={unlockAddress}>{isEs ? "Cambiar dirección" : "Change address"}</button>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input className={`${inputClass} sm:col-span-2`} placeholder={isEs ? "Calle y número" : "Street address"} value={address.street1} onChange={(e) => setAddress({ ...address, street1: e.target.value })} autoComplete="address-line1" />
                    <input className={`${inputClass} sm:col-span-2`} placeholder={isEs ? "Apto, unidad (opcional)" : "Apartment, unit (optional)"} value={address.street2} onChange={(e) => setAddress({ ...address, street2: e.target.value })} autoComplete="address-line2" />
                    <input className={inputClass} placeholder={isEs ? "Ciudad" : "City"} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} autoComplete="address-level2" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className={inputClass} placeholder={isEs ? "Estado" : "State"} maxLength={2} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })} autoComplete="address-level1" />
                      <input className={inputClass} placeholder="ZIP" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} autoComplete="postal-code" />
                    </div>
                  </div>
                )}
                {!quote && <button type="button" disabled={quoting || (!config?.deliveryEnabled && !config?.demoMode)} onClick={confirmAddress} className="mt-5 w-full rounded-full bg-chocolate px-6 py-3 font-body font-extrabold text-white disabled:opacity-40">{quoting ? (isEs ? "Confirmando…" : "Confirming…") : (isEs ? "Confirmar dirección y tarifa" : "Confirm address & fee")}</button>}
              </div>
              {quote && (
                <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm">
                  <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Pago" : "Payment"}</h2>
                  <p className="mt-1 text-sm text-chocolate/55">{isEs ? "Apple Pay usa únicamente la dirección confirmada arriba." : "Apple Pay uses only the confirmed address above."}</p>
                  {config?.demoMode ? (
                    <div className="mt-5 rounded-xl border border-dorado/30 bg-dorado/10 p-4">
                      <p className="text-sm font-bold text-chocolate">
                        {isEs ? "Modo demostración: no cobra ni solicita un conductor." : "Demo mode: no charge and no courier request."}
                      </p>
                      <button type="button" disabled={paying} onClick={submitDemoPayment} className="mt-4 w-full rounded-full bg-rosa-fuerte px-6 py-3.5 font-body font-extrabold text-white disabled:opacity-40">
                        {paying ? (isEs ? "Procesando…" : "Processing…") : `${isEs ? "Completar demo" : "Complete demo"} · ${formatPrice(quote.totalCents)}`}
                      </button>
                    </div>
                  ) : (
                    <>
                      {applePayReady && <button type="button" disabled={paying} onClick={payWithApplePay} className="apple-pay-button mt-5 w-full" aria-label="Apple Pay" />}
                      <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-chocolate/35"><span className="h-px flex-1 bg-chocolate/10" />{isEs ? "o tarjeta" : "or card"}<span className="h-px flex-1 bg-chocolate/10" /></div>
                      <div id="square-card" />
                      <button type="button" disabled={paying || !cardReady} onClick={payWithCard} className="mt-4 w-full rounded-full bg-rosa-fuerte px-6 py-3.5 font-body font-extrabold text-white disabled:opacity-40">{paying ? (isEs ? "Procesando…" : "Processing…") : `${isEs ? "Pagar" : "Pay"} ${formatPrice(quote.totalCents)}`}</button>
                    </>
                  )}
                </div>
              )}
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 font-body text-sm font-bold text-red-700">{error}</div>}
              {config && !config.demoMode && (!config.squareEnabled || !config.deliveryEnabled) && <div className="rounded-xl border border-dorado/30 bg-dorado/10 p-4 text-sm font-bold text-chocolate">{isEs ? "El checkout aún necesita las credenciales de Square y Uber Direct." : "Checkout still needs Square and Uber Direct credentials."}</div>}
            </div>
            <aside className="h-fit rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Tu pedido" : "Your order"}</h2>
              <div className="mt-5 divide-y divide-chocolate/10">
                {displayLines.map(({ itemId, quantity, item }) => <div key={itemId} className="flex gap-3 py-4"><div className="min-w-0 flex-1"><p className="font-heading font-extrabold text-chocolate">{isEs ? item!.nameEs : item!.nameEn}</p><p className="text-sm font-bold text-rosa-fuerte">{formatPrice(item!.priceCents * quantity)}</p></div><div className="flex items-center gap-2"><button aria-label="Decrease" onClick={() => setQuantity(itemId, quantity - 1)} className="h-8 w-8 rounded-full border border-chocolate/15">−</button><span className="w-5 text-center text-sm font-bold">{quantity}</span><button aria-label="Increase" onClick={() => setQuantity(itemId, quantity + 1)} className="h-8 w-8 rounded-full border border-chocolate/15">+</button><button aria-label="Remove" onClick={() => removeItem(itemId)} className="ml-1 text-sm text-chocolate/35 hover:text-red-600">×</button></div></div>)}
              </div>
              <div className="mt-4 space-y-2 border-t border-chocolate/10 pt-4 text-sm"><div className="flex justify-between"><span>{isEs ? "Subtotal" : "Subtotal"}</span><span>{formatPrice(quote?.subtotalCents ?? estimatedSubtotal)}</span></div><div className="flex justify-between"><span>{isEs ? "Impuestos" : "Tax"}</span><span>{quote ? formatPrice(quote.taxCents) : "—"}</span></div><div className="flex justify-between"><span>{isEs ? "Entrega Uber" : "Uber delivery"}</span><span>{quote ? formatPrice(quote.deliveryFeeCents) : "—"}</span></div><div className="flex justify-between border-t border-chocolate/10 pt-3 font-heading text-xl font-extrabold"><span>Total</span><span>{formatPrice(quote?.totalCents ?? estimatedSubtotal)}</span></div></div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
