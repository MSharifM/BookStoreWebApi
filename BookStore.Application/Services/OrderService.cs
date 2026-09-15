using BookStore.Application.DTOs.OrderDto;
using BookStore.Application.Exceptions;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Domain.Enums;

namespace BookStore.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IUnitOfWorkService _unitOfWorkService;

        public OrderService(ICartRepository cartRepository, IAddressRepository addressRepository, IOrderRepository orderRepository, IUnitOfWorkService unitOfWorkService)
        {
            _cartRepository = cartRepository;
            _addressRepository = addressRepository;
            _orderRepository = orderRepository;
            _unitOfWorkService = unitOfWorkService;
        }

        public async Task<OrderPaymentInfoResponse> FinalizeOrderAsync(string userId)
        {
            var cartDetail = await _cartRepository.GetCartDetailAsync(userId);
            if (cartDetail is null || !cartDetail.CartItems.Any())
                throw new EmptyCartException();

            if (cartDetail.CartItems.Any(ci => ci.CountItemInCart > ci.StockQuantity || ci.StockQuantity < 1))
                throw new InsufficientStockException();

            var address = await _addressRepository.GetUserAddressAsync(userId);
            if (address is null)
                throw new AddressNotFoundException();

            var existingPendingOrder = await _orderRepository.GetPendingOrderAsync(userId);
            if (existingPendingOrder != null)
            {
                return new OrderPaymentInfoResponse
                {
                    OrderId = existingPendingOrder.OrderId,
                    TotalPrice = existingPendingOrder.TotalPrice
                };
            }
            await _unitOfWorkService.BeginTransactionAsync();

            try
            {
                var orderId = await _orderRepository.AddOrderAsync(userId, cartDetail,
                    address.State + " > " + address.City + " > " + address.Detail);

                await _orderRepository.ReduceBookQuantityAsync(cartDetail);

                await _unitOfWorkService.CommitAsync();

                return new OrderPaymentInfoResponse
                {
                    OrderId = orderId,
                    TotalPrice = cartDetail.CartItems.Sum(ci => ci.TotalPrice)
                };
            }
            catch
            {
                await _unitOfWorkService.RollbackAsync();
                throw;
            }

            var totalPrice = cartDetail.CartItems.Sum(ci => ci.TotalPrice);
            // TODO: Send information to payment gateway
        }

        public async Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId)
        {
            var result = await _orderRepository.GetUserOrdersAsync(userId);

            return result;
        }

        public async Task<OrderDetailResponse> GetOrderDetailAsync(string userId, int orderId)
        {
            var result = await _orderRepository.GetOrderDetailAsync(orderId, userId);

            if (result is null)
                throw new OrderNotFoundException();

            return result;
        }

        public async Task ProcessingPaymentResultAsync(PaymentGatewayRequest model)
        {
            await _unitOfWorkService.BeginTransactionAsync();

            try
            {
                if (model.IsSuccess)
                {
                    var isUpdated = await _orderRepository.TryUpdateOrderStatusAsync(model.OrderId,
                        [OrderStatus.Pending], OrderStatus.Processing);
                    if (!isUpdated)
                        throw new OrderNotFoundException();

                    var userId = await _orderRepository.GetUserIdByOrderIdAsync(model.OrderId);
                    if (userId != null) await _cartRepository.ClearCartAsync(userId);
                }
                else
                {
                    var isUpdated = await _orderRepository.TryUpdateOrderStatusAsync(model.OrderId,
                        [OrderStatus.Pending], OrderStatus.Failed);

                    if (!isUpdated)
                        throw new OrderNotFoundException();

                    await _orderRepository.ReturningBooksQuantityAsync(model.OrderId);
                }

                await _unitOfWorkService.CommitAsync();
            }
            catch
            {
                await _unitOfWorkService.RollbackAsync();
                throw;
            }
        }
    }
}