using BookStore.Application.DTOs.ReviewDto;
using BookStore.Application.Exceptions;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IOrderService _orderService;

        public ReviewService(IReviewRepository reviewRepository, IOrderService orderService)
        {
            _reviewRepository = reviewRepository;
            _orderService = orderService;
        }

        public async Task<List<ReviewBookResponse>> GetBookReviewsAsync(int bookId, int page = 1, string? userId = null)
        {
            var result = await _reviewRepository.GetBookReviewsAsync(bookId, page, userId);

            return result;
        }

        public async Task AddReviewAsync(string userId, AddReviewRequest model)
        {
            var isUserBoughtBook = await _orderService.IsUserBoughtBookAsync(model.BookId, userId);
            if (!isUserBoughtBook)
                throw new BookNotPurchasedException();

            await _reviewRepository.CreateReviewAsync(userId, model);
        }

        public async Task AddOrUpdateReactionAsync(string userId, ReactionRequest model)
        {
            var isReviewExist = await _reviewRepository.IsReviewExistAsync(model.ReviewId);
            if (!isReviewExist)
                throw new ReviewNotFoundException();

            var isUserLiked = await _reviewRepository.IsUserLikedOrDislikedAsync(userId, model.ReviewId);

            if (isUserLiked is null) // Create new reaction
            {
                await _reviewRepository.CreateReactionAsync(userId, model.ReviewId, model.IsLike);
            }
            else if (model.IsLike == isUserLiked) // Delete reaction
            {
                await _reviewRepository.DeleteReactionAsync(userId, model.ReviewId);
            }
            else // Update reaction
            {
                await _reviewRepository.ToggleReactionAsync(userId, model.ReviewId);
            }
        }

        public async Task DeleteReviewAsync(int reviewId)
        {
            await _reviewRepository.DeleteReviewAsync(reviewId);
        }
    }
}