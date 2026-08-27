namespace BookStore.Domain.Entities
{
    public class Favorite
    {
        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;
    }
}