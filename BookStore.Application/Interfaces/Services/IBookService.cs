using BookStore.Application.DTOs.BookDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IBookService
    {
        Task<BookDetailResponse?> GetBookDetailAsync(int bookId);

        Task<List<BookSummaryResponse>> SearchAndFilterAllBooksAsync(FilterSearchBookRequest? model, int page = 1);

        Task AddBookAsync(string userId, AddBookRequest model);

        Task DeleteBookAsync(string userId, int bookId);
    }
}