using BookStore.Application.DTOs.CategoryDto;

namespace BookStore.Application.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<List<ListCategoriesResponse>> GetAllCategoriesAsync();

        Task AddCategoryAsync(AddCategoryRequest model);

        Task UpdateCategoryNameAsync(EditCategoryRequest model);

        Task<List<ListCategoriesResponse>> SearchCategoryByNameAsync(string categoryName);
    }
}