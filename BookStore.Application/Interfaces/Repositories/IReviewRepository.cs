using BookStore.Application.DTOs.ReviewDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IReviewRepository
    {
        Task<List<ReviewBookResponse>> GetBookReviewsAsync(int bookId, int page = 1, string? userId = null);

        Task<int> CreateReviewAsync(string userId, AddReviewRequest model);

        Task DeleteReviewAsync(int reviewId);

        Task<bool> IsReviewExistAsync(int reviewId);

        #region Reaction

        Task CreateReactionAsync(string userId, int reviewId, bool isLike);

        Task DeleteReactionAsync(string userId, int reviewId);

        Task<bool?> IsUserLikedOrDislikedAsync(string userId, int reviewId);

        Task ToggleReactionAsync(string userId, int reviewId);

        #endregion Reaction
    }
}