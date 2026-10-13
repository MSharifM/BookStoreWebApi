using BookStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        // GET /api/author/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchAuthor(string? name)
        {
            var result = await _authorService.SearchAuthorByName(name);

            return Ok(result);
        }
    }
}