namespace BookStore.Domain.Entities
{
    public class CartItem
    {
        public int CartId { get; set; }

        public Cart Cart { get; set; } = null!;

        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        public int Count { get; set; } = 1;
    }
}