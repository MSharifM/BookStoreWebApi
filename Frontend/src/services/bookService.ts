import { apiClient } from './apiClient';
import type { SummarySearchByBookNameResponse } from '@/types/home';
import type { BookDetailResponse, SimilarBookResponse } from '@/types/book';

export const bookService = {
  searchByName: async (name: string) => {
    const { data } = await apiClient.get<SummarySearchByBookNameResponse[]>(
      '/home/search',
      { params: { name } },
    );
    return data;
  },

  getBookDetail: async (bookId: number) => {
    const { data } = await apiClient.get<BookDetailResponse>(`/book/${bookId}`);
    return data;
  },

  getSimilarBooks: async (bookId: number) => {
    const { data } = await apiClient.get<SimilarBookResponse[]>(
      `/book/similar/${bookId}`,
    );
    return data;
  },
};
