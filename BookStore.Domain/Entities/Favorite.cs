using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Domain.Entities
{
    public class Favorite
    {
        [ForeignKey("UserId")]
        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        [ForeignKey("BookId")]
        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;
    }
}