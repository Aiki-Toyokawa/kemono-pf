import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// 4xx はサーバー側の確定的なエラーなのでリトライしない
const no4xxRetry = (failureCount: number, error: any) => {
  const status = error?.response?.status;
  if (status >= 400 && status < 500) return false;
  return failureCount < 3;
};

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.get(`/users/${userId}`).then((r) => r.data),
    enabled: !!userId,
    retry: no4xxRetry,
  });
}

export function useUserProducts(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'products'],
    queryFn: () => api.get(`/users/${userId}/products`).then((r) => r.data),
    enabled: !!userId,
    retry: no4xxRetry,
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

export function useUpgradeToArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch('/users/me/upgrade-to-artist').then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
