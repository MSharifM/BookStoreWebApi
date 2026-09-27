using BookStore.Application.DTOs.CategoryDto;

namespace BookStore.Application.Interfaces.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<ListCategoriesResponse>> GetCategoriesAsync(string? categoryName = null);

        Task CreateCategoryAsync(AddCategoryRequest model);

        Task<bool> IsCategoryExistAsync(string categoryName);

        Task UpdateCategoryNameAsync(EditCategoryRequest model);
    }
}