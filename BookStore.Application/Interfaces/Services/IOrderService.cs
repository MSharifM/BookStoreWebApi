using BookStore.Application.DTOs.OrderDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IOrderService
    {
        Task<bool> FinalizeOrderAsync(string userId);

        Task ProcessingPaymentResultAsync(int orderId, bool isSuccess);

        Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId);

        Task<OrderDetailResponse?> GetOrderDetailAsync(int orderId);
    }
}