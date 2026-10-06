import type { CategoryDto } from './home';

export interface AuthorDto {
  id: number;
  name: string;
}

export interface BookDetailResponse {
  name: string;
  weightGram: number;
  publicationYear: number;
  ISBN: string;
  demoPDFPath: string | null;
  countPages: number;
  language: string;
  stockQuantity: number;
  description: string | null;
  price: number;
  createDate: string;
  rate: number;

  writers: AuthorDto[];
  editors: AuthorDto[];
  translators: AuthorDto[];

  publisherId: number;
  publisherName: string;
  category: CategoryDto[];
  bookImages: string[];
}

export interface SimilarBookResponse {
  bookId: number;
  name: string;
  bookImage: string;
  stockQuantity: number;
  publicationYear: number;
  price: number;
  authorNames: string;
  rate: number;
}

export interface AddToCartRequest {
  bookId: number;
  count: number;
}

export interface UpdateCartRequest {
  bookId: number;
  isIncrease: boolean;
}