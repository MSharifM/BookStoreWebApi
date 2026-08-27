namespace BookStore.Domain.Entities
{
    public class Author
    {
        public int AuthorId { get; set; }

        public string FullName { get; set; } = null!;

        public string ImagePath { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string PersonalCode { get; set; } = null!;

        #region Relations

        public virtual List<BookAuthor> BookAuthors { get; set; } = new();

        #endregion Relations
    }
}