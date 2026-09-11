using BookStore.Application.DTOs.OrderDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Domain.Enums;

namespace BookStore.Application.Services.Order
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderService(ICartRepository cartRepository, IAddressRepository addressRepository, IOrderRepository orderRepository)
        {
            _cartRepository = cartRepository;
            _addressRepository = addressRepository;
            _orderRepository = orderRepository;
        }

        public async Task<bool> FinalizeOrderAsync(string userId)
        {
            var cartDetail = await _cartRepository.GetCartDetailAsync(userId);
            if (cartDetail is null || !cartDetail.CartItems.Any())
                return false;

            if (cartDetail.CartItems.Any(ci => ci.CountItemInCart > ci.StockQuantity || ci.StockQuantity < 1))
                return false;

            var address = await _addressRepository.GetUserAddressAsync(userId);
            if (address is null)
                return false;

            var totalPrice = cartDetail.CartItems.Sum(ci => ci.TotalPrice);

            await _orderRepository.AddOrderAsync(userId, cartDetail,
                address.State + " > " + address.City + " > " + address.Detail);

            await _orderRepository.ReduceBookQuantityAsync(cartDetail);
            // TODO: Send information to payment gateway

            return true;
        }

        public async Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId)
        {
            var result = await _orderRepository.GetUserOrdersAsync(userId);

            return result;
        }

        public async Task<OrderDetailResponse?> GetOrderDetailAsync(int orderId)
        {
            var result = await _orderRepository.GetOrderDetailAsync(orderId);

            return result;
        }

        public async Task ProcessingPaymentResultAsync(int orderId, bool isSuccess)
        {
            if (isSuccess)
            {
                var isExistOrder = await _orderRepository.ChangeOrderStatusAsync(orderId, OrderStatus.Processing);
                if (isExistOrder)
                {
                    var userId = await _orderRepository.GetUserIdByOrderIdAsync(orderId);
                    if (userId != null) await _cartRepository.ClearCartAsync(userId);
                }
            }
            else
            {
                await _orderRepository.ChangeOrderStatusAsync(orderId, OrderStatus.Failed);
                await _orderRepository.ReturningBooksQuantityAsync(orderId);
            }
        }
    }
}