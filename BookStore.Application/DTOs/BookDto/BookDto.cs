using System.Security.Principal;

namespace BookStore.Application.DTOs.BookDto
{
    public class BookSummaryResponse
    {
        public int BookId { get; set; }
        public string Name { get; set; } = null!;
        public string BookImage { get; set; } = null!;
        public int StockQuantity { get; set; }
        public decimal Price { get; set; }
        public string AuthorNames { get; set; } = null!;
        public double Rate { get; set; }
    }

    public class BookDetailResponse
    {
        public string Name { get; set; } = null!;
        public int WeightGram { get; set; }
        public int PublicationYear { get; set; }
        public string ISBN { get; set; } = null!;
        public string? DemoPDFPath { get; set; }
        public int CountPages { get; set; }
        public string Language { get; set; } = null!;
        public int StockQuantity { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public DateTime CreateDate { get; set; }
        public double Rate { get; set; }

        public List<string> WriterNames { get; set; } = new();
        public List<string> EditorNames { get; set; } = new();
        public List<string> TranslatorNames { get; set; } = new();

        public int PublisherId { get; set; }
        public string PublisherName { get; set; } = null!;

        public List<CategoryDto.CategoryDto> Category { get; set; } = new();

        public List<string> BookImages { get; set; } = new();
    }

    public class ReviewBookResponse
    {
        public int ReviewId { get; set; }
        public float Rate { get; set; }
        public string Content { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string UserImage { get; set; } = null!;
        public DateTime CreateDate { get; set; }
        public int Like { get; set; }
        public int Dislike { get; set; }
    }
}