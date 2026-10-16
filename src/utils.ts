export function formatCurrency(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

export function addOneMonth(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const nextMonthLastDay = new Date(year, month + 1, 0).getDate();
  const nextDate = new Date(year, month - 1 + 1, Math.min(day, nextMonthLastDay));
  return [
    nextDate.getFullYear(),
    String(nextDate.getMonth() + 1).padStart(2, '0'),
    String(nextDate.getDate()).padStart(2, '0'),
  ].join('-');
}

export function todayAsIsoDate(): string {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
}

export function subscriptionKey(cardId: string, serviceId: string): string {
  return `${cardId}:${serviceId}`;
}
