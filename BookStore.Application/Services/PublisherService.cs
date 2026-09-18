using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.PublisherDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Application.Services
{
    public class PublisherService : IPublisherService
    {
        private readonly IPublisherRepository _publisherRepository;

        public PublisherService(IPublisherRepository publisherRepository)
        {
            _publisherRepository = publisherRepository;
        }

        public async Task<List<PublisherSummaryResponse>> GetBestSellersPublisher()
        {
            var result = await _publisherRepository.GetBestSellersPublisherAsync();

            return result;
        }

        public Task<List<BookSummaryResponse>> GetPublisherBooksAsync(int publisherId, string? bookName = null, string? ISBN = null, int page = 1)
        {
            return null;
        }
    }
}