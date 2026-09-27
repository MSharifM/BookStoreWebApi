using BookStore.Application.DTOs.CategoryDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ListCategoriesResponse>> GetCategoriesAsync(string? categoryName = null)
        {
            var categories = _context.Categories
                .Where(c => categoryName == null || c.CategoryName.Contains(categoryName));

            // If categoryName is null return 5 items, else return all categories
            if (!string.IsNullOrEmpty(categoryName))
                categories = categories.Take(5);

            var result = await categories
                .Select(c => new ListCategoriesResponse()
                {
                    Category = new CategoryDto()
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.CategoryName
                    },
                    CountBooks = c.BookCategories.Count
                })
                .ToListAsync();

            return result;
        }

        public async Task CreateCategoryAsync(AddCategoryRequest model)
        {
            await _context.Categories
                .AddAsync(new Category()
                {
                    CategoryName = model.CategoryName
                });

            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsCategoryExistAsync(string categoryName)
        {
            return await _context.Categories
                .AnyAsync(c => c.CategoryName == categoryName);
        }

        public async Task UpdateCategoryNameAsync(EditCategoryRequest model)
        {
            await _context.Categories
                .Where(c => c.CategoryId == model.CategoryId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(c => c.CategoryName, model.NewName));
        }
    }
}