import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { createSubscription as createSubscriptionRequest, getCard, getCards, getSubscriptions, setSubscriptionStatus } from '../api/cards';
import { useAuth } from './AuthProvider';
import type { CreateSubscriptionInput, CreditCard, Service } from '../types';

interface SubscriptionContextValue {
  cards: CreditCard[];
  cardsLoading: boolean;
  subscriptionsByCard: Record<string, Service[]>;
  loadingSubscriptions: Record<string, boolean>;
  pendingSubscriptionIds: string[];
  error: string;
  toast: string;
  refreshCards: () => Promise<void>;
  loadCard: (cardId: string) => Promise<CreditCard>;
  loadSubscriptions: (cardId: string) => Promise<void>;
  createSubscription: (cardId: string, input: CreateSubscriptionInput) => Promise<void>;
  subscribe: (subscription: Service) => Promise<void>;
  unsubscribe: (subscription: Service) => Promise<void>;
  clearError: () => void;
  dismissToast: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

function replaceSubscription(subscriptions: Service[], updated: Service): Service[] {
  const index = subscriptions.findIndex((subscription) => subscription.id === updated.id);
  if (index === -1) return [...subscriptions, updated];
  return subscriptions.map((subscription) => subscription.id === updated.id ? updated : subscription);
}

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(Boolean(session));
  const [subscriptionsByCard, setSubscriptionsByCard] = useState<Record<string, Service[]>>({});
  const [loadingSubscriptions, setLoadingSubscriptions] = useState<Record<string, boolean>>({});
  const [pendingSubscriptionIds, setPendingSubscriptionIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const refreshCards = useCallback(async () => {
    if (!session) return;
    setCardsLoading(true);
    setError('');
    try {
      const updatedCards = await getCards(session.customer.fullName);
      setCards(updatedCards);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Kartu tidak dapat dimuat.');
      throw requestError;
    } finally {
      setCardsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      setCards([]);
      setSubscriptionsByCard({});
      setLoadingSubscriptions({});
      setPendingSubscriptionIds([]);
      setError('');
      setCardsLoading(false);
      return;
    }
    void refreshCards().catch(() => undefined);
  }, [session, refreshCards]);

  const loadCard = useCallback(async (cardId: string) => {
    if (!session) throw new Error('Sesi login tidak tersedia. Silakan login kembali.');
    setError('');
    try {
      const card = await getCard(cardId, session.customer.fullName);
      setCards((currentCards) => {
        const alreadyLoaded = currentCards.some((item) => item.id === card.id);
        return alreadyLoaded
          ? currentCards.map((item) => item.id === card.id ? card : item)
          : [...currentCards, card];
      });
      return card;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Detail kartu tidak dapat dimuat.');
      throw requestError;
    }
  }, [session]);

  const loadSubscriptions = useCallback(async (cardId: string) => {
    setLoadingSubscriptions((current) => ({ ...current, [cardId]: true }));
    setError('');
    try {
      const subscriptions = await getSubscriptions(cardId);
      setSubscriptionsByCard((current) => ({ ...current, [cardId]: subscriptions }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Subscription tidak dapat dimuat.');
      throw requestError;
    } finally {
      setLoadingSubscriptions((current) => ({ ...current, [cardId]: false }));
    }
  }, []);

  const trackPending = useCallback((id: string, pending: boolean) => {
    setPendingSubscriptionIds((current) => pending
      ? current.includes(id) ? current : [...current, id]
      : current.filter((item) => item !== id));
  }, []);

  const applySubscription = useCallback(async (request: Promise<Service>, pendingId: string) => {
    trackPending(pendingId, true);
    setError('');
    try {
      const updated = await request;
      setSubscriptionsByCard((current) => ({
        ...current,
        [updated.cardId]: replaceSubscription(current[updated.cardId] ?? [], updated),
      }));
      const cardName = cards.find((card) => card.id === updated.cardId)?.name ?? 'card';
      setToast(`${updated.name} ${updated.status === 'active' ? 'subscribed on' : 'unsubscribed from'} ${cardName}`);
      void refreshCards().catch(() => undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Subscription tidak dapat diperbarui.');
      throw requestError;
    } finally {
      trackPending(pendingId, false);
    }
  }, [cards, refreshCards, trackPending]);

  const createSubscription = useCallback(async (cardId: string, input: CreateSubscriptionInput) => {
    await applySubscription(createSubscriptionRequest(cardId, input), `new:${cardId}`);
  }, [applySubscription]);

  const subscribe = useCallback(async (subscription: Service) => {
    if (subscription.status === 'active') return;
    await applySubscription(setSubscriptionStatus(subscription.id, 'active'), subscription.id);
  }, [applySubscription]);

  const unsubscribe = useCallback(async (subscription: Service) => {
    if (subscription.status === 'inactive') return;
    await applySubscription(setSubscriptionStatus(subscription.id, 'inactive'), subscription.id);
  }, [applySubscription]);

  const clearError = useCallback(() => setError(''), []);
  const dismissToast = useCallback(() => setToast(''), []);
  const value = useMemo(() => ({
    cards,
    cardsLoading,
    subscriptionsByCard,
    loadingSubscriptions,
    pendingSubscriptionIds,
    error,
    toast,
    refreshCards,
    loadCard,
    loadSubscriptions,
    createSubscription,
    subscribe,
    unsubscribe,
    clearError,
    dismissToast,
  }), [
    cards,
    cardsLoading,
    subscriptionsByCard,
    loadingSubscriptions,
    pendingSubscriptionIds,
    error,
    toast,
    refreshCards,
    loadCard,
    loadSubscriptions,
    createSubscription,
    subscribe,
    unsubscribe,
    clearError,
    dismissToast,
  ]);

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptions(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscriptions must be used within SubscriptionProvider');
  return context;
}
