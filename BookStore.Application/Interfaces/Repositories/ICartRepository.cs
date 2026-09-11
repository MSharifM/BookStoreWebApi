using BookStore.Application.DTOs.CartDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface ICartRepository
    {
        Task<bool> AddToCartAsync(string userId, AddCartRequest model);

        Task<CartDetailResponse?> GetCartDetailAsync(string userId);

        Task<bool> RemoveFromCartAsync(string userId, int bookId);

        Task<bool> UpdateCartAsync(string userId, UpdateCartRequest model);

        Task ClearCartAsync(string userId);
    }
}