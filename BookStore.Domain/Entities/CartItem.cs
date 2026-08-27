using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Domain.Entities
{
    public class CartItem
    {
        [Required]
        [ForeignKey("CartId")]
        public int CartId { get; set; }

        public Cart Cart { get; set; } = null!;

        [Required]
        [ForeignKey("BookId")]
        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        public int Count { get; set; } = 1;
    }
}