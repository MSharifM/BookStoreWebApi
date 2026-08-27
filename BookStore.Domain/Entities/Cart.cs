using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Domain.Entities
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        #region Relations

        [ForeignKey("UserId")]
        public string UserId { get; set; } = null!;

        public virtual User User { get; set; } = null!;

        public virtual List<CartItem> CartItems { get; set; } = new();

        #endregion Relations
    }
}