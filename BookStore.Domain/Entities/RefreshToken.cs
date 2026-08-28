namespace BookStore.Domain.Entities
{
    public class RefreshToken
    {
        public int RefreshTokenId { get; set; }

        public string Token { get; set; } = null!;

        public DateTime ExpiryDate { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? RevokedDate { get; set; }

        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;
    }
}