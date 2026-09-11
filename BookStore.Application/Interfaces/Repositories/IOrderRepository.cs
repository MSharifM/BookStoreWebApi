using BookStore.Application.DTOs.CartDto;
using BookStore.Application.DTOs.OrderDto;
using BookStore.Domain.Enums;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IOrderRepository
    {
        Task<int> AddOrderAsync(string userId, CartDetailResponse cartDetail, string address);

        Task ReduceBookQuantityAsync(CartDetailResponse cartDetail);

        Task<bool> ChangeOrderStatusAsync(int orderId, OrderStatus newStatus);

        Task<string?> GetUserIdByOrderIdAsync(int orderId);

        Task ReturningBooksQuantityAsync(int orderId);

        Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId);

        Task<OrderDetailResponse?> GetOrderDetailAsync(int orderId);
    }
}