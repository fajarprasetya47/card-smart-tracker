export type CardNetwork = 'visa' | 'mastercard';
export type SubscriptionStatus = 'subscribed' | 'not_subscribed';

export interface CreditCard {
  id: string;
  name: string;
  network: CardNetwork;
  maskedNumber: string;
  cardholderName: string;
  expiry: string;
  creditLimit: number;
  currentBalance: number;
  dueDate: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  monthlyPrice: number;
  icon: string;
}

export interface Subscription {
  status: SubscriptionStatus;
  nextBillingDate?: string;
}

export type SubscriptionMap = Record<string, Subscription>;
