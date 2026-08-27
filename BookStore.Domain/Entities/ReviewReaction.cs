namespace BookStore.Domain.Entities
{
    public class ReviewReaction
    {
        public bool IsLike { get; set; }

        #region Relations

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public int ReviewId { get; set; }

        public virtual Review Review { get; set; } = null!;

        #endregion Relations
    }
}