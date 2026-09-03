using BookStore.Application.DTOs.BannerDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IBannerRepository
    {
        Task<List<BannerHomePageResponse>> GetHomePageBannerAsync();
    }
}