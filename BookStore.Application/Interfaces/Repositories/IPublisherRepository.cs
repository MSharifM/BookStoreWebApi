using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.PublisherDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IPublisherRepository
    {
        Task<List<PublisherSummaryResponse>> GetBestSellersPublisherAsync();

        Task<List<BookSummaryResponse>> GetPublisherBooksAsync(int publisherId, string? bookName = null, string? ISBN = null, int page = 1);

        Task<int> GetPublisherIdAsync(string userId);

        Task<int> GetCountPublisherBookAsync(int publisherId);
    }
}