using BookStore.Application.DTOs.CommonDto;

namespace BookStore.Application.DTOs.BookDto
{
    public class BookSummaryResponse
    {
        public int BookId { get; set; }
        public string Name { get; set; } = null!;
        public string BookImage { get; set; } = null!;
        public int StockQuantity { get; set; }
        public int PublicationYear { get; set; }
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

    public class AddBookRequest
    {
        public string Name { get; set; } = null!;
        public int WeightGram { get; set; }
        public int PublicationYear { get; set; }
        public string ISBN { get; set; } = null!;
        public FileDataDto? DemoPDFFile { get; set; }
        public int CountPages { get; set; }
        public string Language { get; set; } = null!;
        public int StockQuantity { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public List<int> WriterIds { get; set; } = new();
        public List<int> EditorIds { get; set; } = new();
        public List<int> TranslatorIds { get; set; } = new();
        public List<int> CategoryIds { get; set; } = new();
        public List<BookImageDto> BookImages { get; set; } = new();
    }

    public class BookImageDto
    {
        public FileDataDto? File { get; set; }
        public bool IsMain { get; set; } = false;
        public int DisplayOrder { get; set; }
    }
}