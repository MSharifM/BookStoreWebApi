using BookStore.Application.DTOs.CategoryDto;
using BookStore.Application.Interfaces.Repositories;
using BookStore.Application.Interfaces.Services;

namespace BookStore.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public Task<List<ListCategoriesResponse>> GetAllCategoriesAsync()
        {
            return _categoryRepository.GetCategoriesAsync();
        }

        public async Task AddCategoryAsync(AddCategoryRequest model)
        {
            if (await IsExistCategoryAsync(model.CategoryName))
                return;

            await _categoryRepository.CreateCategoryAsync(model);
        }

        public async Task UpdateCategoryNameAsync(EditCategoryRequest model)
        {
            if (await IsExistCategoryAsync(model.NewName))
                return;

            await _categoryRepository.UpdateCategoryNameAsync(model);
        }

        public async Task<List<ListCategoriesResponse>> SearchCategoryByNameAsync(string categoryName)
        {
            var result = await _categoryRepository.GetCategoriesAsync(categoryName);

            return result;
        }

        private async Task<bool> IsExistCategoryAsync(string categoryName)
        {
            return await _categoryRepository.IsCategoryExistAsync(categoryName);
        }
    }
}