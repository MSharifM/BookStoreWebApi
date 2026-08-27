namespace BookStore.Domain.Entities
{
    public class Book
    {
        public int BookId { get; set; }

        public string Name { get; set; } = null!;

        public int WeightGram { get; set; }

        public int PublicationYear { get; set; }

        public string ISBN { get; set; } = null!;

        public string DemoPDFPath { get; set; } = null!;

        public int CountPages { get; set; }

        public string Language { get; set; } = null!;

        public int StockQuantity { get; set; }

        public decimal Price { get; set; }

        public bool IsDelete { get; set; } = false;

        #region Relations

        public int PublisherId { get; set; }

        public virtual Publisher Publisher { get; set; } = null!;

        public virtual List<BookAuthor> BookAuthors { get; set; } = new();

        public virtual List<BookCategory> BookCategories { get; set; } = new();

        public virtual List<BookImage> BookImages { get; set; } = new();

        public virtual List<Review> Reviews { get; set; } = new();

        public virtual List<Favorite> Favorites { get; set; } = new();

        public virtual List<OrderItem> OrderItems { get; set; } = new();

        public virtual List<CartItem> CartItems { get; set; } = new();

        #endregion Relations
    }
}