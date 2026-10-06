export interface ReviewUserReaction {
  isLike: boolean;
}

export interface ReviewResponse {
  reviewId: number;
  rate: number;
  content: string;
  userName: string;
  userImage: string;
  createDate: string;
  like: number;
  dislike: number;
  userReaction: ReviewUserReaction | null;
}

export interface AddReviewRequest {
  bookId: number;
  content: string;
  rate: number;
}

export interface ReactionRequest {
  reviewId: number;
  isLike: boolean;
}
