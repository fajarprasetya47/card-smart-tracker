import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from 'react';
import { cards, services } from '../data';
import type { Subscription, SubscriptionMap } from '../types';
import { addOneMonth, subscriptionKey, todayAsIsoDate } from '../utils';

type SubscriptionAction =
  | { type: 'subscribe'; cardId: string; serviceId: string; nextBillingDate: string }
  | { type: 'unsubscribe'; cardId: string; serviceId: string };

interface SubscriptionContextValue {
  subscriptions: SubscriptionMap;
  toast: string;
  subscribe: (cardId: string, serviceId: string, cardName: string, serviceName: string) => void;
  unsubscribe: (cardId: string, serviceId: string, cardName: string, serviceName: string) => void;
  dismissToast: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function createInitialSubscriptions(): SubscriptionMap {
  const initiallySubscribed = new Map<string, string>([
    ['card-visa-platinum:svc-netflix', '2026-11-15'],
    ['card-visa-platinum:svc-spotify', '2026-11-18'],
    ['card-mc-gold:svc-youtube', '2026-11-10'],
    ['card-mc-gold:svc-icloud', '2026-11-12'],
    ['card-mc-gold:svc-gym', '2026-11-20'],
  ]);

  return Object.fromEntries(
    cards.flatMap((card) =>
      services.map((service) => {
        const key = subscriptionKey(card.id, service.id);
        const nextBillingDate = initiallySubscribed.get(key);
        return [
          key,
          nextBillingDate
            ? { status: 'subscribed', nextBillingDate }
            : { status: 'not_subscribed' },
        ];
      }),
    ),
  ) as SubscriptionMap;
}

export function subscriptionReducer(
  state: SubscriptionMap,
  action: SubscriptionAction,
): SubscriptionMap {
  const key = subscriptionKey(action.cardId, action.serviceId);
  const current = state[key];

  if (action.type === 'subscribe') {
    if (!current || current.status === 'subscribed') return state;
    return {
      ...state,
      [key]: { status: 'subscribed', nextBillingDate: action.nextBillingDate },
    };
  }

  if (!current || current.status === 'not_subscribed') return state;
  return { ...state, [key]: { status: 'not_subscribed' } };
}

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const [subscriptions, dispatch] = useReducer(
    subscriptionReducer,
    undefined,
    createInitialSubscriptions,
  );
  const [toast, setToast] = useState('');

  const subscribe = useCallback(
    (cardId: string, serviceId: string, cardName: string, serviceName: string) => {
      const current = subscriptions[subscriptionKey(cardId, serviceId)];
      if (!current || current.status === 'subscribed') return;
      dispatch({
        type: 'subscribe',
        cardId,
        serviceId,
        nextBillingDate: addOneMonth(todayAsIsoDate()),
      });
      setToast(`${serviceName} subscribed on ${cardName}`);
    },
    [subscriptions],
  );

  const unsubscribe = useCallback(
    (cardId: string, serviceId: string, cardName: string, serviceName: string) => {
      const current = subscriptions[subscriptionKey(cardId, serviceId)];
      if (!current || current.status === 'not_subscribed') return;
      dispatch({ type: 'unsubscribe', cardId, serviceId });
      setToast(`${serviceName} unsubscribed from ${cardName}`);
    },
    [subscriptions],
  );

  const dismissToast = useCallback(() => setToast(''), []);
  const value = useMemo(
    () => ({ subscriptions, toast, subscribe, unsubscribe, dismissToast }),
    [subscriptions, toast, subscribe, unsubscribe, dismissToast],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptions(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscriptions must be used within SubscriptionProvider');
  return context;
}

export function useCardSummary(cardId: string) {
  const { subscriptions } = useSubscriptions();
  const card = cards.find((item) => item.id === cardId);
  const activeServices = services.filter(
    (service) => subscriptions[subscriptionKey(cardId, service.id)]?.status === 'subscribed',
  );
  const activeCount = activeServices.length;
  const monthlyTotal = activeServices.reduce((total, service) => total + service.monthlyPrice, 0);
  const creditLimit = card?.creditLimit ?? 0;
  const currentBalance = card?.currentBalance ?? 0;

  return {
    activeCount,
    monthlyTotal,
    availableLimit: creditLimit - currentBalance,
    usagePercent: creditLimit === 0 ? 0 : (currentBalance / creditLimit) * 100,
  };
}

export function getSubscription(
  subscriptions: SubscriptionMap,
  cardId: string,
  serviceId: string,
): Subscription {
  return (
    subscriptions[subscriptionKey(cardId, serviceId)] ?? { status: 'not_subscribed' }
  );
}
