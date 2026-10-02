import { apiClient } from './apiClient';
import type {
  BannerHomePageResponse,
  BookSummaryResponse,
  ListCategoriesResponse,
  PublisherSummaryResponse,
} from '@/types/home';

export const homeService = {
  getBanners: async () => {
    const { data } = await apiClient.get<BannerHomePageResponse[]>('/home/banner');
    return data;
  },
  getCategories: async () => {
    const { data } = await apiClient.get<ListCategoriesResponse[]>('/category');
    return data;
  },
  getNewestBooks: async () => {
    const { data } = await apiClient.get<BookSummaryResponse[]>('/home/newest');
    return data;
  },
  getPopularBooks: async () => {
    const { data } = await apiClient.get<BookSummaryResponse[]>('/home/popular');
    return data;
  },
  getBestSellingBooks: async () => {
    const { data } = await apiClient.get<BookSummaryResponse[]>('/home/bestsellers');
    return data;
  },
  getMostDiscountedBooks: async () => {
    const { data } = await apiClient.get<BookSummaryResponse[]>('/home/most-discount');
    return data;
  },
  getBestSellingPublishers: async () => {
    const { data } = await apiClient.get<PublisherSummaryResponse[]>(
      '/home/bestsellers-publisher',
    );
    return data;
  },
};