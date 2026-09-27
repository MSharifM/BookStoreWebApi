using BookStore.Application.DTOs.CategoryDto;
using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET /api/category
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var result = await _categoryService.GetAllCategoriesAsync();

            return Ok(result);
        }

        // POST /api/category
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddCategory(AddCategoryRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            await _categoryService.AddCategoryAsync(model);

            return Created();
        }

        // PUT /api/category
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateCategory(EditCategoryRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            await _categoryService.UpdateCategoryNameAsync(model);

            return Ok();
        }

        // GET /api/category/search?name={bookName}
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> SearchCategory([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("نام دسته‌بندی الزامی است.");

            var result = await _categoryService.SearchCategoryByNameAsync(name);
            return Ok(result);
        }
    }
}