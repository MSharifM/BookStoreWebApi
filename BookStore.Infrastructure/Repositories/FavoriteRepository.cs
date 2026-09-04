using BookStore.Application.Constants;
using BookStore.Application.DTOs.FavoriteDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    internal class FavoriteRepository : IFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddToFavoriteAsync(string userId, int bookId)
        {
            var isItemExist = await _context.Favorites
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BookId == bookId);

            if (isItemExist != null)
                return true;

            var book = await _context.Books
                .AsNoTracking()
                .Where(b => b.BookId == bookId && !b.IsDelete)
                .Select(b => new
                {
                    b.BookId,
                })
                .FirstOrDefaultAsync();

            if (book is null)
                return false;

            await _context.Favorites.AddAsync(new Favorite()
            {
                BookId = bookId,
                UserId = userId
            });

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<FavoriteItemsDetailResponse>?> GetFavoriteItemsDetailAsync(string userId)
        {
            var result = await _context.Favorites
                .AsNoTracking()
                .Where(f => f.UserId == userId)
                .Select(f => new FavoriteItemsDetailResponse()
                {
                    BookId = f.BookId,
                    BookName = f.Book.Name,
                    BookImage = FileStoragePaths.BookImageFolder + f.Book.BookImages
                        .FirstOrDefault(bi => bi.IsMain)!.ImageName,
                })
                .ToListAsync();

            return result;
        }

        public async Task<bool> RemoveFromFavoriteAsync(string userId, int bookId)
        {
            var favoriteItem = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BookId == bookId);

            if (favoriteItem == null)
                return false;

            _context.Favorites.Remove(favoriteItem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task ClearFavoriteAsync(string userId)
        {
            await _context.Favorites
                .Where(f => f.UserId == userId)
                .ExecuteDeleteAsync();
        }
    }
}