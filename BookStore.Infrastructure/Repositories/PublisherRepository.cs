using BookStore.Application.Constants;
using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.PublisherDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Infrastructure.Data;
using Dapper;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class PublisherRepository : IPublisherRepository
    {
        private readonly IDapperContext _dapperContext;
        private readonly ApplicationDbContext _context;
        private readonly IBookRepository _bookRepository;

        public PublisherRepository(IDapperContext dapperContext, ApplicationDbContext context, IBookRepository bookRepository)
        {
            _dapperContext = dapperContext;
            _context = context;
            _bookRepository = bookRepository;
        }

        public async Task<List<PublisherSummaryResponse>> GetBestSellersPublisherAsync()
        {
            var query = """
                        SELECT TOP (10)
                            p.PublisherId,
                            CONCAT(@ImagePath, u.ImageProfile) AS PublisherImage,
                            u.UserName AS PublisherName
                        FROM Publishers AS p
                        INNER JOIN Users AS u
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

            var result = await connection.QueryAsync<PublisherSummaryResponse>(
                query, new { ImagePath = FileStorageConstants.Paths.UserProfile });

            return result.ToList();
        }

        public async Task<List<BookSummaryResponse>> GetPublisherBooksAsync(int publisherId, string? bookName = null, string? ISBN = null, int page = 1)
        {
            var result = await _bookRepository.GetNewestBooksAsync(publisherId, page);

            return result;
        }

        public async Task<int> GetPublisherIdAsync(string userId)
        {
            var result = await _context.Publishers
                .Where(p => p.UserId == userId)
                .Select(p => p.PublisherId)
                .FirstOrDefaultAsync();

            return result;
        }
    }
}