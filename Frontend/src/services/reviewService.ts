import { apiClient } from './apiClient';
import type { AddReviewRequest, ReactionRequest, ReviewResponse } from '@/types/review';

export const reviewService = {
  getBookReviews: async (bookId: number, page: number) => {
    const { data } = await apiClient.get<ReviewResponse[]>(`/review/${bookId}`, {
      params: { page },
    });
    return data;
  },

  addReview: async (payload: AddReviewRequest) => {
    await apiClient.post('/review', payload);
  },

  reactToReview: async (payload: ReactionRequest) => {
    await apiClient.post('/review/reaction', payload);
  },
};
