using BookStore.Application.DTOs.OrderDto;

namespace BookStore.Application.DTOs.UserProfileDto
{
    public class UserPanelDetailResponse
    {
        public string UserName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string ImageProfile { get; set; } = null!;

        public int CountFavorites { get; set; }
        public int CountOrders { get; set; }

        public OrderSummaryResponse? LastOrderSummary { get; set; }
    }
}