import type { CreditCard, Service } from './types';

export const cards: CreditCard[] = [
  {
    id: 'card-visa-platinum',
    name: 'Visa Platinum',
    network: 'visa',
    maskedNumber: '•••• •••• •••• 4821',
    cardholderName: 'Andi Pratama',
    expiry: '08/28',
    creditLimit: 30_000_000,
    currentBalance: 8_450_000,
    dueDate: '2026-11-05',
  },
  {
    id: 'card-mc-gold',
    name: 'Mastercard Gold',
    network: 'mastercard',
    maskedNumber: '•••• •••• •••• 7390',
    cardholderName: 'Andi Pratama',
    expiry: '03/27',
    creditLimit: 20_000_000,
    currentBalance: 12_300_000,
    dueDate: '2026-11-12',
  },
  {
    id: 'card-visa-signature',
    name: 'Visa Signature',
    network: 'visa',
    maskedNumber: '•••• •••• •••• 1156',
    cardholderName: 'Andi Pratama',
    expiry: '11/29',
    creditLimit: 50_000_000,
    currentBalance: 0,
    dueDate: '2026-11-20',
  },
];

export const services: Service[] = [
  {
    id: 'svc-netflix',
    name: 'Netflix',
    category: 'Entertainment',
    monthlyPrice: 186_000,
    icon: '🎬',
  },
  {
    id: 'svc-spotify',
    name: 'Spotify',
    category: 'Music',
    monthlyPrice: 55_000,
    icon: '♫',
  },
  {
    id: 'svc-youtube',
    name: 'YouTube Premium',
    category: 'Entertainment',
    monthlyPrice: 71_000,
    icon: '▶',
  },
  {
    id: 'svc-icloud',
    name: 'iCloud+',
    category: 'Cloud Storage',
    monthlyPrice: 14_000,
    icon: '☁',
  },
  {
    id: 'svc-chatgpt',
    name: 'AI Assistant Plus',
    category: 'Productivity',
    monthlyPrice: 320_000,
    icon: '✦',
  },
  {
    id: 'svc-gym',
    name: 'Fitness Club',
    category: 'Health',
    monthlyPrice: 250_000,
    icon: '♧',
  },
];
