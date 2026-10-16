export type CardNetwork = 'visa' | 'mastercard' | 'jcb';
export type SubscriptionStatus = 'active' | 'inactive';

export interface CreditCard {
  id: string;
  name: string;
  network: CardNetwork;
  maskedNumber: string;
  cardholderName: string;
  expiry: string;
  creditLimit: number;
  availableLimit: number;
  currentBalance: number;
  status: string;
  activeSubscriptionCount: number;
  totalActiveMonthlyAmount: number;
}

export interface Service {
  id: string;
  cardId: string;
  name: string;
  category: string;
  monthlyPrice: number;
  billingPeriod: 'monthly' | 'yearly' | 'weekly';
  icon: string;
  logoUrl: string | null;
  description: string | null;
  status: SubscriptionStatus;
  nextBillingDate: string | null;
}

export interface CreateSubscriptionInput {
  serviceName: string;
  category:
    | 'ENTERTAINMENT'
    | 'MUSIC'
    | 'CLOUD_STORAGE'
    | 'TRANSPORTATION'
    | 'PRODUCTIVITY'
    | 'EDUCATION'
    | 'GAMING'
    | 'OTHER';
  billingAmount: number;
  billingPeriod: 'MONTHLY';
}
