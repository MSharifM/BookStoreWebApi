using BookStore.Application.DTOs.OrderDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IOrderService
    {
        Task<OrderPaymentInfoResponse> FinalizeOrderAsync(string userId);

        Task ProcessingPaymentResultAsync(PaymentGatewayRequest model);

        Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId);

        Task<OrderDetailResponse> GetOrderDetailAsync(string userId, int orderId);

        Task<bool> IsUserBoughtBookAsync(int bookId, string userId);
    }
}