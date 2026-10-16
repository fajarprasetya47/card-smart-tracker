import { apiRequest } from './client';
import type { CreateSubscriptionInput, CreditCard, Service } from '../types';

type RecordValue = Record<string, unknown>;

interface CardPayload extends RecordValue {
  id: number;
  cardName: string;
  maskedCardNumber: string;
  cardNetwork: 'VISA' | 'MASTERCARD' | 'JCB';
  creditLimit: number;
  availableLimit: number;
  expiryDate: string;
  status: string;
  activeSubscriptionCount: number;
  totalActiveMonthlyAmount: number;
}

interface SubscriptionPayload extends RecordValue {
  id: number;
  cardId: number;
  serviceName: string;
  category: string;
  billingAmount: number;
  billingPeriod: 'MONTHLY' | 'YEARLY' | 'WEEKLY';
  nextBillingDate: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  logoUrl: string | null;
  description: string | null;
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parseCard(value: unknown, cardholderName: string): CreditCard {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.id) ||
    typeof value.cardName !== 'string' ||
    typeof value.maskedCardNumber !== 'string' ||
    (value.cardNetwork !== 'VISA' && value.cardNetwork !== 'MASTERCARD' && value.cardNetwork !== 'JCB') ||
    !isFiniteNumber(value.creditLimit) ||
    !isFiniteNumber(value.availableLimit) ||
    typeof value.expiryDate !== 'string' ||
    typeof value.status !== 'string' ||
    !isFiniteNumber(value.activeSubscriptionCount) ||
    !isFiniteNumber(value.totalActiveMonthlyAmount)
  ) {
    throw new Error('Backend mengirim data kartu dengan format yang tidak valid.');
  }

  const card = value as CardPayload;
  return {
    id: String(card.id),
    name: card.cardName,
    network: card.cardNetwork === 'VISA'
      ? 'visa'
      : card.cardNetwork === 'MASTERCARD'
        ? 'mastercard'
        : 'jcb',
    maskedNumber: card.maskedCardNumber,
    cardholderName,
    expiry: card.expiryDate,
    creditLimit: card.creditLimit,
    availableLimit: card.availableLimit,
    currentBalance: card.creditLimit - card.availableLimit,
    status: card.status,
    activeSubscriptionCount: card.activeSubscriptionCount,
    totalActiveMonthlyAmount: card.totalActiveMonthlyAmount,
  };
}

function serviceIcon(name: string, category: string): string {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes('netflix') || normalizedName.includes('youtube') || normalizedName.includes('disney')) return '▶';
  if (normalizedName.includes('spotify') || category === 'MUSIC') return '♫';
  if (category === 'CLOUD_STORAGE') return '☁';
  if (category === 'TRANSPORTATION') return '↗';
  if (category === 'PRODUCTIVITY') return '✦';
  if (category === 'EDUCATION') return '▤';
  if (category === 'GAMING') return '◇';
  return '♧';
}

function parseSubscription(value: unknown): Service {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.id) ||
    !Number.isInteger(value.cardId) ||
    typeof value.serviceName !== 'string' ||
    typeof value.category !== 'string' ||
    !isFiniteNumber(value.billingAmount) ||
    (value.billingPeriod !== 'MONTHLY' && value.billingPeriod !== 'YEARLY' && value.billingPeriod !== 'WEEKLY') ||
    (value.status !== 'ACTIVE' && value.status !== 'INACTIVE') ||
    !(value.nextBillingDate === null || typeof value.nextBillingDate === 'string') ||
    !(value.logoUrl === null || typeof value.logoUrl === 'string') ||
    !(value.description === null || typeof value.description === 'string')
  ) {
    throw new Error('Backend mengirim data subscription dengan format yang tidak valid.');
  }

  const subscription = value as SubscriptionPayload;
  return {
    id: String(subscription.id),
    cardId: String(subscription.cardId),
    name: subscription.serviceName,
    category: subscription.category.replaceAll('_', ' ').toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase()),
    monthlyPrice: subscription.billingAmount,
    billingPeriod: subscription.billingPeriod === 'MONTHLY'
      ? 'monthly'
      : subscription.billingPeriod === 'YEARLY'
        ? 'yearly'
        : 'weekly',
    icon: serviceIcon(subscription.serviceName, subscription.category),
    logoUrl: subscription.logoUrl,
    description: subscription.description,
    status: subscription.status === 'ACTIVE' ? 'active' : 'inactive',
    nextBillingDate: subscription.nextBillingDate,
  };
}

export async function getCards(cardholderName: string): Promise<CreditCard[]> {
  const result = await apiRequest<unknown>('/cards');
  if (!Array.isArray(result)) throw new Error('Backend mengirim daftar kartu dengan format yang tidak valid.');
  return result.map((card) => parseCard(card, cardholderName));
}

export async function getCard(cardId: string, cardholderName: string): Promise<CreditCard> {
  const result = await apiRequest<unknown>(`/cards/${encodeURIComponent(cardId)}`);
  return parseCard(result, cardholderName);
}

export async function getSubscriptions(cardId: string): Promise<Service[]> {
  const result = await apiRequest<unknown>(`/cards/${encodeURIComponent(cardId)}/subscriptions`);
  if (!Array.isArray(result)) throw new Error('Backend mengirim daftar subscription dengan format yang tidak valid.');
  return result.map(parseSubscription);
}

export async function createSubscription(
  cardId: string,
  input: CreateSubscriptionInput,
): Promise<Service> {
  const result = await apiRequest<unknown>(`/cards/${encodeURIComponent(cardId)}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return parseSubscription(result);
}

export async function setSubscriptionStatus(
  subscriptionId: string,
  status: Service['status'],
): Promise<Service> {
  const action = status === 'active' ? 'subscribe' : 'unsubscribe';
  const result = await apiRequest<unknown>(`/subscriptions/${encodeURIComponent(subscriptionId)}/${action}`, {
    method: 'POST',
  });
  return parseSubscription(result);
}
