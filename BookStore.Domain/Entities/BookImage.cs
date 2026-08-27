using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Domain.Entities
{
    public class BookImage
    {
        public int BookImageId { get; set; }

        [ForeignKey("BookId")]
        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        public string ImageName { get; set; } = null!;

        public bool IsMain { get; set; } = false;

        public int DisplayOrder { get; set; }
    }
}