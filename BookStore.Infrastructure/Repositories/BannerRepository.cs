using BookStore.Application.DTOs.BannerDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class BannerRepository : IBannerRepository
    {
        private readonly ApplicationDbContext _context;

        public BannerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<BannerHomePageResponse>> GetHomePageBannerAsync()
        {
            var result = await _context.Banners
                .AsNoTracking()
                .Select(b => new BannerHomePageResponse()
                {
                    ImageName = b.ImagePath,
                    Url = b.Url
                })
                .ToListAsync();

            return result;
        }
    }
}