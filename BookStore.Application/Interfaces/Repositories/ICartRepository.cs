using BookStore.Application.DTOs.CartDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface ICartRepository
    {
        Task<bool> AddToCartAsync(string userId, AddCartRequest model);

        Task<CartDetailResponse?> GetCartDetailAsync(string userId);

        Task<bool> RemoveFromCartAsync(string userId, int bookId);

        Task<bool> UpdateCartAsync(string userId, int bookId, bool isIncrease);

        Task ClearCartAsync(string userId);
    }
}