using BookStore.Application.Constants;
using Microsoft.EntityFrameworkCore;
using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.CategoryDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Domain.Enums;
using BookStore.Infrastructure.Data;
using Dapper;

namespace BookStore.Infrastructure.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IDapperContext _dapperContext;

        public BookRepository(ApplicationDbContext context, IDapperContext dapperContext)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            _dapperContext = dapperContext;
        }

        #region HomePage

        public async Task<List<BookSummaryResponse>> GetNewestBooksAsync()
        {
            const string query = """
                                 SELECT TOP (20)
                                     b.BookId,
                                     b.Name,
                                     b.Price,
                                     b.StockQuantity,
                                     CONCAT(@ImagePath, bi.ImageName) AS BookImage,
                                     authors.AuthorNames,
                                     ISNULL(reviews.AverageRate, 0) AS Rate
                                 FROM Books AS b

                                 OUTER APPLY
                                 (
                                     SELECT TOP (1) bi.ImageName
                                     FROM BookImages AS bi
                                     WHERE bi.BookId = b.BookId
                                       AND bi.IsMain = 1
                                 ) AS bi

                                 OUTER APPLY
                                 (
                                     SELECT STRING_AGG(x.FullName, ', ') AS AuthorNames
                                     FROM
                                     (
                                         SELECT DISTINCT a.FullName
                                         FROM BookAuthors AS ba
                                         INNER JOIN Authors AS a
                                             ON a.AuthorId = ba.AuthorId
                                         WHERE ba.BookId = b.BookId
                                     ) AS x
                                 ) AS authors

                                 OUTER APPLY
                                 (
                                     SELECT AVG(CAST(r.Rate AS DECIMAL(10, 2))) AS AverageRate
                                     FROM Reviews AS r
                                     WHERE r.BookId = b.BookId
                                 ) AS reviews

                                 ORDER BY b.CreateDate DESC, b.BookId;
                                 """;

            using var connection = _dapperContext.CreateConnection();

            var result = await connection.QueryAsync<BookSummaryResponse>(
                query, new { ImagePath = FileStorageConstants.Paths.BookImage });

            return result.ToList();
        }

        public async Task<List<BookSummaryResponse>> GetPopularBooksAsync()
        {
            string query = """
                            SELECT
                               b.BookId,
                               b.Name,
                               b.Price,
                               b.StockQuantity,
                               CONCAT(@ImagePath, bi.ImageName) AS BookImage,
                               authors.AuthorNames,
                               reviews.AverageRate AS Rate
                           FROM Books AS b

                           OUTER APPLY
                           (
                               SELECT TOP (1)
                                   bi.ImageName
                               FROM BookImages AS bi
                               WHERE bi.BookId = b.BookId
                                 AND bi.IsMain = 1
                           ) AS bi

                           OUTER APPLY
                           (
                               SELECT STRING_AGG(x.FullName, ', ') AS AuthorNames
                               FROM
                               (
                                   SELECT DISTINCT
                                       a.FullName
                                   FROM BookAuthors AS ba
                                   INNER JOIN Authors AS a
                                       ON a.AuthorId = ba.AuthorId
                                   WHERE ba.BookId = b.BookId
                               ) AS x
                           ) AS authors

                           INNER JOIN
                           (
                               SELECT
                                   r.BookId,
                                   AVG(CAST(r.Rate AS DECIMAL(10, 2))) AS AverageRate
                               FROM Reviews AS r
                               GROUP BY r.BookId
                           ) AS reviews
                               ON reviews.BookId = b.BookId

                           ORDER BY
                               reviews.AverageRate DESC;
                           """;

            using var connection = _dapperContext.CreateConnection();

            var result = await connection.QueryAsync<BookSummaryResponse>(
                query, new { ImagePath = FileStorageConstants.Paths.BookImage });

            return result.ToList();
        }

        public async Task<List<BookSummaryResponse>> GetBestSellerBooksAsync()
        {
            string query = """
                           SELECT
                               b.BookId,
                               b.Name,
                               b.Price,
                               b.StockQuantity,
                               CONCAT(@ImagePath, bi.ImageName) AS BookImage,
                               authors.AuthorNames,
                               sales.TotalSold AS Rate
                           FROM Books AS b

                           OUTER APPLY
                           (
                               SELECT TOP (1)
                                   bi.ImageName
                               FROM BookImages AS bi
                               WHERE bi.BookId = b.BookId
                                 AND bi.IsMain = 1
                           ) AS bi

                           OUTER APPLY
                           (
                               SELECT STRING_AGG(x.FullName, ', ') AS AuthorNames
                               FROM
                               (
                                   SELECT DISTINCT
                                       a.FullName
                                   FROM BookAuthors AS ba
                                   INNER JOIN Authors AS a
                                       ON a.AuthorId = ba.AuthorId
                                   WHERE ba.BookId = b.BookId
                               ) AS x
                           ) AS authors

                           INNER JOIN
                           (
                               SELECT
                                   oi.BookId,
                                   SUM(oi.Count) AS TotalSold
                               FROM OrderItems AS oi
                               INNER JOIN Orders AS o
                                   ON o.OrderId = oi.OrderId
                               WHERE o.OrderStatus = 2
                               GROUP BY oi.BookId
                           ) AS sales
                               ON sales.BookId = b.BookId

                           ORDER BY
                               sales.TotalSold DESC;
                           """;

            using var connection = _dapperContext.CreateConnection();

            var result = await connection.QueryAsync<BookSummaryResponse>(
                query, new { ImagePath = FileStorageConstants.Paths.BookImage });

            return result.ToList();
        }

        #endregion HomePage

        public Task<BookDetailResponse?> GetBookDetailAsync(int bookId)
        {
            var bookDetail = _context.Books
                .AsNoTracking()
                .Where(b => b.BookId == bookId)
                .Select(b => new BookDetailResponse()
                {
                    Name = b.Name,
                    WeightGram = b.WeightGram,
                    PublicationYear = b.PublicationYear,
                    Price = b.Price,
                    CreateDate = b.CreateDate,
                    CountPages = b.CountPages,
                    DemoPDFPath = FileStorageConstants.Paths.BookDemo + b.DemoPDFPath,
                    Description = b.Description,
                    ISBN = b.ISBN,
                    Language = b.Language,
                    StockQuantity = b.StockQuantity,
                    PublisherId = b.PublisherId,
                    PublisherName = b.Publisher.User.UserName!,
                    Rate = b.Reviews.Average(r => r.Rate),

                    BookImages = b.BookImages.OrderBy(bi => bi.DisplayOrder)
                        .Select(bi => FileStorageConstants.Paths.BookImage + bi.ImageName).ToList(),

                    WriterNames = b.BookAuthors.Where(ba => ba.AuthorType == AuthorType.Writer)
                        .Select(ba => ba.Author.FullName).ToList(),

                    EditorNames = b.BookAuthors.Where(ba => ba.AuthorType == AuthorType.Editor)
                        .Select(ba => ba.Author.FullName).ToList(),

                    TranslatorNames = b.BookAuthors.Where(ba => ba.AuthorType == AuthorType.Translator)
                        .Select(ba => ba.Author.FullName).ToList(),

                    Category = b.BookCategories.Select(bc => new CategoryDto()
                    {
                        CategoryName = bc.Category.CategoryName,
                        CategoryId = bc.Category.CategoryId
                    })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            return bookDetail;
        }

        public async Task<List<ReviewBookResponse>> GetBookReviews(int bookId, int page = 1)
        {
            var step = 7;
            var skip = (page - 1) * step;

            var result = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.BookId == bookId)
                .OrderByDescending(r => r.CreateDate)
                .ThenByDescending(r => r.ReviewId)
                .Skip(skip)
                .Take(step)
                .Select(r => new ReviewBookResponse()
                {
                    UserName = r.User.UserName!,
                    UserImage = FileStorageConstants.Paths.UserProfile + r.User.ImageProfile,
                    Content = r.Content,
                    Rate = r.Rate,
                    CreateDate = r.CreateDate,
                    ReviewId = r.ReviewId,
                    Like = r.ReviewReactions.Count(rr => rr.IsLike),
                    Dislike = r.ReviewReactions.Count(rr => !rr.IsLike)
                })
                .ToListAsync();

            return result;
        }
    }
}