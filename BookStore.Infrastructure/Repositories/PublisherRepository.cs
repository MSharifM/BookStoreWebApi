using BookStore.Application.Constants;
using BookStore.Application.DTOs.PublisherDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Infrastructure.Data;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;

namespace BookStore.Infrastructure.Repositories
{
    public class PublisherRepository : IPublisherRepository
    {
        private readonly IDapperContext _dapperContext;
        private readonly ApplicationDbContext _context;

        public PublisherRepository(IDapperContext dapperContext, ApplicationDbContext context)
        {
            _dapperContext = dapperContext;
            _context = context;
        }

        public async Task<List<PublisherSummaryResponse>> GetBestSellersPublisherAsync()
        {
            var query = """
                        SELECT TOP (10)
                            p.PublisherId,
                            CONCAT(@ImagePath, u.ImageProfile) AS PublisherImage,
                            u.UserName AS PublisherName
                        FROM Publishers AS p
                        INNER JOIN AspNetUsers AS u
                            ON u.Id = p.UserId
                        INNER JOIN Books AS b
                            ON b.PublisherId = p.PublisherId
                        INNER JOIN OrderItems AS oi
                            ON oi.BookId = b.BookId
                        INNER JOIN Orders AS o
                            ON o.OrderId = oi.OrderId
                        WHERE o.OrderStatus = 2
                        GROUP BY
                            p.PublisherId,
                            u.ImageProfile,
                            u.UserName
                        ORDER BY
                            SUM(oi.Count) DESC;
                        """;

            using var connection = _dapperContext.CreateConnection();

            // TODO: Fix bug
            // var result = await connection.QueryAsync<PublisherSummaryResponse>(
            // query, new { ImagePath = FileStorageConstants.Paths.UserProfile });

            return new List<PublisherSummaryResponse>();
        }

        public async Task<int> GetPublisherIdAsync(string userId)
        {
            var result = await _context.Publishers
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .Select(p => p.PublisherId)
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<int> GetCountPublisherBookAsync(int publisherId)
        {
            var result = await _context.Books
                .AsNoTracking()
                .CountAsync(b => b.PublisherId == publisherId);

            return result;
        }

        public async Task<List<PublisherSummaryResponse>> SearchPublisherByNameAsync(string? name)
        {
            var result = await _context.Publishers
                .AsNoTracking()
                .Where(p => name != null && p.User.UserName!.Contains(name))
                .Take(5)
                .Select(p => new PublisherSummaryResponse(
                     p.PublisherId,
                     p.User.UserName!,
                     FileStorageConstants.Paths.UserProfile + p.ImagePath
                ))
                .ToListAsync();

            return result;
        }
    }
}