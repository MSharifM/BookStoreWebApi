using BookStore.Application.DTOs.PublisherDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IPublisherRepository
    {
        Task<List<PublisherSummaryResponse>> GetBestSellersPublisherAsync();

        Task<int> GetPublisherIdAsync(string userId);

        Task<int> GetCountPublisherBookAsync(int publisherId);
    }
}