using BookStore.Application.DTOs.PublisherDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IPublisherRepository
    {
        Task<List<PublisherSummaryResponse>> GetBestSellerPublisher();
    }
}