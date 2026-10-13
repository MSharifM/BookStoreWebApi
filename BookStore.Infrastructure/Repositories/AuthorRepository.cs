using BookStore.Application.Constants;
using BookStore.Application.DTOs.AuthorDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Enums;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public AuthorRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<AuthorSummaryResponse>> SearchAuthorByNameAsync(string? name)
        {
            var result = await _dbContext.Authors
                .AsNoTracking()
                .Where(a => name != null && a.FullName.Contains(name))
                .Take(5)
                .Select(a => new AuthorSummaryResponse(
                   a.AuthorId,
                   a.FullName,
                   FileStorageConstants.Paths.UserProfile + a.ImagePath))
                .ToListAsync();

            return result;
        }
    }
}