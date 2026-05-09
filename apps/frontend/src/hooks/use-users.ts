import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.get(`/users/${userId}`).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useUserProducts(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'products'],
    queryFn: () => api.get(`/users/${userId}/products`).then((r) => r.data),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { displayName?: string; bio?: string; isNsfwEnabled?: boolean }) =>
      api.put('/users/me', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
