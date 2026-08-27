namespace BookStore.Domain.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = null!;

        public virtual List<BookCategory> BookCategories { get; set; } = new();
    }
}