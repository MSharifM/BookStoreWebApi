using BookStore.Application.Constants;
using BookStore.Application.DTOs.CartDto;
using BookStore.Application.DTOs.OrderDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Domain.Enums;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddOrderAsync(string userId, CartDetailResponse cartDetail, string address)
        {
            var order = new Order
            {
                UserId = userId,
                Address = address,
                OrderStatus = OrderStatus.Pending,
            };

            var bookPrices = await GetBooksPriceAsync(cartDetail);

            order.OrderItems = cartDetail.CartItems.Select(ci => new OrderItem
            {
                BookId = ci.BookId,
                Count = ci.CountItemInCart,
                UnitPrice = bookPrices.GetValueOrDefault(ci.BookId, 0)
            }).ToList();

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return order.OrderId;
        }

        public async Task ReduceBookQuantityAsync(CartDetailResponse cartDetail)
        {
            var bookQuantities = cartDetail.CartItems
                .ToDictionary(ci => ci.BookId, ci => ci.CountItemInCart);

            foreach (var bookId in bookQuantities.Keys)
            {
                var quantity = bookQuantities[bookId];

                await _context.Books
                    .Where(b => b.BookId == bookId && b.StockQuantity >= quantity)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(b => b.StockQuantity, b => b.StockQuantity - quantity)
                    );
            }
        }

        public async Task<bool> TryUpdateOrderStatusAsync(int orderId, List<OrderStatus> oldStatus, OrderStatus newStatus)
        {
            var result = await _context.Orders
                .Where(o => o.OrderId == orderId && oldStatus.Contains(o.OrderStatus))
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(o => o.OrderStatus, newStatus));

            return result != 0;
        }

        public async Task<string?> GetUserIdByOrderIdAsync(int orderId)
        {
            var userId = await _context.Orders
                .Where(o => o.OrderId == orderId)
                .Select(o => o.UserId)
                .FirstOrDefaultAsync();

            return userId;
        }

        public async Task ReturningBooksQuantityAsync(int orderId)
        {
            OrderStatus[] returningStates = [OrderStatus.Failed, OrderStatus.Cancelled];
            var orderDetail = await GetOrderDetailAsync(orderId);

            if (orderDetail is null || !returningStates.Contains(orderDetail.Status))
                return;

            var bookQuantities = orderDetail.OrderItems
                .ToDictionary(ci => ci.BookId, ci => ci.Count);

            foreach (var bookId in bookQuantities.Keys)
            {
                var quantity = bookQuantities[bookId];

                await _context.Books
                    .Where(b => b.BookId == bookId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(b => b.StockQuantity, b => b.StockQuantity + quantity)
                    );
            }
        }

        public async Task<List<OrderSummaryResponse>> GetUserOrdersAsync(string userId)
        {
            var result = await _context.Orders
                .Where(o => o.UserId == userId)
                .Select(o => new OrderSummaryResponse()
                {
                    OrderId = o.OrderId,
                    Status = o.OrderStatus,
                    CountItems = o.OrderItems.Count,
                    TotalPrice = o.OrderItems.Sum(oi => oi.UnitPrice * oi.Count)
                })
                .ToListAsync();

            // TODO: Pagination and sorting
            return result;
        }

        public async Task<OrderDetailResponse?> GetOrderDetailAsync(int orderId, string? userId = null)
        {
            var result = await _context.Orders
                .Where(o => o.OrderId == orderId && (userId == null || o.UserId == userId))
                .Select(o => new OrderDetailResponse()
                {
                    OrderId = o.OrderId,
                    Address = o.Address,
                    Status = o.OrderStatus,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemResponse()
                    {
                        BookId = oi.BookId,
                        Count = oi.Count,
                        BookName = oi.Book.Name,
                        BookImage = FileStorageConstants.Paths.BookImage + oi.Book.BookImages
                            .FirstOrDefault(bi => bi.IsMain)!.ImageName,
                        TotalPrice = oi.Count * oi.UnitPrice
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return result;
        }

        private async Task<Dictionary<int, decimal>> GetBooksPriceAsync(CartDetailResponse cartDetail)
        {
            var bookIds = cartDetail.CartItems.Select(ci => ci.BookId).ToList();

            var bookPrices = await _context.Books
                .Where(b => bookIds.Contains(b.BookId))
                .Select(b => new { b.BookId, b.Price })
                .ToDictionaryAsync(b => b.BookId, b => b.Price);

            return bookPrices;
        }

        public async Task<OrderPaymentInfoResponse?> GetPendingOrderAsync(string userId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId && o.OrderStatus == OrderStatus.Pending)
                .Select(o => new OrderPaymentInfoResponse()
                {
                    OrderId = o.OrderId,
                    TotalPrice = o.OrderItems.Sum(oi => oi.Count * oi.UnitPrice)
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsUserBoughtBookAsync(int bookId, string userId)
        {
            var result = await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId && o.OrderStatus == OrderStatus.Shipped)
                .AnyAsync(o => o.OrderItems.Any(oi => oi.BookId == bookId));

            return result;
        }
    }
}