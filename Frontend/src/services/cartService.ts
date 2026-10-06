import { apiClient } from './apiClient';
import type { CartDetailResponse } from '@/types/cart';
import type { AddToCartRequest, UpdateCartRequest } from '@/types/book';

export const cartService = {
  getCart: async () => {
    const { data } = await apiClient.get<CartDetailResponse>('/cart');
    return data;
  },

  addToCart: async (bookId: number, count: number) => {
    const body: AddToCartRequest = { bookId, count };
    await apiClient.post('/cart', body);
  },

  getBookCountInCart: async (bookId: number) => {
    const { data } = await apiClient.get<number>(`/cart/${bookId}`);
    return data;
  },

  updateCart: async (bookId: number, isIncrease: boolean) => {
    const body: UpdateCartRequest = { bookId, isIncrease };
    const { data } = await apiClient.put<boolean>('/cart', body);
    return data;
  },

  removeFromCart: async (bookId: number) => {
    await apiClient.delete(`/cart/${bookId}`);
  },
};
