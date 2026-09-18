using BookStore.Application.DTOs.BookDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IBookService
    {
        Task<List<BookSummaryResponse>> GetNewestBooksAsync(int? publisherId = null, int page = 1, int step = 15);

        Task<List<BookSummaryResponse>> GetPopularBooksAsync(int? publisherId = null, int page = 1, int step = 15);

        Task<List<BookSummaryResponse>> GetBestSellerBooksAsync(int? publisherId = null, int page = 1, int step = 15);

        //TODO: best discount

        Task<BookDetailResponse?> GetBookDetailAsync(int bookId);

        //TODO: get all books by filters

        Task AddBookAsync(string userId, AddBookRequest model);

        Task DeleteBookAsync(string userId, int bookId);
    }
}