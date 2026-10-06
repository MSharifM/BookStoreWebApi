import { apiClient } from './apiClient';
import type { FavoriteItemsDetailResponse } from '@/types/favorite';

export const favoriteService = {
  getFavorites: async () => {
    const { data } = await apiClient.get<FavoriteItemsDetailResponse[]>('/favorite/');
    return data;
  },

  isBookFavorite: async (bookId: number) => {
    const { data } = await apiClient.get<boolean>(`/favorite/${bookId}`);
    return data;
  },

  addToFavorite: async (bookId: number) => {
    await apiClient.post('/favorite/', null, { params: { bookId } });
  },

  removeFromFavorite: async (bookId: number) => {
    await apiClient.delete(`/favorite/${bookId}`);
  },
};
