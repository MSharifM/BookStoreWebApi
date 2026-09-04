using BookStore.Application.DTOs.FavoriteDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IFavoriteRepository
    {
        Task<bool> AddToFavoriteAsync(string userId, int bookId);

        Task<List<FavoriteItemsDetailResponse>?> GetFavoriteItemsDetailAsync(string userId);

        Task<bool> RemoveFromFavoriteAsync(string userId, int bookId);

        Task ClearFavoriteAsync(string userId);
    }
}