"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { formatPrice, getItemById } from "@/data/menu";
import type {
  CheckoutConfig,
  CheckoutCustomer,
  CheckoutPreparationResponse,
} from "@/lib/checkout-types";
import { useCart } from "./CartProvider";

type TokenResult = { status: string; token?: string; errors?: Array<{ message?: string }> };
type SquareMethod = {
  tokenize: (details?: unknown) => Promise<TokenResult>;
  attach?: (selector: string) => Promise<void>;
  destroy?: () => Promise<boolean>;
};
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

const CUSTOMER_KEY = "rancholados-checkout-customer-v1";
const EMPTY_CUSTOMER: CheckoutCustomer = { firstName: "", lastName: "", phone: "", email: "" };
const PICKUP_ADDRESS = "1075 Tully Rd, Suite 24, San Jose, CA 95122";

function readCustomer(): CheckoutCustomer {
  try {
    return { ...EMPTY_CUSTOMER, ...JSON.parse(localStorage.getItem(CUSTOMER_KEY) || "{}") };
  } catch {
    return EMPTY_CUSTOMER;
  }
}

export default function CheckoutClient() {
  const locale = useLocale();
  const isEs = locale === "es";
  const { lines, hydrated, setQuantity, removeItem, clear } = useCart();
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [customer, setCustomer] = useState<CheckoutCustomer>(EMPTY_CUSTOMER);
  const [prepared, setPrepared] = useState<CheckoutPreparationResponse | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [applePayReady, setApplePayReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [success, setSuccess] = useState<{
    orderId: string;
    receiptUrl?: string;
    demo?: boolean;
  } | null>(null);
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
    queueMicrotask(() => setCustomer(readCustomer()));
    fetch("/api/checkout/config", { cache: "no-store" })
      .then((response) => response.json())
      .then(setConfig)
      .catch(() => setError(isEs ? "No se pudo cargar el pago." : "Payment could not be loaded."));
  }, [isEs]);

  useEffect(() => {
    queueMicrotask(() => {
      setPrepared(null);
      setApplePayReady(false);
      setCardReady(false);
    });
    cardRef.current?.destroy?.().catch(() => undefined);
    applePayRef.current?.destroy?.().catch(() => undefined);
    cardRef.current = null;
    applePayRef.current = null;
    const cardHost = document.getElementById("square-card");
    if (cardHost) cardHost.innerHTML = "";
  }, [customer, lines]);

  useEffect(() => {
    if (!prepared || !scriptReady || !config?.squareEnabled || !window.Square) return;
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
        total: { amount: (prepared!.totalCents / 100).toFixed(2), label: "Rancholados pickup" },
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
  }, [prepared, scriptReady, config, isEs]);

  async function preparePickup() {
    setPreparing(true);
    setError("");
    try {
      const response = await fetch("/api/checkout/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, customer }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "prepare_failed");
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
      paymentAttemptRef.current = null;
      setPrepared(data);
    } catch {
      setError(isEs ? "Revisa tus datos e inténtalo otra vez." : "Check your details and try again.");
    } finally {
      setPreparing(false);
    }
  }

  async function sendPayment(sourceId: string) {
    if (!prepared) throw new Error("pickup_not_prepared");
    const idempotencyKey = paymentAttemptRef.current || crypto.randomUUID().replace(/-/g, "");
    paymentAttemptRef.current = idempotencyKey;
    const response = await fetch("/api/checkout/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceId, checkoutToken: prepared.checkoutToken, idempotencyKey }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "payment_failed");
    clear();
    setSuccess(data);
  }

  async function submitPayment(method: SquareMethod | null, kind: "card" | "apple") {
    if (!method || !prepared || paying) return;
    setPaying(true);
    setError("");
    try {
      const tokenResult = await method.tokenize(
        kind === "card"
          ? {
              amount: (prepared.totalCents / 100).toFixed(2),
              currencyCode: "USD",
              intent: "CHARGE",
              customerInitiated: true,
              sellerKeyedIn: false,
              billingContact: {
                givenName: customer.firstName,
                familyName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                countryCode: "US",
              },
            }
          : undefined
      );
      if (tokenResult.status !== "OK" || !tokenResult.token) {
        throw new Error(tokenResult.errors?.[0]?.message || "tokenization_failed");
      }
      await sendPayment(tokenResult.token);
    } catch (paymentError) {
      console.error(paymentError);
      setError(isEs ? "No se pudo completar el pago. Inténtalo de nuevo." : "Payment could not be completed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  async function submitDemoPayment() {
    if (!prepared || paying) return;
    setPaying(true);
    setError("");
    try {
      await sendPayment("demo-payment-source");
    } catch {
      setError(isEs ? "No se pudo completar el pedido de demostración." : "The demo order could not be completed.");
    } finally {
      setPaying(false);
    }
  }

  function unlockPickup() {
    setPrepared(null);
    setCardReady(false);
    setApplePayReady(false);
    paymentAttemptRef.current = null;
  }

  if (!hydrated) return <div className="min-h-[50vh]" />;
  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-verde-cali/20 bg-blanco p-8 shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-verde-cali text-3xl text-white">✓</div>
          <h1 className="font-heading text-4xl font-extrabold text-chocolate">{isEs ? "¡Pedido confirmado!" : "Order confirmed!"}</h1>
          <p className="mt-3 font-body text-chocolate/65">
            {success.demo
              ? isEs ? "Demostración completada. No se cobró dinero." : "Demo completed. No money was charged."
              : isEs ? "Recibimos tu pago. Te avisaremos cuando tu pedido esté listo para recoger." : "Payment received. We’ll let you know when your order is ready for pickup."}
          </p>
          <p className="mt-4 font-body font-bold text-chocolate">{PICKUP_ADDRESS}</p>
          <p className="mt-2 font-body text-sm font-bold text-chocolate/50">#{success.orderId}</p>
          {success.receiptUrl && <a className="mt-6 inline-flex rounded-full border border-chocolate/15 px-6 py-3 font-bold text-chocolate" href={success.receiptUrl} target="_blank" rel="noreferrer">{isEs ? "Ver recibo" : "View receipt"}</a>}
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
            <p className="sec-eyebrow font-body" data-num="01">{isEs ? "Recoge en tienda" : "Store pickup"}</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold text-chocolate md:text-5xl">{isEs ? "Finalizar pedido" : "Checkout"}</h1>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm">
                <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Contacto" : "Contact"}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input disabled={!!prepared} className={inputClass} placeholder={isEs ? "Nombre" : "First name"} value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} autoComplete="given-name" />
                  <input disabled={!!prepared} className={inputClass} placeholder={isEs ? "Apellido" : "Last name"} value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} autoComplete="family-name" />
                  <input disabled={!!prepared} className={inputClass} placeholder={isEs ? "Teléfono" : "Phone"} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} autoComplete="tel" />
                  <input disabled={!!prepared} className={inputClass} placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} autoComplete="email" type="email" />
                </div>
              </div>

              <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Lugar de recogida" : "Pickup location"}</h2>
                  {prepared && <span className="rounded-full bg-verde-cali/10 px-3 py-1 text-xs font-extrabold text-verde-cali">✓ {isEs ? "Confirmado" : "Confirmed"}</span>}
                </div>
                <div className="mt-4 rounded-xl border border-chocolate/10 bg-crema/60 p-4">
                  <p className="font-heading text-xl font-extrabold text-chocolate">Rancholados</p>
                  <p className="font-body font-bold text-chocolate/70">{PICKUP_ADDRESS}</p>
                  <p className="mt-1 text-sm text-chocolate/55">{isEs ? "Todos los días · 12 PM–10 PM" : "Daily · 12 PM–10 PM"}</p>
                </div>
                {!prepared ? (
                  <button type="button" disabled={preparing || (!config?.squareEnabled && !config?.demoMode)} onClick={preparePickup} className="mt-5 w-full rounded-full bg-chocolate px-6 py-3 font-body font-extrabold text-white disabled:opacity-40">
                    {preparing ? (isEs ? "Confirmando…" : "Confirming…") : (isEs ? "Confirmar recogida" : "Confirm pickup")}
                  </button>
                ) : (
                  <button type="button" className="mt-3 text-sm font-bold text-rosa-fuerte" onClick={unlockPickup}>{isEs ? "Editar contacto" : "Edit contact"}</button>
                )}
                <a href="https://www.doordash.com/store/35880125" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-chocolate/55 hover:text-rosa-fuerte">
                  {isEs ? "¿Necesitas entrega? Pide por DoorDash →" : "Need delivery? Order on DoorDash →"}
                </a>
              </div>

              {prepared && (
                <div className="rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm">
                  <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Pago" : "Payment"}</h2>
                  <p className="mt-1 text-sm text-chocolate/55">{isEs ? "Pago seguro para recoger en Rancholados." : "Secure payment for pickup at Rancholados."}</p>
                  {config?.demoMode ? (
                    <div className="mt-5 rounded-xl border border-dorado/30 bg-dorado/10 p-4">
                      <p className="text-sm font-bold text-chocolate">{isEs ? "Modo demostración: no cobra dinero." : "Demo mode: no money is charged."}</p>
                      <button type="button" disabled={paying} onClick={submitDemoPayment} className="mt-4 w-full rounded-full bg-rosa-fuerte px-6 py-3.5 font-body font-extrabold text-white disabled:opacity-40">
                        {paying ? (isEs ? "Procesando…" : "Processing…") : `${isEs ? "Completar demo" : "Complete demo"} · ${formatPrice(prepared.totalCents)}`}
                      </button>
                    </div>
                  ) : (
                    <>
                      {applePayReady && <button type="button" disabled={paying} onClick={() => void submitPayment(applePayRef.current, "apple")} className="apple-pay-button mt-5 w-full" aria-label="Apple Pay" />}
                      <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-chocolate/35"><span className="h-px flex-1 bg-chocolate/10" />{isEs ? "o tarjeta" : "or card"}<span className="h-px flex-1 bg-chocolate/10" /></div>
                      <div id="square-card" />
                      <button type="button" disabled={paying || !cardReady} onClick={() => void submitPayment(cardRef.current, "card")} className="mt-4 w-full rounded-full bg-rosa-fuerte px-6 py-3.5 font-body font-extrabold text-white disabled:opacity-40">
                        {paying ? (isEs ? "Procesando…" : "Processing…") : `${isEs ? "Pagar" : "Pay"} ${formatPrice(prepared.totalCents)}`}
                      </button>
                    </>
                  )}
                </div>
              )}
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 font-body text-sm font-bold text-red-700">{error}</div>}
              {config && !config.demoMode && !config.squareEnabled && <div className="rounded-xl border border-dorado/30 bg-dorado/10 p-4 text-sm font-bold text-chocolate">{isEs ? "El checkout necesita las credenciales de Square." : "Checkout needs Square credentials."}</div>}
            </div>

            <aside className="h-fit rounded-2xl border border-chocolate/10 bg-blanco p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="font-heading text-2xl font-extrabold text-chocolate">{isEs ? "Tu pedido" : "Your order"}</h2>
              <div className="mt-5 divide-y divide-chocolate/10">
                {displayLines.map(({ itemId, quantity, item }) => (
                  <div key={itemId} className="flex gap-3 py-4">
                    <div className="min-w-0 flex-1"><p className="font-heading font-extrabold text-chocolate">{isEs ? item!.nameEs : item!.nameEn}</p><p className="text-sm font-bold text-rosa-fuerte">{formatPrice(item!.priceCents * quantity)}</p></div>
                    <div className="flex items-center gap-2"><button aria-label="Decrease" onClick={() => setQuantity(itemId, quantity - 1)} className="h-8 w-8 rounded-full border border-chocolate/15">−</button><span className="w-5 text-center text-sm font-bold">{quantity}</span><button aria-label="Increase" onClick={() => setQuantity(itemId, quantity + 1)} className="h-8 w-8 rounded-full border border-chocolate/15">+</button><button aria-label="Remove" onClick={() => removeItem(itemId)} className="ml-1 text-sm text-chocolate/35 hover:text-red-600">×</button></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-chocolate/10 pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(prepared?.subtotalCents ?? estimatedSubtotal)}</span></div>
                <div className="flex justify-between"><span>{isEs ? "Impuestos" : "Tax"}</span><span>{prepared ? formatPrice(prepared.taxCents) : "—"}</span></div>
                <div className="flex justify-between"><span>{isEs ? "Recogida" : "Pickup"}</span><span className="font-bold text-verde-cali">{isEs ? "Gratis" : "Free"}</span></div>
                <div className="flex justify-between border-t border-chocolate/10 pt-3 font-heading text-xl font-extrabold"><span>Total</span><span>{formatPrice(prepared?.totalCents ?? estimatedSubtotal)}</span></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
