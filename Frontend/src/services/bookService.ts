import { apiClient } from './apiClient';
import type { SummarySearchByBookNameResponse } from '@/types/home';
import type { BookDetailResponse, SimilarBookResponse } from '@/types/book';
import type {
  AuthorSummaryResponse,
  PublisherSummaryResponse,
  SearchBooksParams,
} from '@/types/search';
import type { BookSummaryResponse } from '@/types/home';

/**
 * ASP.NET Core برای List<int> انتظار تکرار کلید دارد:
 *   ?PublisherIds=1&PublisherIds=2
 * نه:
 *   ?PublisherIds[]=1&PublisherIds[]=2
 * پس اینجا با indexes: null سریالایز می‌کنیم.
 */
const arrayParamsSerializer = { indexes: null } as const;

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

  /** GET /api/book/Search */
  searchBooks: async (params: SearchBooksParams) => {
    const query: Record<string, unknown> = {
      Name: params.Name || undefined,
      ISBN: params.ISBN || undefined,
      FromPrice: params.FromPrice,
      ToPrice: params.ToPrice,
      IsExist: params.IsExist,
      PublisherIds: params.PublisherIds?.length ? params.PublisherIds : undefined,
      CategoryIds: params.CategoryIds?.length ? params.CategoryIds : undefined,
      AuthorIds: params.AuthorIds?.length ? params.AuthorIds : undefined,
      SortBy: params.SortBy,
      page: params.page,
    };

    const { data } = await apiClient.get<BookSummaryResponse[]>('/book/Search', {
      params: query,
      paramsSerializer: arrayParamsSerializer,
    });
    return data;
  },

  /** GET /api/publisherPanel/search?name= */
  searchPublishers: async (name: string) => {
    const { data } = await apiClient.get<PublisherSummaryResponse[]>(
      '/publisher/search',
      { params: { name } },
    );
    return data;
  },

  /** GET /api/author/search?name= */
  searchAuthors: async (name: string) => {
    const { data } = await apiClient.get<AuthorSummaryResponse[]>(
      '/author/search',
      { params: { name } },
    );
    return data;
  },
};
