import { apiClient } from './apiClient';
import type { SummarySearchByBookNameResponse } from '@/types/home';

export const bookService = {
  searchByName: async (name: string) => {
    const { data } = await apiClient.get<SummarySearchByBookNameResponse[]>(
      '/home/search',
      { params: { name } },
    );
    return data;
  },
};