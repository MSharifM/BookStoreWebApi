using Microsoft.AspNetCore.Identity;

namespace BookStore.Domain.Entities
{
    public class User : IdentityUser
    {
        public string ImageProfile { get; set; } = null!;

        #region Relations

        public virtual Cart Cart { get; set; } = null!;

        public virtual List<Order> Orders { get; set; } = new();

        public virtual List<Review> Reviews { get; set; } = new();

        public virtual List<ReviewReaction> ReviewReactions { get; set; } = new();

        public virtual List<Address> Addresses { get; set; } = new();

        public virtual List<Favorite> Favorites { get; set; } = null!;

        public virtual Publisher Publisher { get; set; } = null!;

        public virtual List<RefreshToken> RefreshTokens { get; set; } = new();

        #endregion Relations
    }
}