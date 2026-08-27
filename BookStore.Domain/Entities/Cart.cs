namespace BookStore.Domain.Entities
{
    public class Cart
    {
        public int CartId { get; set; }

        #region Relations

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public virtual List<CartItem> CartItems { get; set; } = new();

        #endregion Relations
    }
}