import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    isNsfw: boolean;
    files: { filename: string; mimeType: string }[];
  };
  download: { token: string; expiresAt: string; usedAt: string | null } | null;
}

export function useMyOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders', 'my'],
    queryFn: () => api.get('/orders/my').then((r) => r.data),
  });
}

export function usePurchase() {
  return useMutation({
    mutationFn: (productId: string) => api.post('/orders', { productId }).then((r) => r.data),
  });
}

export function useDownloadLink(orderId: string) {
  return useMutation({
    mutationFn: () => api.get(`/orders/${orderId}/download`).then((r) => r.data),
    onSuccess: (data) => {
      if (data.url) window.open(data.url, '_blank');
    },
  });
}
