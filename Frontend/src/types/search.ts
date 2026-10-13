import type { BookSortBy } from './home';

export interface SearchBooksParams {
  Name?: string;
  ISBN?: string;
  FromPrice?: number;
  ToPrice?: number;
  IsExist?: boolean;
  PublisherIds?: number[];
  CategoryIds?: number[];
  AuthorIds?: number[];
  SortBy?: BookSortBy;
  page?: number;
}

/** GET /api/publisherPanel/search?name= */
export interface PublisherSummaryResponse {
  publisherId: number;
  publisherName: string;
  publisherImage: string;
}

/** GET /api/author/search?name= */
export interface AuthorSummaryResponse {
  authorId: number;
  authorName: string;
  imageName: string;
}

/** نمایش عمومی برای pickerها */
export interface Entity {
  id: number;
  name: string;
  image: string;
}

export const PUBLISHERS_CACHE_KEY = 'bookshelf.filters.publishers';
export const AUTHORS_CACHE_KEY = 'bookshelf.filters.authors';
