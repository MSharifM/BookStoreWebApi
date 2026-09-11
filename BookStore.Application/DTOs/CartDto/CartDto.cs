using System.ComponentModel.DataAnnotations;

namespace BookStore.Application.DTOs.CartDto
{
    public class AddCartRequest
    {
        public int BookId { get; set; }

        [Range(1, 100)]
        public int Count { get; set; }
    }

    public class CartDetailResponse
    {
        public int CartId { get; set; }
        public List<CartItemResponse> CartItems { get; set; } = new();
    }

    public class CartItemResponse
    {
        public int BookId { get; set; }
        public string BookName { get; set; } = null!;
        public string BookImage { get; set; } = null!;
        public int CountItemInCart { get; set; }
        public int StockQuantity { get; set; }
        public decimal TotalPrice { get; set; } // Count * price
    }

    public class UpdateCartRequest
    {
        public int BookId { get; set; }
        public bool IsIncrease { get; set; }
    }
}