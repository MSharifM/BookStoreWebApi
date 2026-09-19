using BookStore.Application.DTOs.BookDto;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IBookRepository
    {
        Task<List<BookSummaryResponse>> GetNewestBooksAsync(int? publisherId = null, int page = 1, int step = 15);

        Task<List<BookSummaryResponse>> GetPopularBooksAsync(int? publisherId = null, int page = 1, int step = 15);

        Task<List<BookSummaryResponse>> GetBestSellerBooksAsync(int? publisherId = null, int page = 1, int step = 15);

        //TODO: best discount

        Task<BookDetailResponse?> GetBookDetailAsync(int bookId);

        //TODO: get all books by filters

        Task<bool> IsExitsISBNAsync(string ISBN);

        Task<int> CreateBookAsync(int publisherId, AddBookRequest model);

        Task DeleteBookAsync(int publisherId, int bookId);
    }
}