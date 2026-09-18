using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.PublisherDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface IPublisherService
    {
        Task<List<PublisherSummaryResponse>> GetBestSellersPublisher();

        Task<List<BookSummaryResponse>> GetPublisherBooksAsync(int publisherId, string? bookName = null, string? ISBN = null, int page = 1);
    }
}