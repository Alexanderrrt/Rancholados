export interface CartLine {
  itemId: string;
  quantity: number;
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
  totalCents: number;
}

export interface CheckoutPreparationResponse extends CheckoutAmounts {
  checkoutToken: string;
  expiresAt: string;
}

export interface CheckoutConfig {
  demoMode: boolean;
  squareEnabled: boolean;
  squareApplicationId: string;
  squareLocationId: string;
  squareScriptUrl: string;
}
