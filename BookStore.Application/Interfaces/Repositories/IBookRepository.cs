using BookStore.Application.DTOs.BookDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IBookRepository
    {
        Task<List<BookSummaryResponse>> GetNewestBooksAsync(int sortBy, FilterSearchBookRequest model, int? publisherId = null, int page = 1, int step = 15);

        Task<List<BookSummaryResponse>> GetPopularBooksAsync(FilterSearchBookRequest model, int? publisherId = null, int page = 1, int step = 15);

        Task<List<BookSummaryResponse>> GetBestSellerBooksAsync(FilterSearchBookRequest model, int? publisherId = null, int page = 1, int step = 15);

        //TODO: best discount

        Task<BookDetailResponse?> GetBookDetailAsync(int bookId);

        Task<bool> IsExitsISBNAsync(string ISBN);

        Task<int> CreateBookAsync(int publisherId, AddBookRequest model);

        Task DeleteBookAsync(int publisherId, int bookId);
    }
}