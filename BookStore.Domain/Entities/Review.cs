namespace BookStore.Domain.Entities
{
    public class Review
    {
        public int ReviewId { get; set; }

        public string Content { get; set; } = null!;

        public int Rate { get; set; }

        public DateTime CreateDate { get; set; } = DateTime.Now;

        #region Relations

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        public virtual List<ReviewReaction> ReviewReactions { get; set; } = new();

        #endregion Relations
    }
}