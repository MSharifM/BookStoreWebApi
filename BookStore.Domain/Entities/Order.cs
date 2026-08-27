using System.ComponentModel.DataAnnotations.Schema;
using BookStore.Domain.Enums;

namespace BookStore.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.Now;

        public OrderStatus OrderStatus { get; set; }

        public string Address { get; set; } = null!;

        #region Relations

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public virtual List<OrderItem> OrderItems { get; set; } = new();

        #endregion Relations
    }
}