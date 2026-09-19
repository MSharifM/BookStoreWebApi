using BookStore.Application.Constants;
using BookStore.Application.DTOs.BookDto;
using BookStore.Application.DTOs.CategoryDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;
using BookStore.Domain.Entities;
using BookStore.Domain.Enums;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
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
            _dapperContext = dapperContext;
        }

        #region HomePage

        public async Task<List<BookSummaryResponse>> GetNewestBooksAsync(int? publisherId = null, int page = 1, int step = 15)
        {
            const string query = """
                                 DECLARE @Offset INT = (@Page - 1) * @Step;

                                 WITH FilteredBooks AS
                                 (
                                     SELECT
                                         b.BookId,
                                         b.Name,
                                         b.Price,
                                         b.StockQuantity,
                                         b.PublisherId,
                                         b.CreateDate
                                     FROM Books AS b
                                     WHERE (@PublisherId IS NULL OR b.PublisherId = @PublisherId)
                                 )
                                 SELECT
                                     b.BookId,
                                     b.Name,
                                     b.Price,
                                     b.StockQuantity,
                                     CONCAT(@ImagePath, bi.ImageName) AS BookImage,
                                     authors.AuthorNames,
                                     ISNULL(reviews.AverageRate, 0) AS Rate
                                 FROM FilteredBooks AS b

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

                                 OUTER APPLY
                                 (
                                     SELECT AVG(CAST(r.Rate AS DECIMAL(10, 2))) AS AverageRate
                                     FROM Reviews AS r
                                     WHERE r.BookId = b.BookId
                                 ) AS reviews

                                 ORDER BY
                                     b.CreateDate DESC,
                                     b.BookId
                                 OFFSET @Offset ROWS
                                 FETCH NEXT @Step ROWS ONLY;
                                 """;

            using var connection = _dapperContext.CreateConnection();

            var result = await connection.QueryAsync<BookSummaryResponse>(
                query, new
                {
                    ImagePath = FileStorageConstants.Paths.BookImage,
                    PublisherId = publisherId,
                    Page = page,
                    Step = step
                });

            return result.ToList();
        }

        public async Task<List<BookSummaryResponse>> GetPopularBooksAsync(int? publisherId = null, int page = 1, int step = 15)
        {
            string query = """
                            DECLARE @Offset INT = (@Page - 1) * @Step;

                           WITH BookReviews AS
                           (
                               SELECT
                                   r.BookId,
                                   AVG(CAST(r.Rate AS DECIMAL(10, 2))) AS AverageRate
                               FROM Reviews AS r
                               GROUP BY r.BookId
                           ),
                           FilteredBooks AS
                           (
                               SELECT
                                   b.BookId,
                                   b.Name,
                                   b.Price,
                                   b.StockQuantity,
                                   b.PublisherId
                               FROM Books AS b
                               WHERE (@PublisherId IS NULL OR b.PublisherId = @PublisherId)
                           )
                           SELECT
                               b.BookId,
                               b.Name,
                               b.Price,
                               b.StockQuantity,
                               CONCAT(@ImagePath, bi.ImageName) AS BookImage,
                               authors.AuthorNames,
                               reviews.AverageRate AS Rate
                           FROM FilteredBooks AS b

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

                           INNER JOIN BookReviews AS reviews
                               ON reviews.BookId = b.BookId

                           ORDER BY
                               reviews.AverageRate DESC,
                               b.BookId
                           OFFSET @Offset ROWS
                           FETCH NEXT @Step ROWS ONLY;
                           """;

            using var connection = _dapperContext.CreateConnection();

            var result = await connection.QueryAsync<BookSummaryResponse>(
                query, new
                {
                    ImagePath = FileStorageConstants.Paths.BookImage,
                    PublisherId = publisherId,
                    Page = page,
                    Step = step
                });
            return result.ToList();
        }

        public async Task<List<BookSummaryResponse>> GetBestSellerBooksAsync(int? publisherId = null, int page = 1, int step = 15)
        {
            string query = """
                           DECLARE @Offset INT = (@Page - 1) * @Step;

                           WITH BookSales AS
                           (
                               SELECT
                                   oi.BookId,
                                   SUM(oi.Count) AS TotalSold
                               FROM OrderItems AS oi
                               INNER JOIN Orders AS o
                                   ON o.OrderId = oi.OrderId
                               WHERE o.OrderStatus = 2
                               GROUP BY oi.BookId
                           ),
                           FilteredBooks AS
                           (
                               SELECT
                                   b.BookId,
                                   b.Name,
                                   b.Price,
                                   b.StockQuantity,
                                   b.PublisherId
                               FROM Books AS b
                               WHERE (@PublisherId IS NULL OR b.PublisherId = @PublisherId)
                           )
                           SELECT
                               b.BookId,
                               b.Name,
                               b.Price,
                               b.StockQuantity,
                               CONCAT(@ImagePath, bi.ImageName) AS BookImage,
                               authors.AuthorNames,
                               sales.TotalSold AS Rate
                           FROM FilteredBooks AS b

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

                           INNER JOIN BookSales AS sales
                               ON sales.BookId = b.BookId

                           ORDER BY
                               sales.TotalSold DESC,
                               b.BookId
                           OFFSET @Offset ROWS
                           FETCH NEXT @Step ROWS ONLY;
                           """;

            using var connection = _dapperContext.CreateConnection();

            var result = await connection.QueryAsync<BookSummaryResponse>(
                query, new
                {
                    ImagePath = FileStorageConstants.Paths.BookImage,
                    PublisherId = publisherId,
                    Page = page,
                    Step = step
                });
            return result.ToList();
        }

        #endregion HomePage

        public async Task<BookDetailResponse?> GetBookDetailAsync(int bookId)
        {
            var bookDetail = await _context.Books
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
                    DemoPDFPath = b.DemoPDFPath != null ? FileStorageConstants.Paths.BookDemo + b.DemoPDFPath : "",
                    Description = b.Description,
                    ISBN = b.ISBN,
                    Language = b.Language,
                    StockQuantity = b.StockQuantity,
                    PublisherId = b.PublisherId,
                    PublisherName = b.Publisher.User.UserName!,
                    Rate = b.Reviews.Any() ? b.Reviews.Average(r => r.Rate) : 0,

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

        public async Task<bool> IsExitsISBNAsync(string ISBN)
        {
            var result = await _context.Books
                .AsNoTracking()
                .AnyAsync(b => b.ISBN == ISBN);

            return result;
        }

        public async Task<int> CreateBookAsync(int publisherId, AddBookRequest model)
        {
            var book = new Book()
            {
                PublisherId = publisherId,
                Name = model.Name,
                WeightGram = model.WeightGram,
                PublicationYear = model.PublicationYear,
                ISBN = model.ISBN,
                DemoPDFPath = model.DemoPDFFile?.UniqName,
                CountPages = model.CountPages,
                Language = model.Language,
                StockQuantity = model.StockQuantity,
                Description = model.Description,
                Price = model.Price,
            };

            book.BookAuthors.AddRange(CreateBookAuthorList(model.WriterIds, AuthorType.Writer));
            book.BookAuthors.AddRange(CreateBookAuthorList(model.EditorIds, AuthorType.Editor));
            book.BookAuthors.AddRange(CreateBookAuthorList(model.TranslatorIds, AuthorType.Translator));

            book.BookCategories.AddRange(CreateBookCategoryList(model.CategoryIds));

            book.BookImages.AddRange(model.BookImages.Select(bi => new BookImage()
            {
                ImageName = bi.File.UniqName ?? FileStorageConstants.Defaults.UserProfileImage,
                DisplayOrder = bi.DisplayOrder,
                IsMain = bi.IsMain
            }));

            await _context.AddAsync(book);
            await _context.SaveChangesAsync();

            return book.BookId;
        }

        public async Task DeleteBookAsync(int publisherId, int bookId)
        {
            await _context.Books
                .Where(b => b.BookId == bookId && b.PublisherId == publisherId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(b => b.IsDelete, true));
        }

        private List<BookAuthor> CreateBookAuthorList(List<int> ids, AuthorType type)
        {
            return ids.Select(id => new BookAuthor()
            {
                AuthorId = id,
                AuthorType = type
            }).ToList();
        }

        private List<BookCategory> CreateBookCategoryList(List<int> categoryIds)
        {
            return categoryIds.Select(id => new BookCategory()
            {
                CategoryId = id,
            }).ToList();
        }
    }
}