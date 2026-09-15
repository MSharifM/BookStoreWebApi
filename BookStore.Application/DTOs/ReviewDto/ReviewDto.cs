namespace BookStore.Application.DTOs.ReviewDto
{
    public class ReviewBookResponse
    {
        public int ReviewId { get; set; }
        public float Rate { get; set; }
        public string Content { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string UserImage { get; set; } = null!;
        public DateTime CreateDate { get; set; }
        public int Like { get; set; }
        public int Dislike { get; set; }
        public ReactionDto? UserReaction { get; set; }
    }

    public class ReactionDto
    {
        public bool IsLike { get; set; }
    }

    public class AddReviewRequest
    {
        public int BookId { get; set; }
        public string Content { get; set; } = null!;
        public int Rate { get; set; }
    }

    public class ReactionRequest
    {
        public int ReviewId { get; set; }
        public bool IsLike { get; set; }
    }
}