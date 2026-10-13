export interface BannerHomePageResponse {
  url: string;
  imageName: string;
}

export interface CategoryDto {
  categoryId: number;
  categoryName: string;
}

export interface ListCategoriesResponse {
  category: CategoryDto;
  countBooks: number;
}

export interface BookSummaryResponse {
  bookId: number;
  name: string;
  bookImage: string;
  stockQuantity: number;
  publicationYear: number;
  price: number;
  authorNames: string;
  rate: number;
}

export interface PublisherSummaryResponse {
  publisherId: number;
  publisherName: string;
  publisherImage: string;
}

export interface SummarySearchByBookNameResponse {
  bookId: number;
  bookName: string;
  price: number;
  imagePath: string;
  publisherName: string;
}

/** Enum mirrors backend BookSortBy. Only verified values are present. */
export enum BookSortBy {
  Newest = 1,
  Cheapest = 2,
  MostExpensive = 3,
  Popular = 4,
  BestSelling = 5,
}