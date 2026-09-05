using BookStore.Domain.Enums;

namespace BookStore.Application.DTOs.OrderDto
{
    public class OrderSummaryResponse
    {
        public int OrderId { get; set; }
        public decimal TotalPrice { get; set; }
        public OrderStatus Status { get; set; }
        public int CountBooks { get; set; }
    }
}