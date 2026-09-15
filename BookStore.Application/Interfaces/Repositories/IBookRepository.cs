using BookStore.Application.DTOs.BookDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IBookRepository
    {
        Task<List<BookSummaryResponse>> GetNewestBooksAsync();

        Task<List<BookSummaryResponse>> GetPopularBooksAsync();

        Task<List<BookSummaryResponse>> GetBestSellerBooksAsync();

        //TODO: best discount

        Task<BookDetailResponse?> GetBookDetailAsync(int bookId);
    }
}