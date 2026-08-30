using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(RefreshToken refreshToken)
        {
            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            var result = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == token);

            return result;
        }

        public async Task RevokeAsync(RefreshToken refreshToken)
        {
            refreshToken.RevokedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}