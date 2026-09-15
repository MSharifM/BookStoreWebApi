using BookStore.Application.Constants;
using BookStore.Application.DTOs.ReviewDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReviewBookResponse>> GetBookReviewsAsync(int bookId, int page = 1, string? userId = null)
        {
            var step = 7;
            var skip = (page - 1) * step;

            var result = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.BookId == bookId)
                .OrderByDescending(r => r.CreateDate)
                .ThenByDescending(r => r.ReviewId)
                .Skip(skip)
                .Take(step)
                .Select(r => new ReviewBookResponse()
                {
                    UserName = r.User.UserName!,
                    UserImage = FileStorageConstants.Paths.UserProfile + r.User.ImageProfile,
                    Content = r.Content,
                    Rate = r.Rate,
                    CreateDate = r.CreateDate,
                    ReviewId = r.ReviewId,
                    Like = r.ReviewReactions.Count(rr => rr.IsLike),
                    Dislike = r.ReviewReactions.Count(rr => !rr.IsLike),
                    UserReaction = userId == null ? null : new ReactionDto()
                    {
                        IsLike = r.ReviewReactions
                            .Where(rr => rr.UserId == userId)
                            .Select(rr => rr.IsLike)
                            .FirstOrDefault()
                    }
                })
                .ToListAsync();

            return result;
        }

        public async Task<int> CreateReviewAsync(string userId, AddReviewRequest model)
        {
            var result = await _context.Reviews
                .AddAsync(new Review()
                {
                    UserId = userId,
                    BookId = model.BookId,
                    Content = model.Content,
                    Rate = model.Rate
                });

            await _context.SaveChangesAsync();

            return result.Entity.ReviewId;
        }

        public async Task DeleteReviewAsync(int reviewId)
        {
            await _context.Reviews
                .Where(r => r.ReviewId == reviewId)
                .ExecuteDeleteAsync();
        }

        public async Task<bool> IsReviewExistAsync(int reviewId)
        {
            var result = await _context.Reviews
                .AnyAsync(r => r.ReviewId == reviewId);

            return result;
        }

        #region Reaction

        public async Task CreateReactionAsync(string userId, int reviewId, bool isLike)
        {
            await _context.ReviewReactions
                .AddAsync(new ReviewReaction()
                {
                    UserId = userId,
                    IsLike = isLike,
                    ReviewId = reviewId
                });

            await _context.SaveChangesAsync();
        }

        public async Task DeleteReactionAsync(string userId, int reviewId)
        {
            await _context.ReviewReactions
                .Where(rr => rr.ReviewId == reviewId && rr.UserId == userId)
                .ExecuteDeleteAsync();
        }

        public async Task<bool?> IsUserLikedOrDislikedAsync(string userId, int reviewId)
        {
            var result = await _context.ReviewReactions
                .Where(rr => rr.ReviewId == reviewId && rr.UserId == userId)
                .FirstOrDefaultAsync();

            if (result is null)
                return null;

            return result.IsLike;
        }

        public async Task ToggleReactionAsync(string userId, int reviewId)
        {
            await _context.ReviewReactions
                .Where(rr => rr.ReviewId == reviewId && rr.UserId == userId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(rr => rr.IsLike, rr => !rr.IsLike)
                );
        }

        #endregion Reaction
    }
}