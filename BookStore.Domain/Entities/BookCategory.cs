using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Domain.Entities
{
    public class BookCategory
    {
        [ForeignKey("BookId")]
        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }

        public virtual Category Category { get; set; } = null!;
    }
}