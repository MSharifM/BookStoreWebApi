using BookStore.Domain.Entities;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task AddAsync(RefreshToken refreshToken);

        Task<RefreshToken?> GetByTokenAsync(string token);

        Task RevokeAsync(RefreshToken refreshToken);
    }
}