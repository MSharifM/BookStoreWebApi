using System.ComponentModel.DataAnnotations.Schema;
using BookStore.Domain.Enums;

namespace BookStore.Domain.Entities
{
    public class BookAuthor
    {
        [ForeignKey("BookId")]
        public int BookId { get; set; }

        public virtual Book Book { get; set; } = null!;

        [ForeignKey("AuthorId")]
        public int AuthorId { get; set; }

        public virtual Author Author { get; set; } = null!;

        public AuthorType AuthorType { get; set; }
    }
}