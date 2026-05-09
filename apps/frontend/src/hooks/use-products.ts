import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  isNsfw: boolean;
  status: 'PENDING' | 'READY' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  files: { filename: string; mimeType: string; sizeBytes: number }[];
  tags: { tag: { id: string; name: string } }[];
}

export function useMyProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'my'],
    queryFn: () => api.get('/products/my/list').then((r) => r.data),
  });
}

export function useProductStatus(productId: string | null) {
  return useQuery({
    queryKey: ['products', productId, 'status'],
    queryFn: () => api.get(`/products/${productId}/status`).then((r) => r.data),
    enabled: !!productId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'PENDING' ? 3000 : false;
    },
  });
}

export function useUploadProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] });
      router.push('/my/products');
    },
  });
}
