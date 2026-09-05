using BookStore.Application.DTOs.OrderDto;
using BookStore.Application.DTOs.UserProfileDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class UserPanelRepository : IUserPanelRepository
    {
        private readonly ApplicationDbContext _context;

        public UserPanelRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserPanelDetailResponse?> GetUserPanelDetailAsync(string userId)
        {
            var result = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => new UserPanelDetailResponse
                {
                    UserName = u.UserName!,
                    Phone = u.PhoneNumber,
                    Email = u.Email,
                    ImageProfile = u.ImageProfile,
                    CountFavorites = u.Favorites.Count,
                    CountOrders = u.Orders.Count,
                    LastOrderSummary = u.Orders
                        .OrderByDescending(o => o.CreateDate)
                        .Select(o => new OrderSummaryResponse
                        {
                            OrderId = o.OrderId,
                            Status = o.OrderStatus,
                            TotalPrice = o.OrderItems.Sum(oi => oi.Count * oi.UnitPrice),
                            CountBooks = o.OrderItems.Sum(oi => oi.Count)
                        })
                        .FirstOrDefault()
                })
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            return result;
        }
    }
}