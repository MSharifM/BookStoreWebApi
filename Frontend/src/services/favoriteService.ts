import { apiClient } from './apiClient';
import type { FavoriteItemsDetailResponse } from '@/types/favorite';

export const favoriteService = {
  getFavorites: async () => {
    const { data } = await apiClient.get<FavoriteItemsDetailResponse[]>('/favorite/');
    return data;
  },
};