using BookStore.Application.DTOs.ReviewDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IReviewService
    {
        Task<List<ReviewBookResponse>> GetBookReviewsAsync(int bookId, int page = 1, string? userId = null);

        public Task AddReviewAsync(string userId, AddReviewRequest model);

        public Task AddOrUpdateReactionAsync(string userId, ReactionRequest model);

        public Task DeleteReviewAsync(int reviewId);
    }
}