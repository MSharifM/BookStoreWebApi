namespace BookStore.Application.DTOs.CategoryDto
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
    }

    public class ListCategoriesResponse
    {
        public CategoryDto Category { get; set; } = null!;
        public int CountBooks { get; set; }
    }

    public class AddCategoryRequest
    {
        public string CategoryName { get; set; } = null!;
    }

    public class EditCategoryRequest
    {
        public int CategoryId { get; set; }
        public string NewName { get; set; } = null!;
    }
}