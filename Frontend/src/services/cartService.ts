import { apiClient } from './apiClient';
import type { CartDetailResponse } from '@/types/cart';

export const cartService = {
  getCart: async () => {
    const { data } = await apiClient.get<CartDetailResponse>('/cart');
    return data;
  },
};