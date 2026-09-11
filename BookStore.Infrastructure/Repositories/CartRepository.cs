using BookStore.Application.Constants;
using BookStore.Application.DTOs.CartDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddToCartAsync(string userId, AddCartRequest model)
        {
            var cartId = await _context.Carts
                .Where(c => c.UserId == userId)
                .Select(c => c.CartId)
                .FirstOrDefaultAsync();

            if (cartId == 0)
                return false;

            var book = await _context.Books
                .AsNoTracking()
                .Where(b => b.BookId == model.BookId && !b.IsDelete)
                .Select(b => new
                {
                    b.BookId,
                    b.StockQuantity
                })
                .FirstOrDefaultAsync();

            if (book is null || book.StockQuantity < model.Count)
                return false;

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId &&
                                           ci.BookId == model.BookId);

            if (cartItem is null)
            {
                await _context.CartItems.AddAsync(new CartItem
                {
                    CartId = cartId,
                    BookId = model.BookId,
                    Count = model.Count
                });
            }
            else
            {
                cartItem.Count = model.Count;
            }

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<CartDetailResponse?> GetCartDetailAsync(string userId)
        {
            var result = await _context.Carts
                .AsNoTracking()
                .Where(c => c.UserId == userId)
                .Select(c => new CartDetailResponse
                {
                    CartId = c.CartId,
                    CartItems = c.CartItems.Select(ci => new CartItemResponse
                    {
                        BookId = ci.BookId,
                        BookName = ci.Book.Name,
                        BookImage = FileStorageConstants.Paths.BookImage + ci.Book.BookImages
                            .FirstOrDefault(bi => bi.IsMain)!.ImageName,
                        StockQuantity = ci.Book.StockQuantity,
                        CountItemInCart = ci.Count,
                        TotalPrice = ci.Book.Price * ci.Count,
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<bool> RemoveFromCartAsync(string userId, int bookId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Cart.UserId == userId && ci.BookId == bookId);

            if (cartItem == null)
                return false;

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateCartAsync(string userId, UpdateCartRequest model)
        {
            var cartItem = await _context.CartItems
                .Include(cartItem => cartItem.Book)
                .FirstOrDefaultAsync(ci => ci.Cart.UserId == userId && ci.BookId == model.BookId);

            if (cartItem == null)
                return false;

            if (model.IsIncrease && cartItem.Book.StockQuantity >= cartItem.Count + 1)
                cartItem.Count++;
            else if (!model.IsIncrease && cartItem.Count > 1)
                cartItem.Count--;
            else
                return false;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task ClearCartAsync(string userId)
        {
            await _context.CartItems
                .Where(c => c.Cart.UserId == userId)
                .ExecuteDeleteAsync();
        }
    }
}