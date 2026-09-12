using BookStore.Domain.Enums;

namespace BookStore.Application.DTOs.OrderDto
{
    public class OrderSummaryResponse
    {
        public int OrderId { get; set; }
        public decimal TotalPrice { get; set; }
        public OrderStatus Status { get; set; }
        public int CountItems { get; set; }
    }

    public class OrderDetailResponse
    {
        public int OrderId { get; set; }
        public string Address { get; set; } = null!;
        public OrderStatus Status { get; set; }
        public List<OrderItemResponse> OrderItems { get; set; } = new();
    }

    public class OrderItemResponse
    {
        public int BookId { get; set; }
        public string BookName { get; set; } = null!;
        public string BookImage { get; set; } = null!;
        public int Count { get; set; }
        public decimal TotalPrice { get; set; } // Count * price
    }

    public class PaymentGatewayRequest
    {
        public int OrderId { get; set; }
        public bool IsSuccess { get; set; }
        // Add other properties
    }
}