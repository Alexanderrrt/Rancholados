export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface CheckoutAddress {
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  country: "US";
}

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface CheckoutAmounts {
  subtotalCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
}

export interface CheckoutQuoteResponse extends CheckoutAmounts {
  checkoutToken: string;
  quoteId: string;
  expiresAt: string;
  confirmedAddress: CheckoutAddress;
}

export interface CheckoutConfig {
  demoMode: boolean;
  squareEnabled: boolean;
  deliveryEnabled: boolean;
  squareApplicationId: string;
  squareLocationId: string;
  squareScriptUrl: string;
}
