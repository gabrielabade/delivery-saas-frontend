export const formatCurrency = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return 'R$ 0,00';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue || 0);
};

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateShort = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return phone;
};