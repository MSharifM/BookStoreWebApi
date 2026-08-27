namespace BookStore.Domain.Entities
{
    public class OrderItem
    {
        public int OrderId { get; set; }

        public virtual Order Order { get; set; } = null!;

        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        public int Count { get; set; } = 1;

        public decimal UnitPrice { get; set; }
    }
}